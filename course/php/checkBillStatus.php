<?php

use Qiwi\Api\BillPayments;
use FaaPz\PDO\Clause\Conditional;
include_once ('DB_Manager.php');
require_once '../vendor/autoload.php';

$PRIVATE_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImFqbzFqOS0wMCIsInVzZXJfaWQiOiI3OTEyMDUxMzE4OCIsInNlY3JldCI6IjNhMDE1MDNhMTU4YWM3NWI4NWY4Y2Y0Zjc5NTE4OTg1OTA3NDVlZTA4ZTk0NTBiYmMwYjNlNDUzMTEzZGI3MjMifX0=';

$signFromServer =  array_change_key_case(getallheaders())['x-api-signature-sha256']; 
$data = json_decode(file_get_contents('php://input'), true);
$bill = $data['bill'];
$notificationData = [
    'bill' => [
        'siteId' => $bill['siteId'],
        'billId' => $bill['billId'],
        'amount' => ['value' => $bill['amount']['value'], 'currency' => $bill['amount']['currency']],
        'status' => ['value' => $bill['status']['value']]
    ],
];
try {
    $billPayments = new BillPayments($PRIVATE_KEY);
    if ($billPayments->checkNotificationSignature($signFromServer,$notificationData, $PRIVATE_KEY)) {
        try {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        if ($bill['status']['value'] === 'PAID') {
            $db->update(['has_access' => true])->table('users')->where(new Conditional('email', '=', $bill['customer']['email']))->execute();
            $db->update(['status' => 'PAID'])->table('payments')->where(new Conditional('id','=', $bill['billId']))->execute();
            $result = $db->select(['reference_code'])->from('payments')->where(new Conditional('id','=', $bill['billId']))->execute();
            if ($result->rowCount() > 0) {
                fwrite($file, '/при оплате использовался реф код/ ');
                $ref_code = $result->fetch(PDO::FETCH_ASSOC)['reference_code'];
                $cur_number_of_sales = $db->select(['number_of_sales'])->from('merchants')->where(new Conditional('reference_code','=', $ref_code))->execute()->fetch(PDO::FETCH_ASSOC)['number_of_sales'];
                $db->update(['number_of_sales' => ++$cur_number_of_sales])->table('merchants')->where(new Conditional('reference_code','=', $ref_code))->execute();
            }
        }
        else
            $db->update(['status' => $bill['status']['value']])->table('payments')->where(new Conditional('id','=',$bill['billId']))->execute();
        } catch (Error $e){
            error_log($e->getMessage());
        }
}
} catch(ErrorException|BillPaymentsException $e) {
    error_log($e->getMessage());
}

<?php

use FaaPz\PDO\Clause\Conditional;

include_once('DB_Manager.php');
require_once '../vendor/autoload.php';

$responseCode = 2;
$discount = 0;
/*
     * Return codes
     * 0 - right reference_code
     * 1 - problem to connect to the DB
     * 2 - wrong reference_code
*/
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['reference_code'])) {
    $reference_code = $data['reference_code'];
    if (preg_match('#\d{6}#', $reference_code)) {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        try {
            $results = $db->select(['discount'])->from('merchants')->where(new Conditional('reference_code', '=', $reference_code))->execute();
            if ($results->rowCount() > 0) {
                $discount = $results->fetch(PDO::FETCH_ASSOC)['discount'];
                $responseCode = 0;
            }
        } catch (PDOException $e) {
            error_log($e->getMessage());
            $responseCode = 1;
        }
    }
}

echo '{"responseCode":' . $responseCode . ',"discount":' . $discount . '}';
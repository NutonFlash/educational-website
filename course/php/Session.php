<?php

use Ramsey\Uuid\Uuid;

include_once('DB_Manager.php');

class Session
{
    public static function addSession($user_id, $IP, $user_agent)
    {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        $id = Uuid::uuid4()->toString();
        $db->insert(['id', 'user_id', 'IP', 'user_agent'])->into('sessions')->values($id, intval($user_id), $IP, $user_agent)->execute();
        return $id;
    }
}
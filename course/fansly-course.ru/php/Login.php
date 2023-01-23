<?php

use FaaPz\PDO\Clause\Conditional;
use FaaPz\PDO\Clause\Grouping;

include_once('exceptions.php');
include_once('DB_Manager.php');

class Login
{
    private $email;
    private $password;

    public function __construct($email, $password)
    {
        $this->email = $email;
        $this->password = $password;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function login()
    {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        $result = $db->select(['login', 'email'])->from('users')->where(new Grouping('OR',
            new Grouping('AND', new Conditional('email', '=', $this->email), new Conditional('password', '=', $this->password)),
            new Grouping('AND', new Conditional('login', '=', $this->email), new Conditional('password', '=', $this->password))))->execute();
        if ($result->rowCount() === 0) {
            throw new LoginException('User {' . $_COOKIE['id'] . '} fail in logging', 2);
        } else {
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $login = $row['login'];
            $email = $row['email'];
            setcookie('login', $login, time() + 60 * 60 * 24 * 14, '/');
            setcookie('email', $email, time() + 60 * 60 * 24 * 14, '/');
        }
    }
}
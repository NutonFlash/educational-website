<?php

use FaaPz\PDO\Clause\Conditional;

include_once('exceptions.php');
include_once('Session.php');
include_once('Register.php');
include_once('Login.php');
include_once('DB_Manager.php');

class AuthUtilities
{

    public static function checkCookie()
    {
//        header('Access-Control-Allow-Origin', 'https://course');
//        header('Access-Control-Allow-Credentials', 'true');
        if (!isset($_COOKIE['id'])) {
            setcookie('id', Session::addSession(null, $_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT']), time() + 60 * 60 * 24 * 14, '/', httponly: true);
            setcookie('isAuth', 'false', time() + 60 * 60 * 24 * 14, '/', httponly:true);
            setcookie('module1', 'part1', time() + 60 * 60 * 24 * 14, '/');
            setcookie('module3', 'part1', time() + 60 * 60 * 24 * 14, '/');
            setcookie('module5', 'part1', time() + 60 * 60 * 24 * 14, '/');
        }
    }

    /*
     * Return codes
     * 0 - successful registration
     * 1 - problem to connect to the DB
     * 2 - duplicate login
     * 3 - duplicate email
    */
    public static function rigisterUser()
    {
        date_default_timezone_set('Europe/Moscow');
        $data = json_decode(file_get_contents('php://input'), true);
        $login = $data['login'];
        $email = $data['email'];
        $password = $data['password'];
        $IP = $_SERVER['REMOTE_ADDR'];
        $rememberToken = $_COOKIE['id'];
        $creationDate = date('d-m-y G:i', time());
        $register = new Register($login, $email, $password, $IP, $rememberToken, $creationDate);
        try {
            $register->register();
            // Приветственное письмо
            $subject = 'Добро пожаловать!';
            $preferences = ['input-charset' => 'UTF-8', 'output-charset' => 'UTF-8'];
            $encoded_subject = iconv_mime_encode('Subject', $subject, $preferences);
            $encoded_subject = substr($encoded_subject, strlen('Subject: '));
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            $message = file_get_contents('../views/utilities/mails/greeting_mail.html');
            mail($email, $encoded_subject, $message, $headers);
            setcookie('login', $login, time() + 60 * 60 * 24 * 14, '/', httponly: true);
            setcookie('email', $email, time() + 60 * 60 * 24 * 14, '/', httponly: true);
            return 0;
        } catch (DuplicateLoginException|DuplicateEmailException $e) {
            error_log($e->getMessage());
            return $e->getCode();
        } catch (UnsetPropertiesException $e) {
            error_log($e->getMessage());
        } catch (Error $e) {
            error_log($e->getMessage());
            return 1;
        }
    }

    /*
     * Return codes
     * 0 - successful login
     * 1 - problem to connect to the DB
     * 2 - login error
    */
    public static function loginUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'];
        $password = $data['password'];
        try {
            $login = new Login($email, $password);
            $login->login();
            return 0;
        } catch (LoginException $e) {
            error_log($e->getMessage());
            return 2;
        } catch (Error $e) {
            error_log($e->getMessage());
            return 1;
        }
    }

    public static function resetPassword()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $password = $data['password'];
        try {
            $dbManager = new DB_Manager();
            $db = $dbManager->connectDB();
            $db->update(['password' => $password])->table('users')->where(new Conditional('login', '=', $_COOKIE['login']))->execute();
            return 0;
        } catch (Error $e) {
            error_log($e->getMessage());
            return 1;
        }
    }

    public static function hasAccess()
    {
        if (isset($_COOKIE['isAuth']) && $_COOKIE['isAuth'] === 'true') {
            $dbManager = new DB_Manager();
            $db = $dbManager->connectDB();
            $result = $db->select(['has_access'])->from('users')->where(new Conditional('login', '=', $_COOKIE['login']))->execute();
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $hasAccess = $row['has_access'];
            return $hasAccess;
        } else return false;
    }
}
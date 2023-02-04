<?php

use FaaPz\PDO\Clause\Conditional;

include_once('exceptions.php');
include_once('DB_Manager.php');

class Register
{
    private $login;
    private $email;
    private $password;
    private $IP;
    private $rememberToken;
    private $creationDate;

    public function __construct($login, $email, $password, $IP, $rememberToken, $creationDate)
    {
        $this->login = $login;
        $this->email = $email;
        $this->password = $password;
        $this->IP = $IP;
        $this->rememberToken = $rememberToken;
        $this->creationDate = $creationDate;
    }

    public function getLogin()
    {
        return $this->login;
    }

    public function setLogin($login)
    {
        return $this->login = $login;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        return $this->email = $email;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword($password)
    {
        return $this->password = $password;
    }

    public function getIP()
    {
        return $this->IP;
    }

    public function setIP($IP)
    {
        return $this->IP = $IP;
    }

    public function getRememberToken()
    {
        return $this->rememberToken;
    }

    public function setRememberToken($rememberToken)
    {
        return $this->rememberToken = $rememberToken;
    }

    public function getCreationDate()
    {
        return $this->creationDate;
    }

    public function setCreationDate($creationDate)
    {
        return $this->creationDate = $creationDate;
    }

    public function register()
    {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        if ($this->validateData()) {
            $db->insert(['login', 'email', 'password', 'IP', 'remember_token', 'creation_date'])->into('users')->values($this->login, $this->email, $this->password, $this->IP, $this->rememberToken, $this->creationDate)->execute();
            $result = $db->select(['id'])->from('users')->orderBy('id', 'DESC')->execute();
            $id = $result->fetch(PDO::FETCH_ASSOC)['id'];
            $db->update(['user_id' => $id])->table('sessions')->where(new Conditional('id', '=', $this->rememberToken))->execute();
        }
    }

    private function validateData()
    {
        return ($this->arePropertiesSet() && $this->isLoginUnique() && $this->isEmailUnique());
    }

    private function arePropertiesSet()
    {
        if (isset($this->login) && isset($this->email) && isset($this->password))
            return true;
        else throw new UnsetPropertiesException('User {' . $this->rememberToken . '} don\'t set some required data');
    }

    private function isLoginUnique()
    {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        $result = $db->select(['login'])->from('users')->where(new Conditional('login', '=', $this->login))->execute();
        if ($result->rowCount() > 0)
            throw new DuplicateLoginException('User {' . $this->rememberToken . '} set duplicate login', 2);
        else return true;
    }

    private function isEmailUnique()
    {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        $result = $db->select(['email'])->from('users')->where(new Conditional('email', '=', $this->email))->execute();
        if ($result->rowCount() > 0)
            throw new DuplicateEmailException('User {' . $this->rememberToken . '} set duplicate email', 3);
        else return true;
    }
}
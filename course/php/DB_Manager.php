<?php

use FaaPz\PDO\Database;


class DB_Manager
{
    private $dsn = 'mysql:host=localhost;dbname=u1870183_course;charset=UTF8';
    private $usr = 'u1870183_root';
    private $pwd = 'Sahalox2';

    public function __construct()
    {
    }

    public function getDsn()
    {
        return $this->dsn;
    }

    public function setDsn($dsn)
    {
        return $this->dsn = $dsn;
    }

    public function getUsr()
    {
        return $this->usr;
    }

    public function setUsr($usr)
    {
        return $this->usr = $usr;
    }

    public function getPwd()
    {
        return $this->pwd;
    }

    public function setPwd($pwd)
    {
        return $this->pwd = $pwd;
    }

    public function connectDB()
    {
        try {
            return new Database($this->dsn, $this->usr, $this->pwd);
        } catch (PDOException $e) {
            error_log($e->getTraceAsString());
            error_log($e->getMessage());
        }
    }
}
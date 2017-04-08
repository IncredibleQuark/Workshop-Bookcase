<?php

define('DB_LOGIN', 'root');
define('DB_PASS', 'coderslab');
define('DB_DB', 'Library');
define('DB_HOST', 'localhost');

//connecting with database
try {
    $conn = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_DB . ';charset=utf8mb4', DB_LOGIN, DB_PASS, [
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo 'DB ERROR: ' . $e->getMessage();
    exit;
}
<?php

//ladujemy niezbędne pliki 
require_once(__DIR__ . '/src/db.php');
require_once(__DIR__ . '/src/Book.php');

//sprawdzamy jakim rodzajem (HTTP) wysłano żądanie
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $books = [];
    //sprawdzamy czy przekazano ID
    if (isset($_GET['id'])) {
        //pobieramy id ksiązki
        $id = intval($_GET['id']);
        $books = Book::loadFromDb($conn, $id);
    } else {
        //pobieramy wszystkie książki
        $books = Book::loadAllFromDb($conn);
    }
    
    //zwracamy jsona
    echo json_encode($books);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //tworzymy obiekt nowej książki
    $newBook = new Book();
    $newBook->setAuthor($_POST['author']);
    $newBook->setTitle($_POST['title']);
    $newBook->setDescription($_POST['description']);
    
    $addedBookArray = $newBook->create($conn);
    //tworzymy json z obieku ksiązki i zwracamy go w tablicy 1 elementowej
    echo json_encode($addedBookArray);
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {

    parse_str(file_get_contents("php://input"), $put_vars);
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    parse_str(file_get_contents("php://input"), $del_vars);
}

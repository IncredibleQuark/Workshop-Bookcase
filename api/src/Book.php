<?php

class Book implements JsonSerializable {

    private $id;
    private $title;
    private $author;
    private $description;

    public function __construct() {
        $this->id = -1;
        $this->setAuthor('');
        $this->setTitle('');
        $this->setDescription('');
    }

    public function create(PDO $conn) {
        $stmt = $conn->prepare('INSERT INTO books SET author=:author, title=:title, description=:description');
        $result = $stmt->execute([
            'author' => $this->getAuthor(),
            'title' => $this->getTitle(),
            'description' => $this->getDescription(),
        ]);
        $insertedId = $conn->lastInsertId();
        if ($insertedId > 0) {
            $this->id = $insertedId;
            return [json_encode($this)];
        } else {
            return [];
        }
    }

    public function update(PDO $conn) {
        
    }

    public function delete(PDO $conn) {
        
    }

    //funkcja ladujaca pojedynczy wiersz
    static public function loadFromDb(PDO $conn, $id) {
        $stmt = $conn->prepare('SELECT * FROM books WHERE id=:id');
        $result = $stmt->execute(['id' => $id]);

        if ($result && $stmt->rowCount() > 0) {
            $row = $stmt->fetch();

            $book = new Book();
            $book->id = $row['id'];
            $book->author = $row['author'];
            $book->title = $row['title'];
            $book->description = $row['description'];

            //implementujemy interfejs ponieważ nie można zrobić jsona z obiektu
            return [json_encode($book)];
        } else {
            return [];
        }
    }

    //funkcja pobierajaca wszystkie wiersze
    static public function loadAllFromDb(PDO $conn) {
        $result = $conn->query('SELECT * FROM books');
        $books = [];

        //iterumey po rekordach z bazy
        foreach ($result as $row) {
            //tworzymy do kazdego rekordu obiekt ksiązki
            $book = new Book();
            $book->id = $row['id'];
            $book->author = $row['author'];
            $book->title = $row['title'];
            $book->description = $row['description'];

            //i wrzucamy go do tablicy
            $books[] = json_encode($book);
        }

        return $books;
    }

    public function jsonSerialize() {
        //metoda interfejsu
        //ta tablica bedzie zwrocona przy przekazaniu obiektu do json_encode()
        return [
            'id' => $this->id,
            'author' => $this->author,
            'title' => $this->title,
            'description' => $this->description,
        ];
    }

    public function getId() {
        return $this->id;
    }

    public function getTitle() {
        return $this->title;
    }

    public function getAuthor() {
        return $this->author;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setTitle($title) {
        $this->title = $title;
    }

    public function setAuthor($author) {
        $this->author = $author;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

}

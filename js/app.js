$(function () {

    var divBooks = $('div#books');
    //pobieramy ksiazki po zaladowaniu strony
    $.ajax({
        url: 'api/books.php',
        dataType: 'json'
    }).done(function (bookList) {
        //bookList - tablica obiektow ksiazek w json
        bookList.forEach(function (singleBookJson) {
            var singleBook = JSON.parse(singleBookJson);
            //tworzymy element li z nową książk
            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><div class="bookDescription" style="margin-top:20px; font-weight: bold; color: blue; font-size: 13px;"></div></div><hr>');
            //dodajemy element do listy
            divBooks.append(newLi);
        });
    }).fail(function () {
        console.log('Error');
    });

    //dodajemy event na tytul książki

    //sposob na dodawanie eventow do elementow ladowanych dynamicznie
    //event zakladamy na dowolnego przodka NIE ZALADOWANEGO DYNAMICZNIE
    //jako drugi argument metody on() podajemy SELEKTOR (string) 
    //elementu dynamicznie ladowanego na jakim event nas interesuje
    //$(this) to element z drugiego argumentu
    divBooks.on('click', 'span.bookTitle', function () {
        //pobieramy id książki z datasetu
        var span = $(this);
        var bookId = span.parent().data('id');
        //pobieramy opis książki

        $.ajax({
            url: 'api/books.php?id=' + bookId,
            dataType: 'json'
        }).done(function (bookList) {
            //bookList - tablica obiektow ksiazek w json
            //w tym wypadku tablica 1 elementowa
            //poneiwaz pobieramy 1 ksiązke po id
            var singleBook = bookList;
            span.next().text(singleBook.description);

            //dodanie przycisku usuwania
            var delBtn = $('<br><button id="del">Usuń</button>');
            span.next().append(delBtn);
            //dodanie przycisku edycji
            var delBtn = $('<br><button id="edit">Edytuj</button>');
            span.next().append(delBtn);


        }).fail(function () {
            console.log('Error');
        });
    });

    //DODAWANIE KSIĄŻKI

    var addBook = $('#addBook');
    addBook.on('click', function (e) {
        e.preventDefault();//KONIECZNE - poniewaz wysyłamy ajaxem
        //pobieramy  dane z formularza
        var form = $(this).parent();//zapisuje do zmiennej formularz

        var author = form.find('input[name=author]').val();
        var title = form.find('input[name=title]').val();
        var description = form.find('textarea[name=description]').val();

        //tworzymy obiekt z danymi do wysłania
        var sendObj = {};
        sendObj.author = author;
        sendObj.title = title;
        sendObj.description = description;
        //wysylamy żądanie ajax o dodanie książki
        $.ajax({
            url: 'api/books.php', //adres na jaki wysyłamy
            dataType: 'json', //typ danych ZWRACANYCH
            data: sendObj, //obiekt z danymi
            type: 'POST'//dodajemy więc POST (REST)
        }).done(function (bookList) {
            var singleBook = JSON.parse(bookList[0]);
            //tworzymy element li z nową książk
            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><div class="bookDescription" style="margin-top:20px; font-weight: bold; color: blue; font-size: 13px;"></div>\n\
                        </div><hr>');
            //dodajemy element do listy
            divBooks.append(newLi);
            //komunikat
            alert('Książa dodana!');
        }).fail(function () {
            alert('Błąd!');
        });
    });





    //dodanie formularza edycji
    divBooks.on('click', 'button#edit', function (e) {
        e.preventDefault();
        var btn = $(this);
        var id = btn.parent().parent().data('id');
        var title = btn.parent().parent().find('span').text();
        var newForm = $('<form action="" method="POST" id="editForm"><input type="text" name="titleEdit" value=' + title + '><button id="confirm" type="submit">Zatwierdź</button></form>');
        btn.parent().append(newForm);
    });

    //aktualizacja tytułu książki
    divBooks.on('click', 'button#confirm', function (e) {
        e.preventDefault();
        var form = $(this).parent();
        var title = form.find('input[name=titleEdit]').val();

        var btn = $(this);
        var id = btn.parent().parent().parent().data('id');
        console.log(id);
        
        //przesłanie id książki i tytułu metodą PUT
        $.ajax({
            url: 'api/books.php?id='+id+'&title='+title,
            dataType: 'json',
            type: 'PUT'
        }).done(function (success) {
            if (success) {
                divBooks.fadeOut(800, function () {
                    divBooks.fadeIn().delay(2000);
                });
            }
        }).fail(function () {
            alert('error');
        });
    });




    //Usuwanie książki

    divBooks.on('click', 'button#del', function (e) {
        e.preventDefault();
        var btn = $(this);

        var id = btn.parent().parent().data('id');


        $.ajax({
            url: 'api/books.php',
            dataType: 'json',
            data: 'id=' + id,
            type: 'DELETE'
        }).done(function (success) {
            if (success) {
                btn.parent().parent().remove();

            }
        }).fail(function () {
            console.log('error');
        });
    });
});
//AKTUALIZACJA KSIĄŻEK (PUT)
//1) do każdego diva z opisem (lub dodatkowego pod nim) dodajemy formularz edycji książki
//2) formualrz jest ukryty domyslnie i zaladowany danymi ksiazki val('wartosc')
//3) dodajemy przycisk do edycji analogicznie jak w DELETE
//4) zakladamy event na przycisk (pamietamy ze jest ladowany dynamicznie)
//5) po kliknieciu pokazujemy formualarz
//6) po klikeniciu w submit formularza pobieramy z niego dane (podobnie jak POST)
//7) tworzymy obiekt do wyslania (jak w POST) - dodać ID!!!!
//8) wysylamy ajaxem metodą PUT przekazujac obiekt (PAMIĘTAMY o dodaniu ID
//9) pobieramy z bazy obiekt książki na backendzie z aktualnymi danymi
//10) aktualizujemy seterami dane w obiekcie
//11) wywołujemy metodę update()
//12) jak się uda to w drzewie dom aktualizujemy tytul i opis elementu

//USUWANIE KSIĄŻEK (DELETE)
//1) dodajemy przycisk obok tytułu z usuwaniem podczas tworzenia ksiazki
//pamietamy zeby dodac przycisk jak ladujemy przy ladowaniu strony i dodaniu (POST)
//2) zakladamy event na przycisk (pamietamy ze on jest ladowany dynamicznie)
//po kliknieciu pobieramy id ksiazki (rodzic) i wysylamy do ajaxa za pomocą
//metody DELETE (bardzo podobnie jak GET)
//3) pobieracie ksiązkę z bazy odpowiednią metoda po id (filtrujemy na int)
//4) mając obiekt ksiązki wywołujemy metodę delete()
//5) jeśli się uda to usuwamy książkę z drzewa DOM

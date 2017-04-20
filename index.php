<html>
    <head>
        <title>Library</title>
    </head>
    <body>
        <div>
            <h3>Dodaj książkę</h3>
            <form>
                Autor:<br>
                <input type="text" name="author"/>
                <hr>
                Tytuł:<br>
                <input type="text" name="title"/>
                <hr>
                Opis:<br>
                <textarea name="description"></textarea>
                <hr>
                <button id="addBook">Dodaj książkę</button>
            </form>
        </div>
        
        <h3>Lista książęk</h3>
        <div id="books">
            
        </div>
  
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>


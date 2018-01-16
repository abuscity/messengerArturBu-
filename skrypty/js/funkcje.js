var API = "http://arturmsg.azurewebsites.net/api/";
var API_UZYTKOWNICY = API + "Uzytkownicy/";
var API_CHAT = API + "chat/";

var przyciskStworz = null;
var przyciskWiadomosc = null;
var mojeID = -100;
var wybranyUzytkownik = null;

function clickOnUzytkownik(uzytkownik) {
    wybranyUzytkownik = uzytkownik;

    pobierzHistorieWiadomosci();
    $("#rozmowa").removeClass("hidden-xs-up");
    $("#rozmowaHeader").html("<p>Rozmowa z " + uzytkownik + "</p>");
    $("#tekstWiadomosc").val("");
    //alert(uzytkownik);
    setInterval(function() {
            pobierzHistorieWiadomosci();
        },
        5000);
}

function pobierzHistorieWiadomosci() {
    var divrozmowaWiadomosci = $("#rozmowaWiadomosci");
    $.getCORS(API_CHAT + mojeID + "/" + listaUzytkownikowzID[wybranyUzytkownik]).done(function (dane) {
        if (dane.length === 0) {
            divrozmowaWiadomosci.html('<div class="rounded border border-danger align-middle">Historia pusta</div>');
        } else {
            divrozmowaWiadomosci.html('<div class="line-container"><ul class="ul-msg" ></ul></div>');
            dane.forEach(
                function (wiadomosc) {
                    dodajWiadomosc(wiadomosc, wiadomosc.Od === mojeID);
                });
        }
    }).fail(function () {
        divrozmowaWiadomosci.text("Nie udalo pobrac sie wiadomosci z serwera.");
    });
}
function pobierzListeUzytkownikow() {
    $.getCORS(API_UZYTKOWNICY).done(function (dane) {
        ukryj("#loaderUzytkownicy");
        //wyczysc wszystko
        listaUzytkownikowzID = [];
        $("#listaUzytkownikow").html();
        $("#listaUzytkownikow").removeClass("hidden-xs-up");

        //TODO: dodac filtrowanie, zeby sam siebie nie dodawal do tabelki
        dane.forEach(function (uzytkownik) {
            dodajDoTabeli(uzytkownik);
        });
        //do kazdego uzytkownika dodaj obsluge click
        $('#listaUzytkownikow li').click(function (e) {
            $('#listaUzytkownikow li').removeClass("active");
            $(e.target).addClass("active");
            clickOnUzytkownik($(e.target).text());

        });
    }).fail(function () {
        ukryj("#loaderUzytkownicy");
        $("#listaUzytkownikow").removeClass("hidden-xs-up");
        $("#listaUzytkownikow").html("<p>Niestety, nie udalo sie wczytac listy uzytkownikow</p>");
    });

}
function wyslijWiadomosc(e) {

    var wiadomosc = {
        Od: mojeID,
        Do: listaUzytkownikowzID[wybranyUzytkownik],
        Wiadomosc: $("#tekstWiadomosc").val(),
        Data: (new Date()).toJSON()
    };

    $.putCORS(API_CHAT, wiadomosc).done(function (dane) {
        console.log("sukces");
        $("#tekstWiadomosc").val("");
        pobierzHistorieWiadomosci();
    }).fail(function () {
        console.log("fail");
    });
}

function zaloguj(e) {
    var loginU = $("#zaloguj_login").val();
    var hasloU = $("#zaloguj_haslo").val();
    var parametry = "Login/" + loginU + "/" + hasloU;

    //wywolanie metody API
    $.getCORS(API_UZYTKOWNICY + parametry).done(function (dane) { //jak sie wykona to wykonujemy ta akcje
        //alert(dane);
        if (dane == "false" || dane == "") {
            alert("Zly login lub haslo");
            return;
        }
        mojeID = dane;
        pokazCzat();
        pobierzListeUzytkownikow();
    }).fail(function () {
        alert("Zly login lub haslo");
    });
    //
}
function wyloguj(e) {
    ukryj("#newlogin");
    ukryj("#chat");
    pokaz("#login");
}
function stworzUzytkownika() {
    var login = $("#nowyLogin").val();
    var haslo = $("#haslo1").val();
    var uzytkownik = {
        Login: login,
        Haslo: haslo
    };
    $.postCORS(API_UZYTKOWNICY, uzytkownik).done(function (dane) {
        $("#nowyLogin").val("");
        $("#haslo1").val("");
        $("#haslo2").val("");
        $("#bladNowego").text("Uzytkownik zostal stworzony");
    }).fail(function () {
        alert("Blad dodania nowego uzytkownika");
    });
}


$.when($.ready).then(function () {
    $(document).ajaxError(function () { //globalna obsluga bledow AJAX
        console.log("Blad wywolania Ajax");
    });

    //rejestrowanie Eventow
    $(document).on("click", "#btnNowy", pokazNowyLogin);
    $(document).on("click", "#btnLoguj", zaloguj);
    $(document).on("click", "#btnWyloguj", wyloguj);
    $(document).on("click", "#btnWyslij", wyslijWiadomosc);
    $(document).on("click", "#btnStworz", stworzUzytkownika);
    $("#haslo1").change(sprawdzNowyLogin);
    $("#haslo2").change(sprawdzNowyLogin);
    $("#nowyLogin").change(sprawdzNowyLogin);
    $("#tekstWiadomosc").change(sprawdzWiadomosc);
    przyciskStworz = $("#btnStworz");
    przyciskStworz.attr("disabled", true);
    przyciskWiadomosc = $("#btnWyslij");
    //$("#nowy").click(pokazNowyLogin);
});
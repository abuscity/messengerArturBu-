
/**
 * FUNKCJE POMOCNICZE
 */
//dodatkowe funkcje do jquery, zeby nie miec problemow z security
var listaUzytkownikowzID = [];

jQuery.getCORS = function (url, func) {
    if (func == undefined)
        func = function () { };
    return $.ajax({
        type: 'GET',
        url: url,
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        //xhrFields: { withCredentials: true },
        success: function (res) { func(res) }, error: function () { func({}) }
    });
}
jQuery.postCORS = function (url, data, func) {
    if (func == undefined)
        func = function () { };
    return $.ajax({
        type: 'POST',
        crossDomain: true,
        url: url,
        data: data,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        //xhrFields: { withCredentials: true },
        success: function (res) { func(res) }, error: function () { func({}) }
    });
}
jQuery.putCORS = function (url, data, func) {
    if (func == undefined)
        func = function () { };
    return $.ajax({
        type: 'PUT',
        crossDomain: true,
        url: url,
        data: data,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        //xhrFields: { withCredentials: true },
        success: function (res) { func(res) }, error: function () { func({}) }
    });
}

//ukrywanie pokazywanie
function pokaz(element) {
    $(element).removeClass("hidden-xs-up");
}
function ukryj(element) {
    $(element).addClass("hidden-xs-up");
}
function pokazNowyLogin(e) {
    e.preventDefault();
    pokaz("#newlogin");
    ukryj("#chat");
    ukryj("#login");

}

function pokazCzat() {
    ukryj("#newlogin");
    pokaz("#chat");
    ukryj("#login");
}
function dodajDoTabeli(uzytkownik) {
    listaUzytkownikowzID[uzytkownik.Login] = uzytkownik.Id;

    $('#listaUzytkownikow:last-child').append('<li class="list-group-item">' + uzytkownik.Login + '</li>');   
}
//sprawdzanie tego co wpisal uzytkownik
function sprawdzNowyLogin() {
    $("#bladNowego").text("");
    var has1 = $("#haslo1").val();
    var has2 = $("#haslo2").val();
    var login = $("#nowyLogin").val();
    var blad = false;
    if (login === null || login === "") {
        $("#bladNowego").text("Login nie moze byc pusty");
        blad = true;
    }
    if (has1 != "" && has1 != has2) {
        $("#bladNowego").text("Hasla musza byc takie same");
        blad = true;
    }
    if (blad === false) {
        przyciskStworz.attr("disabled", false);
    } else {
        przyciskStworz.attr("disabled", true);
    }
}

function sprawdzWiadomosc() {
    var wiad = $("#tekstWiadomosc");
    if (wiad === null || wiad === "") {
        przyciskWiadomosc.attr("disabled", true);
    } else {
        przyciskWiadomosc.attr("disabled", false);
    }
}
function dodajWiadomosc(wiadomosc, strona) {
    var element = $('#rozmowaWiadomosci > div > ul:last-child');

    if (strona === true) {
        element.append('<li class="li-msg place-right clear-fix right-msg-container">' +
            '<span class="msg-box-right" data-timestamp="' + wiadomosc.Data + '">' +
            wiadomosc.Wiadomosc + '</span></li>');  
    }
    else if (strona === false) {
        element.append('<li class="li-msg place-left clear-fix left-msg-container">' +
            '<span class="msg-box-right" data-timestamp="' + wiadomosc.Data + '">' +
            wiadomosc.Wiadomosc + '</span></li>'); 
    }  
}
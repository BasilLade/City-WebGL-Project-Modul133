/**
 * Diese Funktion verhindert die Eingabe von Buchstaben und
 * jeglichen Sonderzeichen, bei den entsprechenden Eingabefeldern
 * (z.B. Anzahl Häuser). 
 * 
 * @function onlyNumbers
 * @param {type} event Enthält den "inhalt" der Benutzereingabe.
 * @returns {Boolean} liefert falsch zurück, falls versucht wurde Buchstaben
 * oder Sonderzeichen einzugeben.
 */
function onlyNumbers(event) {
    return event.charCode >= 48 && event.charCode <= 57;
}

/**
 * Diese Funktion erzeugt ein Popup. Der Inhalt variert sich, jenachdem
 * welcher Button gedrückt wurde.
 * 
 * @function showInformationPopup
 * @param {type} event Enthält den "inhalt" der Buttons.
 * @returns {Void} Funktion liefert keinen Rückgabewert.
 */
function showInformationPopup(event) {
    // Wenn "Hilfe" Button gedrückt wurde, zeige das entsprechende Popup.
    if (event.target.id === "help") {
        var formattedControlsText = "<span style='font-weight: bold;'> Tastatur </span>" +
                "<br>vorwärts (w)" +
                "<br>rückwärts (s)" +
                "<br>rechts (a)" +
                "<br>links (d)" +
                "<br>runter (f)" +
                "<br>rauf (r)" +
                "<br>bild einfrieren (q)" +
                "<br><br><span style='font-weight: bold;'> Maus </span>" +
                "<br>vorwärts (linke Maustaste halten)" +
                "<br>rückwärts (rechte Maustaste halten)";
        // javascript library für popup-box
        swal({
            title: event.target.id,
            text: formattedControlsText,
            type: "info",
            html: true
        });
    }

    // Wenn "About" Button gedrückt wurde, zeige das entsprechende Popup.
    else if (event.target.id === "about") {
        var formattedAboutText = "Dieses Projekt stammt von " +
                "Basil Lade und Andri Feldmann.";

        // javascript library für popup-box
        swal({
            title: event.target.id,
            text: formattedAboutText,
            type: "info",
            html: true
        });
    }
}
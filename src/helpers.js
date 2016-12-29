export function getHumanDate(milliseconds) {

    var today = new Date(); // default is current date
    if (milliseconds)
        today = new Date(milliseconds);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return mm + '/' + dd + '/' + yyyy;
}
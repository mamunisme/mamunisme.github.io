function validateForm() {
    var un = document.loginform.username.value;
    var pw = document.loginform.password.value;
    var username = "mamunisme";
    var password = "mamun123";
    if ((un == username) && (pw == password)) {

        return true;
    } else {
        alert("Login tidak berhasil, masukan username dan password yang benar");
        return false;
    }
}
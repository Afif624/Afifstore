<?php
session_start();

// Memeriksa apakah pengguna sudah login atau belum
if (!isset($_SESSION['id_user'])) {
    // Jika pengguna belum login, kirim header dengan status 401 Unauthorized
    header("HTTP/1.1 401 Unauthorized");
    exit();
} else {
    // Jika pengguna sudah login, kirim header dengan status 200 OK
    header("HTTP/1.1 200 OK");
    echo 'logged_in';
    exit();
}
?>

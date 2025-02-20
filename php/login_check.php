<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Memeriksa apakah pengguna sudah login atau belum
if (isset($_SESSION['id_user'])) {
    // Check if 'id' is set in the GET request
    if (isset($_GET['id'])) {
        // Query untuk mengambil nama dan email dari tabel pengguna berdasarkan id_user
        $id_user = $_SESSION['id_user'];
        $sql_user = "SELECT nama, email FROM user WHERE id_user = $id_user";
        $result_user = $conn->query($sql_user);
        if ($result_user->num_rows > 0) {
            $row_user = $result_user->fetch_assoc();
            $nama_user = $row_user['nama'];
            $email_user = $row_user['email'];
        } else {
            $nama_user = "Nama Pengguna";
            $email_user = "email@example.com";
        }

        // Send both game and reviews to JS
        $data = [
            'nama_user' => $nama_user,
            'email_user' => $email_user
        ];

        // Mengirimkan data produk sebagai respons JSON
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        // Jika pengguna sudah login, kirim header dengan status 200 OK
        header("HTTP/1.1 200 OK");
        echo 'logged_in';
        exit();
    }
} else {
    // Jika pengguna belum login, kirim header dengan status 401 Unauthorized
    header("HTTP/1.1 401 Unauthorized");
    exit();
}
?>

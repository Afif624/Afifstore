<?php
session_start();

// Memeriksa apakah pengguna sudah login atau belum
if (!isset($_SESSION['id_user'])) {
    // Redirect ke halaman login jika pengguna belum login
    header("Location: ../login.html");
    exit();
}

// Memeriksa apakah data wishlist dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add'])) {
    // Include file koneksi ke database
    include_once("connect.php");

    // Mendapatkan data yang dikirimkan dari form
    $id_produk = $_POST['id_produk'];
    $id_user = $_SESSION['id_user'];

    // SQL untuk menghapus wishlist
    $sql = "INSERT INTO wishlist(id_user, id_produk) VALUES('$id_user','$id_produk')";

    if ($conn->query($sql) === TRUE) {
        // Jika wishlist berhasil dihapus, kembalikan ke halaman wishlist
        echo "<script>alert('Add to wishlist successful!!');
            window.location.href = '../detail.html?id=$id_produk';
                </script>";
    } else {
        // Jika terjadi kesalahan, tampilkan pesan error
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Tutup koneksi database
    $conn->close();
} else {
    // Jika metode request bukan POST, redirect ke halaman wishlist
    header("Location: ../detail.html?id=$id_produk");
    exit();
}
?>
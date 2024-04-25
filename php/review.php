<?php
session_start();

// Memeriksa apakah pengguna sudah login atau belum
if (!isset($_SESSION['id_user'])) {
    // Redirect ke halaman login jika pengguna belum login
    header("Location: ../login.html");
    exit();
}

// Memeriksa apakah data review dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Include file koneksi ke database
    include_once("connect.php");

    // Mendapatkan data yang dikirimkan dari form
    $id_produk = $_POST['id_produk'];
    $id_user = $_SESSION['id_user'];
    $rating = $_POST['rating'];
    $review = $_POST['review'];

    // SQL untuk menyimpan review ke database
    $sql = "INSERT INTO review (id_produk, id_user, rating, review) 
            VALUES ('$id_produk', '$id_user', '$rating', '$review')";

    if ($conn->query($sql) === TRUE) {
        // Jika review berhasil disimpan, kembalikan ke halaman detail produk
        echo "<script>alert('Adding review successful!!');
            window.location.href = '../detail.html?id=$id_produk';
                </script>";
    } else {
        // Jika terjadi kesalahan, tampilkan pesan error
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Tutup koneksi database
    $conn->close();
} else {
    // Jika metode request bukan POST, redirect ke halaman detail produk
    header("Location: ../detail.html?id=$id_produk");
    exit();
}
?>

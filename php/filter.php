<?php
// fetch_produk.php

// Sambungan database
$mysqli = new mysqli("localhost", "root", "", "gamestore");

// Periksa koneksi
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Inisialisasi filter
$whereClause = "";

// Filter kategori (contoh, Anda harus mengganti ini dengan cara yang sesuai dengan struktur database Anda)
if (isset($_POST['kategori'])) {
    $kategori = $_POST['kategori'];
    $whereClause .= " AND kategori = '$kategori'";
}

// Filter genre (contoh, Anda harus mengganti ini dengan cara yang sesuai dengan struktur database Anda)
if (isset($_POST['genre'])) {
    $genre = $_POST['genre'];
    $whereClause .= " AND genre = '$genre'";
}

// Filter harga (contoh, Anda harus mengganti ini dengan cara yang sesuai dengan struktur database Anda)
if (isset($_POST['harga'])) {
    $harga = $_POST['harga'];
    // Contoh filter harga: Ambil produk dengan harga kurang dari atau sama dengan $harga
    $whereClause .= " AND harga <= $harga";
}

// Query untuk mengambil data produk dengan filter yang dipilih
$query = "SELECT * FROM produk WHERE 1 $whereClause";
$result = $mysqli->query($query);

// Inisialisasi array untuk menyimpan data produk
$produkData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Menambahkan data produk ke dalam array
        $produkData[] = $row;
    }
}

// Menutup koneksi database
$mysqli->close();

// Mengirimkan data produk sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($produkData);
?>

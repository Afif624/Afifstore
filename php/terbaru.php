<?php
// fetch_produk.php

// Sambungan database
$mysqli = new mysqli("localhost", "root", "", "gamestore");

// Periksa koneksi
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Query untuk mengambil data produk
$query = "SELECT * FROM produk ORDER BY tgl_produk DESC";
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

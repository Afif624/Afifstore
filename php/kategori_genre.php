<?php
// fetch_kategori_genre.php

// Sambungan database
$mysqli = new mysqli("localhost", "root", "", "gamestore");

// Periksa koneksi
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Query untuk mengambil data kategori
$queryKategori = "SELECT * FROM kategori";
$resultKategori = $mysqli->query($queryKategori);

// Query untuk mengambil data genre
$queryGenre = "SELECT * FROM genre";
$resultGenre = $mysqli->query($queryGenre);

// Inisialisasi array untuk menyimpan data kategori dan genre
$data = array();

if ($resultKategori->num_rows > 0) {
    while($row = $resultKategori->fetch_assoc()) {
        // Menambahkan data kategori ke dalam array
        $data['kategori'][] = $row;
    }
}

if ($resultGenre->num_rows > 0) {
    while($row = $resultGenre->fetch_assoc()) {
        // Menambahkan data genre ke dalam array
        $data['genre'][] = $row;
    }
}

// Menutup koneksi database
$mysqli->close();

// Mengirimkan data kategori dan genre sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>

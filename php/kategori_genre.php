<?php
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data kategori
$queryKategori = "SELECT * FROM kategori";
$resultKategori = $conn->query($queryKategori);

// Query untuk mengambil data genre
$queryGenre = "SELECT * FROM genre";
$resultGenre = $conn->query($queryGenre);

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
$conn->close();

// Mengirimkan data kategori dan genre sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>

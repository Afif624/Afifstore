<?php
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data produk
$query = "SELECT * FROM produk ORDER BY tgl_produk DESC";
$result = $conn->query($query);

// Inisialisasi array untuk menyimpan data produk
$produkData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Menambahkan data produk ke dalam array
        $produkData[] = $row;
    }
}

// Menutup koneksi database
$conn->close();

// Mengirimkan data produk sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($produkData);
?>

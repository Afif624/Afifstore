<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data produk
$id_user = $_SESSION['id_user'];
$query = "SELECT * FROM wishlist 
    LEFT JOIN produk ON wishlist.id_produk = produk.id_produk 
    WHERE id_user=$id_user";
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
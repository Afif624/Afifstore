<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data produk
$id_user = $_SESSION['id_user'];
$query = "SELECT *, SUM(harga_produk) AS total_harga FROM `order`
    LEFT JOIN produk ON `order`.id_produk = produk.id_produk 
    WHERE id_user=$id_user GROUP BY waktu, id_order";
$result = $conn->query($query);

// Inisialisasi array untuk menyimpan data produk yang dikelompokkan berdasarkan waktu
$groupedData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $waktu = $row['waktu'];
        // Menambahkan data produk ke dalam array yang sesuai dengan grup waktu
        $groupedData[$waktu][] = $row;
    }
}

// Menutup koneksi database
$conn->close();

// Mengirimkan data produk yang telah dikelompokkan sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($groupedData);
?>
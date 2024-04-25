<?php
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data kategori dan jumlah produk yang terhubung dengan kategori
$query = "SELECT kategori.nama_kategori, COUNT(detailkategori.id_produk) AS jumlah_produk
          FROM kategori
          LEFT JOIN detailkategori ON kategori.id_kategori = detailkategori.id_kategori
          GROUP BY kategori.id_kategori";
$result = $conn->query($query);

// Inisialisasi array untuk menyimpan data kategori
$kategoriData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Menambahkan data kategori ke dalam array
        $kategoriData[] = $row;
    }
}

// Menutup koneksi database
$conn->close();

// Mengirimkan data kategori sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($kategoriData);
?>

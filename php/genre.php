<?php
// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data genre dan jumlah produk yang terhubung dengan genre
$query = "SELECT genre.nama_genre, COUNT(detailgenre.id_produk) AS jumlah_produk
          FROM genre
          LEFT JOIN detailgenre ON genre.id_genre = detailgenre.id_genre
          GROUP BY genre.id_genre";
$result = $conn->query($query);

// Inisialisasi array untuk menyimpan data genre
$genreData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Menambahkan data genre ke dalam array
        $genreData[] = $row;
    }
}

// Menutup koneksi database
$conn->close();

// Mengirimkan data genre sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($genreData);
?>

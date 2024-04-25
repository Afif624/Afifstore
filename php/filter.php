<?php
// Include file koneksi ke database
include_once("connect.php");

// Initialize filter
$whereClause = " WHERE 1";

// Filter by category
if (isset($_GET['kategori'])) {
    $kategori = $_GET['kategori'];
    $whereClause .= " AND kategori.id_kategori IN ($kategori)";
}

// Filter by genre
if (isset($_GET['genre'])) {
    $genre = $_GET['genre'];
    $whereClause .= " AND genre.id_genre IN ($genre)";
}

// Filter by price
if (isset($_GET['harga'])) {
    $harga = $_GET['harga'];
    // Example price filter: Get products with price less than or equal to $harga
    $whereClause .= " AND harga_produk <= $harga";
}

// Query to retrieve product data with selected filters
$query = "SELECT produk.* FROM produk";
$query .= " INNER JOIN detailkategori ON produk.id_produk = detailkategori.id_produk";
$query .= " INNER JOIN kategori ON detailkategori.id_kategori = kategori.id_kategori";
$query .= " INNER JOIN detailgenre ON produk.id_produk = detailgenre.id_produk";
$query .= " INNER JOIN genre ON detailgenre.id_genre = genre.id_genre";
$query .= $whereClause;
$query .= " GROUP BY produk.id_produk"; // To avoid duplicate products

$result = $conn->query($query);

// Initialize array to store product data
$produkData = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Adding product data to the array
        $produkData[] = $row;
    }
}

// Close database connection
$conn->close();

// Sending product data as JSON response
header('Content-Type: application/json');
echo json_encode($produkData);
?>

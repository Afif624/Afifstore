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
$query = "
    SELECT produk.*, 
           AVG(review.rating) AS avg_rating,
           COUNT(DISTINCT order.id_order) AS order_count,
           COUNT(DISTINCT cart.id_cart) AS cart_count,
           COUNT(DISTINCT wishlist.id_wishlist) AS wishlist_count
    FROM produk
    LEFT JOIN detailkategori ON produk.id_produk = detailkategori.id_produk
    LEFT JOIN kategori ON detailkategori.id_kategori = kategori.id_kategori
    LEFT JOIN detailgenre ON produk.id_produk = detailgenre.id_produk
    LEFT JOIN genre ON detailgenre.id_genre = genre.id_genre
    LEFT JOIN review ON produk.id_produk = review.id_produk
    LEFT JOIN `order` ON produk.id_produk = order.id_produk
    LEFT JOIN cart ON produk.id_produk = cart.id_produk
    LEFT JOIN wishlist ON produk.id_produk = wishlist.id_produk
    $whereClause
    GROUP BY produk.id_produk
    ORDER BY 
        avg_rating DESC, 
        order_count DESC, 
        cart_count DESC, 
        wishlist_count DESC";

// Execute the query
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

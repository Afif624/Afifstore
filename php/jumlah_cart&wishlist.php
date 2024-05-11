<?php
session_start();
$id_user = $_SESSION['id_user'];

// Include file koneksi ke database
include_once("connect.php");

// Query untuk mengambil data Wishlist
$queryWishlist = "SELECT * FROM wishlist WHERE id_user='$id_user'";
$resultWishlist = $conn->query($queryWishlist);

// Query untuk mengambil data Cart
$queryCart = "SELECT * FROM cart WHERE id_user='$id_user'";
$resultCart = $conn->query($queryCart);

// Inisialisasi array untuk menyimpan data Wishlist dan Cart
$data = array();

$data['wishlist'] = $resultWishlist->num_rows;
$data['cart'] = $resultCart->num_rows;

// Menutup koneksi database
$conn->close();

// Mengirimkan data Wishlist dan Cart sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
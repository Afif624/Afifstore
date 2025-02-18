<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Ambil id_user dari session
$id_user = $_SESSION['id_user'];

// Inisialisasi array untuk menyimpan data produk
$data = array();

// Cek apakah ada parameter `id` yang dikirim melalui GET
if (isset($_GET['id'])) {
    // Jika ada `id`, ambil hanya satu produk berdasarkan id_produk
    $id_produk = $_GET['id'];

    // Query untuk mengambil satu produk dari wishlist user
    $query = "SELECT * FROM wishlist WHERE id_user = $id_user AND id_produk = $id_produk";
    $result = $conn->query($query);
    $count = $result->num_rows;

    // Simpan detail produk ke dalam array
    $data = ['wish_count' => $count];
} else {
    // Jika tidak ada `id`, ambil semua produk dari wishlist user
    $query = "SELECT * FROM wishlist WHERE id_user = $id_user";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id_produk = $row['id_produk'];

            // Ambil detail produk dari produk_list_all.php
            $produkDetail = file_get_contents("produk_list_all.php?id=" . $id_produk);
            $produkDetailArray = json_decode($produkDetail, true);

            // Simpan detail produk ke dalam array
            $data[] = $produkDetailArray;
        }
    }
}

// Menutup koneksi database
$conn->close();

// Mengirimkan data produk sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
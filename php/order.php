<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Ambil id_user dari session
$id_user = $_SESSION['id_user'];

// Inisialisasi array untuk menyimpan data produk
$data = [];

// Cek apakah ada parameter `id` yang dikirim melalui GET
if (isset($_GET['id'])) {
    // Jika ada `id`, ambil hanya satu produk berdasarkan id_produk
    $id_produk = $_GET['id'];

    // Query untuk mengambil satu produk dari order user
    $query = "SELECT * FROM `order` WHERE id_user = $id_user AND id_produk = $id_produk";
    $result = $conn->query($query);
    $status = $result->num_rows;

    // Simpan detail produk ke dalam array
    $data = ['order_status' => $status];
} else {
    // Jika tidak ada `id`, ambil semua produk dari order user dan urutkan berdasarkan waktu
    $query = "SELECT * FROM `order` WHERE id_user = $id_user ORDER BY waktu";
    $result = $conn->query($query);

    $data = array();
    $current_time = null;
    $group = array();

    while ($row = $result->fetch_assoc()) {
        $order_time = $row['waktu'];

        if ($current_time == null || $current_time != $order_time) {
            if (!empty($group)) {
                $data[] = $group;
            }
            $current_time = $order_time;
            $group = array();
        }

        $group[] = $row;
    }

    // Tambahkan grup terakhir ke data
    if (!empty($group)) {
        $data[] = $group;
    }
}

// Mengirimkan data produk sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
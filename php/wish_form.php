<?php
session_start();

// Memeriksa apakah pengguna sudah login atau belum
if (!isset($_SESSION['id_user'])) {
    // Redirect ke halaman login jika pengguna belum login
    header("Location: ../login.html");
    exit();
}

// Memeriksa apakah data wishlist dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['delete'])){
        // Include file koneksi ke database
        include_once("connect.php");

        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_GET['id_produk'];
        $id_user = $_SESSION['id_user'];
        $page = $_POST['sourcePage'];

        // SQL untuk menghapus wishlist
        $sql = "DELETE FROM wishlist WHERE id_produk=$id_produk AND id_user=$id_user";

        if ($conn->query($sql) === TRUE) {
            // Jika wishlist berhasil dihapus, kembalikan ke halaman wishlist
            echo "<script>alert('Delete from wishlist successful!!');
                window.location.href = '../$page';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        // Include file koneksi ke database
        include_once("connect.php");

        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_GET['id_produk'];
        $id_user = $_SESSION['id_user'];

        // Gunakan variabel boolean untuk menandai apakah penghapusan wishlist harus dilakukan
        $delete_wishlist = true;

        // SQL untuk memasukkan wishlist ke cart
        $sql_insert = "INSERT INTO `cart` (id_user, id_produk) 
            VALUES ('$id_user', '$id_produk')";
        
        // Jalankan query untuk memasukkan data ke dalam tabel cart
        if ($conn->query($sql_insert) !== TRUE) {
            // Jika terjadi kesalahan, atur variabel $delete_wishlist menjadi false
            $delete_wishlist = false;
            echo "Error: " . $sql_insert . "<br>" . $conn->error;
        }

        // Jika semua data wishlist telah dimasukkan ke dalam tabel cart tanpa kesalahan, hapus wishlist
        if ($delete_wishlist) {
            $sql_delete = "DELETE FROM wishlist WHERE id_user=$id_user AND id_produk=$id_produk";
            if ($conn->query($sql_delete) !== TRUE) {
                // Jika terjadi kesalahan saat menghapus wishlist, tampilkan pesan error
                echo "Error: " . $sql_delete . "<br>" . $conn->error;
            } else {
                // Jika wishlist berhasil dihapus, kembalikan ke halaman wishlist
                echo "<script>alert('Place cart successful!!');
                    window.location.href = '../wish.html';
                    </script>";
            }
        }
    }
    // Tutup koneksi database
    $conn->close();
} else {
    // Jika metode request bukan POST, redirect ke halaman wishlist
    header("Location: ../wish.html");
    exit();
}
?>
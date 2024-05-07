<?php
session_start();

// Memeriksa apakah pengguna sudah login atau belum
if (!isset($_SESSION['id_user'])) {
    // Redirect ke halaman login jika pengguna belum login
    header("Location: ../login.html");
    exit();
}

// Memeriksa apakah data cart dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['delete'])){
        // Include file koneksi ke database
        include_once("connect.php");

        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_GET['id_produk'];
        $id_user = $_SESSION['id_user'];

        // SQL untuk menghapus cart
        $sql = "DELETE FROM cart WHERE id_produk=$id_produk AND id_user=$id_user";

        if ($conn->query($sql) === TRUE) {
            // Jika cart berhasil dihapus, kembalikan ke halaman cart
            echo "<script>alert('Delete from Cart successful!!');
                window.location.href = '../cart.html';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        // Include file koneksi ke database
        include_once("connect.php");

        // Mendapatkan data yang dikirimkan dari form
        $id_user = $_SESSION['id_user'];
        $payment = $_POST['payment'];
        $datetime = date("Y-m-d H:i:s");

        // SQL untuk membaca cart
        $sql_read = "SELECT * FROM cart LEFT JOIN produk ON cart.id_produk = produk.id_produk WHERE id_user=$id_user";
        $result_read = $conn->query($sql_read);

        // Gunakan variabel boolean untuk menandai apakah penghapusan cart harus dilakukan
        $delete_cart = true;

        while ($row_cart = $result_read->fetch_assoc()){
            // SQL untuk memasukkan cart ke order
            $sql_insert = "INSERT INTO `order` (id_user, id_produk, payment, waktu) 
                VALUES ('$id_user', '" . $row_cart['id_produk'] . "', '$payment', '$datetime')";
            
            // Jalankan query untuk memasukkan data ke dalam tabel order
            if ($conn->query($sql_insert) !== TRUE) {
                // Jika terjadi kesalahan, atur variabel $delete_cart menjadi false
                $delete_cart = false;
                echo "Error: " . $sql_insert . "<br>" . $conn->error;
            }
        }

        // Jika semua data cart telah dimasukkan ke dalam tabel order tanpa kesalahan, hapus cart
        if ($delete_cart) {
            $sql_delete = "DELETE FROM cart WHERE id_user=$id_user";
            if ($conn->query($sql_delete) !== TRUE) {
                // Jika terjadi kesalahan saat menghapus cart, tampilkan pesan error
                echo "Error: " . $sql_delete . "<br>" . $conn->error;
            } else {
                // Jika cart berhasil dihapus, kembalikan ke halaman cart
                echo "<script>alert('Place order successful!!');
                    window.location.href = '../cart.html';
                    </script>";
            }
        }
    }
    // Tutup koneksi database
    $conn->close();
} else {
    // Jika metode request bukan POST, redirect ke halaman cart
    header("Location: ../cart.html");
    exit();
}
?>

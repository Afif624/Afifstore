<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Ambil id_user dari session
$id_user = $_SESSION['id_user'];

// Memeriksa apakah data wishlist dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['add'])){
        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_POST['id_produk'];

        // SQL untuk menghapus wishlist
        $sql = "INSERT INTO wishlist(id_user, id_produk) VALUES('$id_user','$id_produk')";
        if ($conn->query($sql) === TRUE) {
            // Jika wishlist berhasil dihapus, kembalikan ke halaman wishlist
            echo "<script>alert('Add to wishlist successful!!');
                window.location.href = '../detail.html?id=$id_produk';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else if (isset($_POST['delete'])){
        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_GET['id_produk'];
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
    } else if (isset($_POST['cart'])){
        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_GET['id_produk'];

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
            }
        }

        // Jika wishlist berhasil dihapus, kembalikan ke halaman wishlist
        echo "<script>alert('Place cart successful!!');
            window.location.href = '../wish.html';
            </script>";
    }

    // Tutup koneksi database
    $conn->close();
} else {
    // Inisialisasi array untuk menyimpan data produk
    $data = [];

    // Cek apakah ada parameter `id` yang dikirim melalui GET
    if (isset($_GET['id'])) {
        // Jika ada `id`, ambil hanya satu produk berdasarkan id_produk
        $id_produk = $_GET['id'];

        // Query untuk mengambil satu produk dari wishlist user
        $query = "SELECT * FROM wishlist WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $status = $result->num_rows;

        // Simpan status ke dalam array
        $data = ['wish_status' => $status];
    } else {
        $detail = [];
        
        // Jika tidak ada `id`, ambil semua produk dari wishlist user
        $query = "SELECT * FROM wishlist WHERE id_user = $id_user";
        $result = $conn->query($query);
        $count = $result->num_rows;

        while ($row = $result->fetch_assoc()) {
            $detail[] = $row['id_produk'];
        }

        $data = [
            'wish_detail' => $detail,
            'wish_count' => $count
        ];
    }
    
    // Mengirimkan data produk sebagai respons JSON
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
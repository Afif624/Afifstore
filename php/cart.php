<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// Ambil id_user dari session
$id_user = $_SESSION['id_user'];

// Memeriksa apakah data cart dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['add'])){
        // Mendapatkan data yang dikirimkan dari form
        $id_produk = $_POST['id_produk'];

        // SQL untuk menghapus cart
        $sql = "INSERT INTO cart(id_user, id_produk) VALUES('$id_user','$id_produk')";
        if ($conn->query($sql) === TRUE) {
            // Jika cart berhasil dihapus, kembalikan ke halaman cart
            echo "<script>alert('Add to Cart successful!!');
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

        // SQL untuk menghapus cart
        $sql = "DELETE FROM cart WHERE id_produk=$id_produk AND id_user=$id_user";
        if ($conn->query($sql) === TRUE) {
            // Jika cart berhasil dihapus, kembalikan ke halaman cart
            echo "<script>alert('Delete from Cart successful!!');
                window.location.href = '../$page';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        // Mendapatkan data yang dikirimkan dari form
        $payment = $_POST['payment'];
        $datetime = date("Y-m-d H:i:s");

        // Gunakan variabel boolean untuk menandai apakah penghapusan cart harus dilakukan
        $delete_cart = true;

        // SQL untuk membaca cart
        $sql_read = "SELECT * FROM cart LEFT JOIN produk ON cart.id_produk = produk.id_produk WHERE id_user=$id_user";
        $result_read = $conn->query($sql_read);
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
            }
        }
        
        // Kembalikan ke halaman cart
        echo "<script>alert('Place order successful!!');
            window.location.href = '../cart.html';
                </script>";
    }
    
    // Tutup koneksi database
    $conn->close();
} else {
    // Inisialisasi array untuk menyimpan data produk
    $data = array();

    // Cek apakah ada parameter `id` yang dikirim melalui GET
    if (isset($_GET['id'])) {
        // Jika ada `id`, ambil hanya satu produk berdasarkan id_produk
        $id_produk = $_GET['id'];

        // Query untuk mengambil satu produk dari cart user
        $query = "SELECT * FROM cart WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $status = $result->num_rows;

        // Simpan status ke dalam array
        $data = ['cart_status' => $status];
    } else {
        $detail = array();

        // Jika tidak ada `id`, ambil semua produk dari cart user
        $query = "SELECT * FROM cart WHERE id_user = $id_user";
        $result = $conn->query($query);
        $count = $result->num_rows;

        while ($row = $result->fetch_assoc()) {
            $id_produk = $row['id_produk'];

            // Ambil detail produk dari produk_one.php
            $produkDetail = file_get_contents("produk_one.php?id=" . $id_produk);
            $produkDetailArray = json_decode($produkDetail, true);

            // Simpan detail produk ke dalam array
            $detail[] = $produkDetailArray;
        }

        $data = [
            'cart_detail' => $detail,
            'cart_count' => $count
        ];
    }
    
    // Mengirimkan data produk sebagai respons JSON
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
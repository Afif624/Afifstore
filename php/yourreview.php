<?php
session_start();

// Include file koneksi ke database
include_once("connect.php");

// Memeriksa apakah data review dikirim melalui metode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Mendapatkan data yang dikirimkan dari form
    $id_user = $_SESSION['id_user'];
    $id_review = $_POST['id_review'];
    $id_produk = $_POST['id_produk'];
    $rating = $_POST['rating'];
    $review = $_POST['review'];
    $tanggal = date("Y-m-d");

    if (!isset($_POST['edit'])){
        // SQL untuk menyimpan review ke database
        $sql = "UPDATE review SET rating='$rating', review='$review' WHERE id_review=$id_review";

        if ($conn->query($sql) === TRUE) {
            // Jika review berhasil disimpan, kembalikan ke halaman detail produk
            echo "<script>alert('Adding review successful!!');
                window.location.href = '../detail.html?id=$id_produk';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else{
        // SQL untuk menyimpan review ke database
        $sql = "INSERT INTO review (id_produk, id_user, rating, review, tanggal) 
                VALUES ('$id_produk', '$id_user', '$rating', '$review', '$tanggal')";

        if ($conn->query($sql) === TRUE) {
            // Jika review berhasil disimpan, kembalikan ke halaman detail produk
            echo "<script>alert('Adding review successful!!');
                window.location.href = '../detail.html?id=$id_produk';
                    </script>";
        } else {
            // Jika terjadi kesalahan, tampilkan pesan error
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

} else {
    if (isset($_GET['id'])) {
        // Jika ada `id`, ambil hanya satu produk berdasarkan id_produk
        $id_user = $_SESSION['id_user'];
        $id_produk = $_GET['id'];

        // Query untuk mengambil satu produk dari wishlist user
        $query = "SELECT * FROM review WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $row = $result->fetch_assoc();

        // Simpan detail produk ke dalam array
        $data = ['yourreview' => $row];
        
        // Mengirimkan data produk sebagai respons JSON
        header('Content-Type: application/json');
        echo json_encode($data);
    }
    else {
        // Jika metode request bukan POST, redirect ke halaman detail produk
        header("Location: ../detail.html?id=$id_produk");
        exit();
    }
}

// Tutup koneksi database
$conn->close();
?>

<?php
session_start();
include_once("connect.php");

$id_user = $_SESSION['id_user'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['cart'])){
        $id_produk = $_GET['id_produk'];
        $page = $_POST['sourcePage'];

        if (isset($_POST['add'])){
            $sql = "INSERT INTO wishlist(id_user, id_produk) VALUES('$id_user','$id_produk')";
            if ($conn->query($sql) === TRUE) {
                echo "<script>alert('Add to wishlist successful!!');
                    window.location.href = '../$page';
                        </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else if (isset($_POST['delete'])){
            $sql = "DELETE FROM wishlist WHERE id_produk=$id_produk AND id_user=$id_user";
            if ($conn->query($sql) === TRUE) {
                echo "<script>alert('Delete from wishlist successful!!');
                    window.location.href = '../$page';
                        </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } else {
        $id_produk = $_GET['id_produk'];
        $delete_wishlist = true;

        $sql_insert = "INSERT INTO `cart` (id_user, id_produk) 
            VALUES ('$id_user', '$id_produk')";
        if ($conn->query($sql_insert) !== TRUE) {
            $delete_wishlist = false;
            echo "Error: " . $sql_insert . "<br>" . $conn->error;
        }

        if ($delete_wishlist) {
            $sql_delete = "DELETE FROM wishlist WHERE id_user=$id_user AND id_produk=$id_produk";
            if ($conn->query($sql_delete) !== TRUE) {
                echo "Error: " . $sql_delete . "<br>" . $conn->error;
            }
        }

        echo "<script>alert('Place cart successful!!');
            window.location.href = '../wish.html';
            </script>";
    }

    $conn->close();
} else {
    $data = [];

    if (isset($_GET['id'])) {
        $id_produk = $_GET['id'];

        $query = "SELECT * FROM wishlist WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $status = $result->num_rows;

        $data = ['wish_status' => $status];
    } else {
        $query = "SELECT * FROM wishlist WHERE id_user = $id_user";
        $result = $conn->query($query);
        $count = $result->num_rows;

        $detail = [];
        while ($row = $result->fetch_assoc()) {
            $detail[] = $row['id_produk'];
        }

        $data = [
            'wish_detail' => $detail,
            'wish_count' => $count
        ];
    }
    
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
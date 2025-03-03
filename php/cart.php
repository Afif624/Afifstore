<?php
session_start();
include_once("connect.php");

$id_user = $_SESSION['id_user'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['order'])){
        $id_produk = $_GET['id_produk'];
        $page = $_POST['sourcePage'];

        if (isset($_POST['add'])){
            $sql = "INSERT INTO cart(id_user, id_produk) VALUES('$id_user','$id_produk')";
            if ($conn->query($sql) === TRUE) {
                echo "<script>alert('Add to Cart successful!!');
                    window.location.href = '../$page';
                        </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else if (isset($_POST['delete'])){
            $sql = "DELETE FROM cart WHERE id_produk=$id_produk AND id_user=$id_user";
            if ($conn->query($sql) === TRUE) {
                echo "<script>alert('Delete from Cart successful!!');
                    window.location.href = '../$page';
                        </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } else {
        $payment = $_POST['payment'];
        $datetime = date("Y-m-d H:i:s");
        $delete_cart = true;

        $sql_read = "SELECT * FROM cart WHERE id_user=$id_user";
        $result_read = $conn->query($sql_read);
        while ($row_cart = $result_read->fetch_assoc()){
            $sql_insert = "INSERT INTO `order` (id_user, id_produk, payment, waktu) 
                VALUES ('$id_user', '" . $row_cart['id_produk'] . "', '$payment', '$datetime')";

            if ($conn->query($sql_insert) !== TRUE) {
                $delete_cart = false;
                echo "Error: " . $sql_insert . "<br>" . $conn->error;
            }
        }

        if ($delete_cart) {
            $sql_delete = "DELETE FROM cart WHERE id_user=$id_user";
            if ($conn->query($sql_delete) !== TRUE) {
                echo "Error: " . $sql_delete . "<br>" . $conn->error;
            }
        }
        
        echo "<script>alert('Place order successful!!');
            window.location.href = '../cart.html';
                </script>";
    }
    
    $conn->close();
} else {
    $data = [];

    if (isset($_GET['id'])) {
        $id_produk = $_GET['id'];

        $query = "SELECT * FROM cart WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $status = $result->num_rows;

        $data = ['cart_status' => $status];
    } else {
        $query = "SELECT * FROM cart WHERE id_user = $id_user";
        $result = $conn->query($query);
        $count = $result->num_rows;

        $detail = [];
        while ($row = $result->fetch_assoc()) {
            $detail[] = $row['id_produk'];
        }

        $data = [
            'cart_detail' => $detail,
            'cart_count' => $count
        ];
    }
    
    header('Content-Type: application/json');
    echo json_encode($data);
}
?>
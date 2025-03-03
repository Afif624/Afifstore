<?php
session_start();
include_once("connect.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id_user = $_SESSION['id_user'];
    $id_review = $_POST['id_review'];
    $id_produk = $_POST['id_produk'];
    $rating = $_POST['rating'];
    $review = $_POST['review'];
    $tanggal = date("Y-m-d");

    if (!isset($_POST['edit'])){
        $sql = "UPDATE review SET rating='$rating', review='$review' WHERE id_review=$id_review";

        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Adding review successful!!');
                window.location.href = '../detail.html?id=$id_produk';
                    </script>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else{
        $sql = "INSERT INTO review (id_produk, id_user, rating, review, tanggal) 
                VALUES ('$id_produk', '$id_user', '$rating', '$review', '$tanggal')";
        if ($conn->query($sql) === TRUE) {
            echo "<script>alert('Adding review successful!!');
                window.location.href = '../detail.html?id=$id_produk';
                    </script>";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }

} else {
    if (isset($_GET['id'])) {
        $id_user = $_SESSION['id_user'];
        $id_produk = $_GET['id'];

        $query = "SELECT * FROM review WHERE id_user = $id_user AND id_produk = $id_produk";
        $result = $conn->query($query);
        $row = $result->fetch_assoc();
        $yourreview = $row;
        
        header('Content-Type: application/json');
        echo json_encode($yourreview);
    }
    else {
        header("Location: ../detail.html?id=$id_produk");
        exit();
    }
}

$conn->close();
?>

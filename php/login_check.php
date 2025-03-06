<?php
session_start();
include_once("connect.php");

if (isset($_SESSION['id_user'])) {
    if (isset($_GET['id'])) {
        $id_user = $_SESSION['id_user'];
        $sql_user = "SELECT * FROM user WHERE id_user = $id_user";
        $result_user = $conn->query($sql_user);
        if ($result_user->num_rows > 0) {
            $row_user = $result_user->fetch_assoc();
            $name_user = $row_user['name'];
            $email_user = $row_user['email'];
        } 

        $data = [
            'name_user' => $name_user,
            'email_user' => $email_user
        ];

        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        header("HTTP/1.1 200 OK");
        echo 'logged_in';
        exit();
    }
} else {
    header("HTTP/1.1 401 Unauthorized");
    exit();
}
?>

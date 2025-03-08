<?php
session_start();
include_once 'connect.php';

$id_user = $_SESSION['id_user'];
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $address = $_POST["address"];
    $country = $_POST["country"];
    $state = $_POST["state"];
    $city = $_POST["city"];
    $zip = $_POST["zip"];

    $sql = "UPDATE user SET name = '$name', email = '$email', phone = '$phone', address = '$address', 
                country = '$country', state = '$state', city = '$city', zip = '$zip' 
                    WHERE id_user = $id_user";
    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Bio details successfully saved!');
            window.location.href = '../account.html';
                </script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
} else {
    $sql = "SELECT * FROM user WHERE id_user = $id_user";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();

    $bio = [
        "name" => $row['name'],
        "email" => $row['email'],
        "phone" => $row['phone'],
        "address" => $row['address'],
        "country" => $row['country'],
        "state" => $row['state'],
        "city" => $row['city'],
        "zip" => $row['zip']
    ];

    header('Content-Type: application/json');
    echo json_encode($bio);
}
?>
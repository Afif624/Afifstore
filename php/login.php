<?php
session_start();

// Database connection
include_once 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Registration process
    if (isset($_POST['register'])){
        $firstName = $_POST['firstname'];
        $lastName = $_POST['lastname'];
        $name = $firstName . "" . $lastName;

        $email = $_POST['email'];
        $no_hp = $_POST['nohp'];
        $password = $_POST['password'];
        $cpassword = $_POST['cpassword'];

        // Insert user into database
        $sql = "INSERT INTO user (name, email, no_hp, password) 
                VALUES ('$name', '$email', '$no_hp', '$password')";

        if ($password == $cpassword){
            if ($conn->query($sql) === TRUE) {
                echo "<script>alert('Registration successful!');
                    window.location.href = '../login.html';
                        </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else{
            echo "<script>alert('Password and Retype Password not same!');
                window.location.href = '../login.html';
                    </script>";
        }
    }
    // Login process
    else if(isset($_POST['login'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Check user credentials
        $sql = "SELECT id_user FROM user WHERE email='$email' AND password='$password'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Set session id_user
            $row = $result->fetch_assoc();
            $_SESSION['id_user'] = $row['id_user'];
            echo "<script>alert('Login successful!');
                window.location.href = '../index.html';
                    </script>";
        } else {
            echo "<script>alert('Invalid email or password!');
                window.location.href = '../login.html';
                    </script>";

        }
    }
}

$conn->close();
?>

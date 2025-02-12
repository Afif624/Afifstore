<?php
// API Key dari RAWG
$apiKey = 'ffa2dafa779f4fa58f39bdef9851c466';

// Create connection
$conn = new mysqli("localhost", "root", "", "gamestore");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
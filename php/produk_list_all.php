<?php
session_start();
// Include file koneksi ke database
include_once("connect.php");

// API Key dari RAWG
$apiKey = 'ffa2dafa779f4fa58f39bdef9851c466';

// Function to fetch data from RAWG API
function fetchDataFromRAWGAPI($url) {
    $response = file_get_contents($url);
    if ($response === FALSE) {
        die('Error fetching data from RAWG API');
    }
    return json_decode($response, true);
}

// Function to generate random price (simulasi localStorage JavaScript)
function getRandomPrice($min, $max) {
    return rand($min, $max);
}

// 1. Fungsi Semua Game (Multi-page)
function getAllGames($apiKey) {
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}";
    $allGames = [];
    $nextPageUrl = $rawgUrl;

    do {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        $allGames = array_merge($allGames, $data['results']);
        $nextPageUrl = $data['next']; // URL halaman berikutnya
    } while ($nextPageUrl); // Lanjutkan selama ada halaman berikutnya

    // Add price to each game
    $allGames = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga; // Simulate localStorage
        $game['price'] = $harga;
        return $game;
    }, $allGames);

    return $allGames;
}

// 2. Fungsi untuk mendapatkan satu game berdasarkan ID (Multi-page untuk data tambahan jika ada)
function getGameById($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}?key={$apiKey}";
    $game = fetchDataFromRAWGAPI($rawgUrl);

    // Add price to the game
    $hargaKey = "harga_{$game['id']}";
    $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
    $_SESSION[$hargaKey] = $harga; // Simulate localStorage
    $game['price'] = $harga;

    return $game;
}

// 3. Fungsi untuk mendapatkan review game berdasarkan ID (Multi-page)
function getGameReviews($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}/reviews?key={$apiKey}";
    $allReviews = [];
    $nextPageUrl = $rawgUrl;

    do {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        $allReviews = array_merge($allReviews, $data['results']);
        $nextPageUrl = $data['next']; // URL halaman berikutnya
    } while ($nextPageUrl); // Lanjutkan selama ada halaman berikutnya

    return $allReviews;
}

// Check if 'id' is set in the GET request
if (isset($_GET['id'])) {
    $gameId = $_GET['id'];
    $game = getGameById($apiKey, $gameId);
    $reviews = getGameReviews($apiKey, $gameId);

    // Query untuk mengambil nama dan email dari tabel pengguna berdasarkan id_user
    $id_user = $_SESSION['id_user'];
    $sql_user = "SELECT nama, email FROM user WHERE id_user = $id_user";
    $result_user = $conn->query($sql_user);
    if ($result_user->num_rows > 0) {
        $row_user = $result_user->fetch_assoc();
        $nama_user = $row_user['nama'];
        $email_user = $row_user['email'];
    } else {
        $nama_user = "Nama Pengguna";
        $email_user = "email@example.com";
    }

    // Send both game and reviews to JS
    $data = [
        'game' => $game,
        'reviews' => $reviews,
        'nama_user' => $nama_user,
        'email_user' => $email_user
    ];

    // Mengirimkan data produk sebagai respons JSON
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    // Get all games
    $allGames = getAllGames($apiKey);
}
?>
<?php
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

// 1. Fungsi Semua Game
function getAllGames($apiKey) {
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}";
    $allGames = [];
    $nextPageUrl = $rawgUrl;
    $totalGames = 0;

    do {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        $allGames = array_merge($allGames, $data['results']);
        $totalGames += count($data['results']);
        $nextPageUrl = $data['next'];
    } while ($nextPageUrl && $totalGames < 100); // Limit to 100 games

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

// Get all games
$allGames = getAllGames($apiKey);
?>
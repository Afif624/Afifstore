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
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}&page_size=20"; // Maksimal 20 game per halaman
    $allGames = [];
    $nextPageUrl = $rawgUrl;
    $totalGames = 0; // Counter untuk total game yang diambil

    do {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        
        // Filter data yang diperlukan
        $filteredGames = array_map(function($game) {
            return [
                'id' => $game['id'],
                'name' => $game['name'],
                'released' => $game['released'],
                'genres' => array_map(function($genre) {
                    return $genre['id'];
                }, $game['genres']),
                'platforms' => array_map(function($platform) {
                    return $platform['platform']['id'];
                }, $game['platforms']),
                'tags' => array_map(function($tag) {
                    return $tag['id'];
                }, $game['tags']),
                'rating' => $game['rating'],
                'ratings_count' => $game['ratings_count'],
                'background_image' => $game['background_image']
            ];
        }, $data['results']);
        
        // Tambahkan game ke array $allGames
        $allGames = array_merge($allGames, $filteredGames);
        $totalGames += count($filteredGames); // Update total game yang diambil

        // Hentikan jika sudah mencapai 100 game
        if ($totalGames >= 100) {
            $allGames = array_slice($allGames, 0, 100); // Potong array agar hanya 100 game
            break;
        }

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

// Get all games
$allGames = getAllGames($apiKey);
?>
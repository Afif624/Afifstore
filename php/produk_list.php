<?php
// Include file koneksi ke database
include_once("produk_list_all.php");

// 2. Fungsi Game Terfilter
function getFilteredGames($allGames, $filters) {
    // Apply genre and platform filters
    if (isset($filters['platform'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return in_array($filters['platform'], array_column($game['platforms'], 'id'));
        });
    }

    if (isset($filters['genre'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return in_array($filters['genre'], array_column($game['genres'], 'id'));
        });
    }

    // Apply price filter
    if (isset($filters['harga'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return $game['price'] <= $filters['harga'];
        });
    }

    // Limit to 100 games
    return array_slice($allGames, 0, 100);
}

// 3. Fungsi Game Terbaru
function getLatestGames($apiKey) {
    $latestGamesUrl = "https://api.rawg.io/api/games?key={$apiKey}&ordering=-released&page_size=40";
    $latestGamesData = fetchDataFromRAWGAPI($latestGamesUrl);

    // Add price to each game
    $latestGames = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga; // Simulate localStorage
        $game['price'] = $harga;
        return $game;
    }, $latestGamesData['results']);

    return $latestGames;
}

// Initialize filter
$filters = [];
if (isset($_GET['platform'])) $filters['platform'] = $_GET['platform'];
if (isset($_GET['genre'])) $filters['genre'] = $_GET['genre'];
if (isset($_GET['harga'])) $filters['harga'] = $_GET['harga'];

// Get filtered games
$filteredGames = getFilteredGames($allGames, $filters);

// Get latest games
$latestGames = getLatestGames($apiKey);

// Prepare the response
$response = [
    'terfilter' => array_values($filteredGames), // Re-index array
    'terbaru' => $latestGames
];

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
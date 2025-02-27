<?php
// Include file koneksi ke database
include_once("produk_list_all.php");

// 2. Fungsi Game Terfilter
function getFilteredGames($allGames, $filters) {
    // Apply genre and platform filters
    if (isset($filters['platform'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return in_array($filters['platform'], $game['platforms']);
        });
    }

    if (isset($filters['genre'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return in_array($filters['genre'], $game['genres']);
        });
    }

    // Apply price filter
    if (isset($filters['harga'])) {
        $allGames = array_filter($allGames, function($game) use ($filters) {
            return $game['price'] <= $filters['harga'];
        });
    }

    // Sorting logic
    if (isset($filters['sort'])) {
        usort($allGames, function($a, $b) use ($filters) {
            switch ($filters['sort']) {
                case 'latest':
                    return strtotime($b['released']) <=> strtotime($a['released']);
                case 'popularity':
                    return $b['ratings_count'] <=> $a['ratings_count'];
                case 'rating':
                    return $b['rating'] <=> $a['rating'];
                default:
                    return 0;
            }
        });
    }

    // Extracting only the required fields
    $selectedFields = [
        'id', 'name', 'background_image',
        'price', 'rating', 'ratings_count'
    ];

    $filteredGames = [];
    foreach ($allGames as $game) {
        $filteredGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    // Limiting the number of games to 100
    return array_slice($filteredGames, 0, 100);
}

// 3. Fungsi Game Terbaru
function getLatestGames($apiKey) {
    $latestGamesUrl = "https://api.rawg.io/api/games?key={$apiKey}&ordering=-released&page_size=40";
    $latestGamesData = fetchDataFromRAWGAPI($latestGamesUrl);

    // Add price to each game
    $games = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga; // Simulate localStorage
        $game['price'] = $harga;
        return $game;
    }, $latestGamesData['results']);

    // Extracting only the required fields
    $selectedFields = [
        'id', 'name', 'background_image',
        'price', 'rating', 'ratings_count'
    ];
    
    $latestGames = [];
    foreach ($games as $game){
        $latestGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $latestGames;
}

// Prepare the response
$response = [];
if (isset($_GET['terfilter'])){
    // Initialize filter
    $filters = [];
    if (isset($_GET['platform'])) $filters['platform'] = $_GET['platform'];
    if (isset($_GET['genre'])) $filters['genre'] = $_GET['genre'];
    if (isset($_GET['harga'])) $filters['harga'] = $_GET['harga'];
    if (isset($_GET['sort'])) $filters['sort'] = $_GET['sort'];

    // Get filtered games
    $filteredGames = getFilteredGames($allGames, $filters);

    $response = ['terfilter' => array_values($filteredGames)];
} else {
    // Get latest games
    $latestGames = getLatestGames($apiKey);

    $response = [
        'terbaru' => $latestGames,
        'terekomendasi' => $latestGames
    ];
}

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
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

// 4. Function to calculate similarity score between two games
function calculateSimilarity($game1, $game2) {
    $score = 0;

    // Compare genres
    $genres1 = array_column($game1['genres'], 'id');
    $genres2 = $game2['genres'];
    $commonGenres = array_intersect($genres1, $genres2);
    $score += count($commonGenres) * 10;

    // Compare tags
    $tags1 = array_column($game1['tags'], 'id');
    $tags2 = $game2['tags'];
    $commonTags = array_intersect($tags1, $tags2);
    $score += count($commonTags) * 5;

    // Compare platforms
    $platforms1 = array_column(array_column($game1['platforms'], 'platform'), 'id');
    $platforms2 = $game2['platforms'];
    $commonPlatforms = array_intersect($platforms1, $platforms2);
    $score += count($commonPlatforms) * 3;

    // Compare rating
    $ratingDiff = abs($game1['rating'] - $game2['rating']);
    $score -= $ratingDiff * 2;

    return $score;
}

// 5. Function to get 20 most similar games
function getSimilarGames($apiKey, $gameId) {
    $allGames = getAllGames($apiKey);
    $targetGame = getGameById($apiKey, $gameId);

    // Calculate similarity scores for all games
    $similarityScores = [];
    foreach ($allGames as $game) {
        if ($game['id'] != $targetGame['id']) {
            $similarityScores[$game['id']] = calculateSimilarity($targetGame, $game);
        }
    }

    // Sort games by similarity score in descending order
    arsort($similarityScores);

    // Get top 20 most similar games
    $similarGames = [];
    $count = 0;
    foreach ($similarityScores as $id => $score) {
        if ($count >= 20) break;
        $similarGames[] = getGameById($apiKey, $id);
        $count++;
    }

    return $similarGames;
}

// Check if 'id' is set in the GET request
if (isset($_GET['id'])) {
    $gameId = $_GET['id'];
    $game = getGameById($apiKey, $gameId);
    $reviews = getGameReviews($apiKey, $gameId);
    $similarGames = getSimilarGames($apiKey, $gameId);

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
        'similarGames' => $similarGames,
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
<?php 
// Include file koneksi ke database
include_once("produk_list_all.php");

// 2. Fungsi untuk mendapatkan satu game berdasarkan ID (Multi-page untuk data tambahan jika ada)
function getGameById($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}?key={$apiKey}";
    $game = fetchDataFromRAWGAPI($rawgUrl);
    
    // Extracting only the required fields
    if (isset($_GET['list'])){
        $selectedFields = [
            'id', 'name', 'background_image',
            'price', 'developers', 'publishers'
        ];
    } else {
        $selectedFields = [
            'added_by_status', 'name', 'background_image', 'background_image_additional',
            'short_screenshots', 'price', 'rating', 'ratings_count', 'genres', 'tags',
            'platforms', 'id', 'description', 'developers', 'publishers',
            'released', 'metacritic', 'suggestions_count'
        ];
    }
    
    $oneGame = array_intersect_key($game, array_flip($selectedFields));
    
    // Add price to the filtered game
    $hargaKey = "harga_{$oneGame['id']}";
    $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
    $_SESSION[$hargaKey] = $harga; // Simulate localStorage
    $oneGame['price'] = $harga;
    
    // Fetch all screenshots with pagination
    $shortScreenshots = [];
    $page = 1;
    do {
        $screenshotsUrl = "https://api.rawg.io/api/games/{$gameId}/screenshots?key={$apiKey}&page={$page}";
        $screenshotsData = fetchDataFromRAWGAPI($screenshotsUrl);
        
        if (isset($screenshotsData['results'])) {
            $shortScreenshots = array_merge($shortScreenshots, $screenshotsData['results']);
        }
        
        $page++;
    } while (isset($screenshotsData['next']));
    
    $oneGame['short_screenshots'] = $shortScreenshots;
    
    return $oneGame;
}

// 3. Fungsi untuk mendapatkan review game berdasarkan ID (Multi-page)
function getGameReviews($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}/reviews?key={$apiKey}";
    $allReviews = [];
    $nextPageUrl = $rawgUrl;

    do {
        $reviewData = fetchDataFromRAWGAPI($nextPageUrl);
        $allReviews = array_merge($allReviews, $reviewData['results']);
        $nextPageUrl = $reviewData['next']; // URL halaman berikutnya
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
function getSimilarGames($apiKey, $gameId, $allGames) {
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

    // Extracting only the required fields
    $selectedFields = [
        'id', 'name', 'background_image',
        'price', 'rating', 'ratings_count',
        'genres', 'tags', 'platforms'
    ];

    // Get top 20 most similar games
    $similarGames = [];
    $count = 0;
    foreach ($similarityScores as $id => $score) {
        if ($count >= 20) break;
        $game = getGameById($apiKey, $id);
        $similarGames[] = array_intersect_key($game, array_flip($selectedFields)); 
        $count++;
    }

    return $similarGames;
}

$gameId = $_GET['id'];
$game = getGameById($apiKey, $gameId);
$data = [];

if (isset($_GET['list'])){
    $data = ['game' => $game];
} else {
    $reviews = getGameReviews($apiKey, $gameId);
    $similarGames = getSimilarGames($apiKey, $gameId, $allGames);

    // Send both game and reviews to JS
    $data = [
        'game' => $game,
        'reviews' => $reviews,
        'similarGames' => $similarGames
    ];
}

// Mengirimkan data produk sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
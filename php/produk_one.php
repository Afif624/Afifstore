<?php 
session_start();
$apiKey = 'ffa2dafa779f4fa58f39bdef9851c466';

function fetchDataFromRAWGAPI($url) {
    $response = file_get_contents($url);
    if ($response === FALSE) {
        die('Error fetching data from RAWG API');
    }
    return json_decode($response, true);
}

function getRandomPrice($min, $max) {
    return rand($min, $max);
}

function getAllGames($apiKey) {
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}&page_size=40";
    $allgames = [];
    $nextPageUrl = $rawgUrl;
    
    while ($nextPageUrl && count($allgames) < 100) {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        $games = array_map(function($game) {
            return [
                'id' => $game['id'],
                'name' => $game['name'],
                'background_image' => $game['background_image'],
                'rating' => $game['rating'],
                'ratings_count' => $game['ratings_count'],
                'genres' => array_map(function($genre) {
                    return $genre['id'];
                }, $game['genres']),
                'platforms' => array_map(function($platform) {
                    return $platform['platform']['id'];
                }, $game['platforms']),
                'released' => $game['released']
            ];
        }, $data['results']);
        $games = array_map(function($game) {
            $hargaKey = "harga_{$game['id']}";
            $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
            $_SESSION[$hargaKey] = $harga;
            $game['price'] = $harga;
            return $game;
        }, $games);
        $allGames = array_merge($allGames, $games);
        
        $nextPageUrl = $data['next'];
    }

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $resultGames = [];
    foreach ($allgames as $game) {
        $resultGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $resultGames;
}

function getGameById($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}?key={$apiKey}";
    $game = fetchDataFromRAWGAPI($rawgUrl);
    
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
    $hargaKey = "harga_{$oneGame['id']}";
    $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
    $_SESSION[$hargaKey] = $harga;
    $oneGame['price'] = $harga;
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

function getGameReviews($apiKey, $gameId) {
    $rawgUrl = "https://api.rawg.io/api/games/{$gameId}/reviews?key={$apiKey}";
    $allReviews = [];
    $nextPageUrl = $rawgUrl;

    do {
        $reviewData = fetchDataFromRAWGAPI($nextPageUrl);
        $allReviews = array_merge($allReviews, $reviewData['results']);
        $nextPageUrl = $reviewData['next'];
    } while ($nextPageUrl);

    return $allReviews;
}

function calculateSimilarity($game1, $game2) {
    $score = 0;

    $genres1 = array_column($game1['genres'], 'id');
    $genres2 = $game2['genres'];
    $commonGenres = array_intersect($genres1, $genres2);
    $score += count($commonGenres) * 10;

    $tags1 = array_column($game1['tags'], 'id');
    $tags2 = $game2['tags'];
    $commonTags = array_intersect($tags1, $tags2);
    $score += count($commonTags) * 5;

    $platforms1 = array_column(array_column($game1['platforms'], 'platform'), 'id');
    $platforms2 = $game2['platforms'];
    $commonPlatforms = array_intersect($platforms1, $platforms2);
    $score += count($commonPlatforms) * 3;

    $ratingDiff = abs($game1['rating'] - $game2['rating']);
    $score -= $ratingDiff * 2;

    return $score;
}

function getSimilarGames($apiKey, $gameId) {
    $allGames = getAllGames($apiKey)
    $targetGame = getGameById($apiKey, $gameId);

    $similarityScores = [];
    foreach ($allGames as $game) {
        if ($game['id'] != $targetGame['id']) {
            $similarityScores[$game['id']] = calculateSimilarity($targetGame, $game);
        }
    }
    arsort($similarityScores);

    $selectedFields = [
        'id', 'name', 'background_image',
        'price', 'rating', 'ratings_count',
        'genres', 'tags', 'platforms'
    ];
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
    $similarGames = getSimilarGames($apiKey, $gameId);
    $data = [
        'game' => $game,
        'reviews' => $reviews,
        'similarGames' => $similarGames
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
?>
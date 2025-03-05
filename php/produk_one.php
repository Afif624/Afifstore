<?php
ini_set('memory_limit', '1024M');
session_start();

function getAllData($filename) {
    $data = file_get_contents($filename);
    return json_decode($data, true);
}

$games = getAllData('../dataset/games_with_details.json');

function getRandomPrice($min, $max) {
    return rand($min, $max);
}

function getAllGames() {
    global $games;

    $games = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        return $game;
    }, $games);

    $selectedFields = ['id', 'genres', 'platforms', 'tags', 'rating'];
    $allGames = [];
    foreach ($games as $game) {
        $allGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $allGames;
}

function getGameById($gameId) {
    global $games;

    $game = array_filter($games, function($game) use ($gameId) {
        return $game['id'] == $gameId;
    });
    
    $game = reset($game);
    if (isset($_GET['list'])) {
        $selectedFields = ['id', 'name', 'background_image', 'price', 'details'];
    } else {
        $selectedFields = [
            'id', 'name', 'background_image', 'short_screenshots',
            'price', 'rating', 'ratings_count', 'genres', 'platforms', 'tags',
            'added_by_status', 'released', 'metacritic', 'suggestions_count', 'details'
        ];
    }
    $oneGame = array_intersect_key($game, array_flip($selectedFields));

    $hargaKey = "harga_{$oneGame['id']}";
    $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
    $_SESSION[$hargaKey] = $harga;
    $oneGame['price'] = $harga;

    return $oneGame;
}


function calculateSimilarity($game1, $game2) {
    $score = 0;

    $genres1 = array_column($game1['genres'], 'id');
    $genres2 = array_column($game2['genres'], 'id');
    $commonGenres = array_intersect($genres1, $genres2);
    $score += count($commonGenres) * 10;

    $platforms1 = array_column(array_column($game1['platforms'], 'platform'), 'id');
    $platforms2 = array_column(array_column($game2['platforms'], 'platform'), 'id');
    $commonPlatforms = array_intersect($platforms1, $platforms2);
    $score += count($commonPlatforms) * 3;
    
    $tags1 = array_column($game1['tags'], 'id');
    $tags2 = array_column($game2['tags'], 'id');
    $commonTags = array_intersect($tags1, $tags2);
    $score += count($commonTags) * 5;

    $ratingDiff = abs($game1['rating'] - $game2['rating']);
    $score -= $ratingDiff * 2;

    return $score;
}

function getSimilarGames($gameId) {
    $allGames = getAllGames();
    $targetGame = getGameById($gameId);

    $similarityScores = [];
    foreach ($allGames as $game) {
        if ($game['id'] != $targetGame['id']) {
            $similarityScores[$game['id']] = calculateSimilarity($targetGame, $game);
        }
    }
    arsort($similarityScores);

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $similarGames = [];
    $count = 0;
    foreach ($similarityScores as $id => $score) {
        if ($count >= 20) break;
        $game = getGameById($id);
        $similarGames[] = array_intersect_key($game, array_flip($selectedFields));
        $count++;
    }

    return $similarGames;
}

$gameId = $_GET['id'];
$oneGame = getGameById($gameId);

$data = [];
if (isset($_GET['list'])) {
    $data = ['game' => $oneGame];
} else {
    $similarGames = getSimilarGames($gameId);
    $data = [
        'game' => $oneGame,
        'similarGames' => $similarGames
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
?>
<?php
ini_set('memory_limit', '1024M');
session_start();

function fetchGamesDataFromJSON($filePath) {
    $jsonContent = file_get_contents($filePath);
    return json_decode($jsonContent, true);
}

function getRandomPrice($min, $max) {
    return rand($min, $max);
}

function prepareGamesData($games) {
    $games = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        return $game;
    }, $games);

    $games = array_map(function($game) {
        $game['price'] = getRandomPrice(100000, 1000000);
        return [
            'id' => $game['id'],
            'name' => $game['name'],
            'short_screenshots' => array_map(function($short_screenshots) {
                return $short_screenshots['image'];
            }, $game['short_screenshots']),
            'rating' => $game['rating'],
            'ratings_count' => $game['ratings_count'],
            'price' => $game['price'],
            'details' => $game['details'],
            'genres' => array_map(function($genre) {
                return $genre['name'];
            }, $game['genres']),
            'platforms' => array_map(function($platform) {
                return $platform['platform']['name'];
            }, $game['platforms']),
            'tags' => array_map(function($tag) {
                return $tag['name'];
            }, $game['tags'])
        ];
    }, $games);

    return $games;
}

function combineFeatures($game) {
    return strtolower(
        implode(' ', $game['genres']) . ' ' .
        implode(' ', $game['platforms']) . ' ' .
        implode(' ', $game['tags'])
    );
}

function addCombinedFeatures($gamesData) {
    return array_map(function($game) {
        $game['combined_features'] = combineFeatures($game);
        return $game;
    }, $gamesData);
}

function calculateSimilarityScore($featuresA, $featuresB) {
    $featuresAArray = explode(' ', $featuresA);
    $featuresBArray = explode(' ', $featuresB);
    $intersection = array_intersect($featuresAArray, $featuresBArray);
    $union = array_unique(array_merge($featuresAArray, $featuresBArray));
    return count($intersection) / count($union);
}

function getRecommendationGames($filePath, $userPreferences) {
    $allGames = fetchGamesDataFromJSON($filePath);

    $gamesData = prepareGamesData($allGames);
    $gamesData = addCombinedFeatures($gamesData);

    $userCombinedFeatures = strtolower(
        implode(' ', $userPreferences['genres'] ?? []) . ' ' .
        implode(' ', $userPreferences['platforms'] ?? []) . ' ' .
        implode(' ', $userPreferences['tags'] ?? [])
    );

    $gamesWithScores = [];
    foreach ($gamesData as $game) {
        $score = calculateSimilarityScore($game['combined_features'], $userCombinedFeatures);
        $gamesWithScores[] = [
            'game' => $game,
            'score' => $score
        ];
    }

    usort($gamesWithScores, function($a, $b) {
        return $b['score'] <=> $a['score'];
    });

    $recommendedGames = array_slice($gamesWithScores, 0, 10);

    $results = [];
    foreach ($recommendedGames as $item) {
        $results[] = $item['game'];
    }

    return $results;
}

$jsonFilePath = '../dataset/games_with_details.json';
$userPreferences = [
    'genres' => ['Action', 'RPG'],
    'platforms' => ['PC'],
    'tags' => ['Multiplayer', 'Open World']
];

$recommendedGames = getRecommendationGames($jsonFilePath, $userPreferences);

header('Content-Type: application/json');
echo json_encode($recommendedGames);
?>
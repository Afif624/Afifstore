<?php
session_start();
$apiKey = 'YOUR_RAWG_API_KEY';

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

function prepareGamesData($games) {
    return array_map(function($game) {
        $priceKey = "price_{$game['id']}";
        $price = getRandomPrice(100000, 1000000);
        $game['price'] = $price;
        return [
            'id' => $game['id'],
            'name' => $game['name'],
            'background_image' => $game['background_image'],
            'rating' => $game['rating'],
            'ratings_count' => $game['ratings_count'],
            'price' => $game['price'],
            'genres' => array_map(function($genre) {
                return $genre['name'];
            }, $game['genres']),
            'platforms' => array_map(function($platform) {
                return $platform['platform']['name'];
            }, $game['platforms']),
            'released' => $game['released'],
            'tags' => array_map(function($tag) {
                return $tag['name'];
            }, $game['tags'])
        ];
    }, $games);
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
    $similarity = count($intersection) / count($union);
    return $similarity;
}

function getRecommendationGames($apiKey, $userPreferences) {
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}&page_size=40";
    $allGames = [];
    $nextPageUrl = $rawgUrl;

    while ($nextPageUrl && count($allGames) < 1000) {
        $data = fetchDataFromRAWGAPI($nextPageUrl);
        $allGames = array_merge($allGames, $data['results']);
        $nextPageUrl = $data['next'];
    }

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

$userPreferences = [
    'genres' => ['Action', 'RPG'],
    'platforms' => ['PC'],
    'tags' => ['Multiplayer', 'Open World']
];
$recommendedGames = getRecommendationGames($apiKey, $userPreferences);
$response = [
    'terekomendasi' => $recommendedGames
];

header('Content-Type: application/json');
echo json_encode($response);
?>

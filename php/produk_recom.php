<?php
ini_set('memory_limit', '1024M');
ini_set('max_execution_time', 300);
session_start();
include_once 'connect.php';

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
            'description_raw' => $game['description_raw'],
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

function getRecommendationGames($filePath, $userPreferences, &$metrics = []) {
    $startTotal = microtime(true);
    
    // Parse phase
    $startParse = microtime(true);
    $allGames = fetchGamesDataFromJSON($filePath);
    $metrics['Tparse'] = microtime(true) - $startParse;
    
    // Compute phase
    $startCompute = microtime(true);
    $gamesData = prepareGamesData($allGames);
    $gamesData = addCombinedFeatures($gamesData);
    
    // Get relevant game IDs (ground truth)
    $relevantGameIds = [];
    $userGenres = $userPreferences['genres'] ?? [];
    $userPlatforms = $userPreferences['platforms'] ?? [];
    $userTags = $userPreferences['tags'] ?? [];
    
    foreach ($gamesData as $game) {
        $isRelevant = false;
        foreach ($game['genres'] as $genre) {
            if (in_array($genre, $userGenres)) {
                $isRelevant = true;
                break;
            }
        }
        if (!$isRelevant) {
            foreach ($game['platforms'] as $platform) {
                if (in_array($platform, $userPlatforms)) {
                    $isRelevant = true;
                    break;
                }
            }
        }
        if (!$isRelevant) {
            foreach ($game['tags'] as $tag) {
                if (in_array($tag, $userTags)) {
                    $isRelevant = true;
                    break;
                }
            }
        }
        if ($isRelevant) {
            $relevantGameIds[] = $game['id'];
        }
    }
    
    $userCombinedFeatures = strtolower(
        implode(' ', $userGenres) . ' ' .
        implode(' ', $userPlatforms) . ' ' .
        implode(' ', $userTags)
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
    
    $top10 = array_slice($gamesWithScores, 0, 10);
    $metrics['Tcompute'] = microtime(true) - $startCompute;
    $metrics['Ttotal'] = microtime(true) - $startTotal;
    
    // Calculate evaluation metrics
    $relevantInTop10 = 0;
    $firstRelevantRank = null;
    
    foreach ($top10 as $rank => $item) {
        $gameId = $item['game']['id'];
        if (in_array($gameId, $relevantGameIds)) {
            $relevantInTop10++;
            if ($firstRelevantRank === null) {
                $firstRelevantRank = $rank + 1;
            }
        }
    }
    
    $totalRelevant = count($relevantGameIds);
    $numRecommended = count($top10);
    
    $metrics['precision@10'] = $numRecommended > 0 ? ($relevantInTop10 / $numRecommended) : 0;
    $metrics['recall@10'] = $totalRelevant > 0 ? ($relevantInTop10 / $totalRelevant) : 0;
    
    $denominator = $metrics['precision@10'] + $metrics['recall@10'];
    $metrics['f1@10'] = $denominator > 0 
        ? (2 * $metrics['precision@10'] * $metrics['recall@10']) / $denominator 
        : 0;
    
    $metrics['mrr'] = $firstRelevantRank ? (1.0 / $firstRelevantRank) : 0;
    
    $recommendedGames = [];
    foreach ($top10 as $item) {
        $recommendedGames[] = $item['game'];
    }
    
    return $recommendedGames;
}

// Variance calculation function
function calculateVariance($filePath, $userPreferences, $iterations = 30) {
    $times = ['Tparse' => [], 'Tcompute' => [], 'Ttotal' => []];
    
    for ($i = 0; $i < $iterations; $i++) {
        $metrics = [];
        getRecommendationGames($filePath, $userPreferences, $metrics);
        
        $times['Tparse'][] = $metrics['Tparse'];
        $times['Tcompute'][] = $metrics['Tcompute'];
        $times['Ttotal'][] = $metrics['Ttotal'];
    }
    
    $variance = [];
    foreach ($times as $key => $values) {
        $mean = array_sum($values) / count($values);
        $squaredDiffs = array_map(function($x) use ($mean) {
            return pow($x - $mean, 2);
        }, $values);
        $variance[$key] = count($squaredDiffs) > 1 
            ? sqrt(array_sum($squaredDiffs) / (count($squaredDiffs) - 1)) 
            : 0;
    }
    
    return $variance;
}

$jsonFilePath = '../dataset/games.json';

$id_user = $_SESSION['id_user'];
$sql = "SELECT * FROM user WHERE id_user = $id_user";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$userPreferences = [
    'genres' => json_decode($row['genres'], true),
    'platforms' => json_decode($row['platforms'], true),
    'tags' => json_decode($row['tags'], true)
];

// Get recommendations and metrics
$metrics = [];
$recommendedGames = getRecommendationGames($jsonFilePath, $userPreferences, $metrics);

// Calculate variance (30 iterations)
$variance = calculateVariance($jsonFilePath, $userPreferences);
$metrics['variance'] = $variance;

$data = [
    'preferensi' => $userPreferences,
    'terekomendasi' => $recommendedGames,
    'evaluation_metrics' => $metrics
];

header('Content-Type: application/json');
echo json_encode($data);
?>
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

function getFilteredGames($apiKey, $filters) {
    $rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}&page_size=40";
    $filteredGames = [];
    $nextPageUrl = $rawgUrl;
    
    while ($nextPageUrl && count($filteredGames) < 1000) {
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
        
        if (isset($filters['platform'])) {
            $games = array_filter($games, function($game) use ($filters) {
                return in_array($filters['platform'], $game['platforms']);
            });
        }
        if (isset($filters['genre'])) {
            $games = array_filter($games, function($game) use ($filters) {
                return in_array($filters['genre'], $game['genres']);
            });
        }
        if (isset($filters['harga'])) {
            $games = array_filter($games, function($game) use ($filters) {
                return $game['price'] <= $filters['harga'];
            });
        }
        $filteredGames = array_merge($filteredGames, $games);
        
        $nextPageUrl = $data['next'];
    }

    if (isset($filters['sort'])) {
        usort($filteredGames, function($a, $b) use ($filters) {
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

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $resultGames = [];
    foreach ($filteredGames as $game) {
        $resultGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $resultGames;
}

function getLatestGames($apiKey) {
    $latestGamesUrl = "https://api.rawg.io/api/games?key={$apiKey}&ordering=-released&page_size=40";
    $latestGamesData = fetchDataFromRAWGAPI($latestGamesUrl);

    $games = array_map(function($game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        return $game;
    }, $latestGamesData['results']);

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

$response = [];
if (isset($_GET['terfilter'])){
    $filters = [];
    if (isset($_GET['platform'])) $filters['platform'] = $_GET['platform'];
    if (isset($_GET['genre'])) $filters['genre'] = $_GET['genre'];
    if (isset($_GET['harga'])) $filters['harga'] = $_GET['harga'];
    if (isset($_GET['sort'])) $filters['sort'] = $_GET['sort'];

    $filteredGames = getFilteredGames($apiKey, $filters);
    $response = ['terfilter' => $filteredGames];
} else {
    $latestGames = getLatestGames($apiKey);
    $response = [
        'terbaru' => $latestGames,
        'terekomendasi' => $latestGames
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
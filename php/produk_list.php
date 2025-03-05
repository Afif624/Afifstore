<?php
session_start();

function getAllData($filename) {
    $data = file_get_contents($filename);
    return json_decode($data, true);
}

$games = getAllData('../dataset/games.json');

function getRandomPrice($min, $max) {
    return rand($min, $max);
}

function getFilteredGames($filters) {
    global $games;
    $filteredGames = [];

    foreach ($games as $game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;

        if (isset($filters['platform'])) {
            if (!in_array($filters['platform'], array_column(array_column($game['platforms'], 'platform'), 'id'))) {
                continue;
            }
        }
        if (isset($filters['genre'])) {
            if (!in_array($filters['genre'], array_column($game['genres'], 'id'))) {
                continue;
            }
        }
        if (isset($filters['harga'])) {
            if ($game['price'] > $filters['harga']) {
                continue;
            }
        }

        $filteredGames[] = $game;
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

function getLatestGames() {
    global $games;
    $latestGames = [];

    foreach ($games as $game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        $latestGames[] = $game;
    }

    usort($latestGames, function($a, $b) {
        return strtotime($b['released']) <=> strtotime($a['released']);
    });

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $resultGames = [];
    foreach ($latestGames as $game) {
        $resultGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $resultGames;
}

function getPopularGames() {
    global $games;
    $popularGames = [];

    foreach ($games as $game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        $popularGames[] = $game;
    }

    usort($popularGames, function($a, $b) {
        return $b['ratings_count'] <=> $a['ratings_count'];
    });

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $resultGames = [];
    foreach ($popularGames as $game) {
        $resultGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $resultGames;
}

function getBestGames() {
    global $games;
    $bestGames = [];

    foreach ($games as $game) {
        $hargaKey = "harga_{$game['id']}";
        $harga = isset($_SESSION[$hargaKey]) ? $_SESSION[$hargaKey] : getRandomPrice(100000, 1000000);
        $_SESSION[$hargaKey] = $harga;
        $game['price'] = $harga;
        $bestGames[] = $game;
    }

    usort($bestGames, function($a, $b) {
        return $b['rating'] <=> $a['rating'];
    });

    $selectedFields = ['id', 'name', 'background_image', 'price', 'rating', 'ratings_count'];
    $resultGames = [];
    foreach ($bestGames as $game) {
        $resultGames[] = array_intersect_key($game, array_flip($selectedFields));
    }

    return $resultGames;
}

$response = [];
if (isset($_GET['terfilter'])) {
    $filters = [];
    if (isset($_GET['platform'])) $filters['platform'] = $_GET['platform'];
    if (isset($_GET['genre'])) $filters['genre'] = $_GET['genre'];
    if (isset($_GET['harga'])) $filters['harga'] = $_GET['harga'];
    if (isset($_GET['sort'])) $filters['sort'] = $_GET['sort'];

    $filteredGames = getFilteredGames($filters);
    $response = ['terfilter' => $filteredGames];
} else {
    $latestGames = getLatestGames();
    $popularGames = getPopularGames();
    $bestGames = getBestGames();
    $response = [
        'terbaru' => $latestGames,
        'terpopuler' => $popularGames,
        'terbaik' => $bestGames
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
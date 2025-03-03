<?php
function getAllData($filename) {
    $data = file_get_contents($filename);
    return json_decode($data, true);
}

$genres = getAllData('../db/genres.json');
$platforms = getAllData('../db/platforms.json');
$games = getAllData('../db/games.json');

$data = [
    'genre' => [],
    'platform' => []
];

$genreGameCount = [];
$platformGameCount = [];

foreach ($games as $game) {
    foreach ($game['genres'] as $genre) {
        $genreId = $genre['id'];
        if (!isset($genreGameCount[$genreId])) {
            $genreGameCount[$genreId] = 0;
        }
        $genreGameCount[$genreId]++;
    }

    foreach ($game['platforms'] as $platform) {
        $platformId = $platform['platform']['id'];
        if (!isset($platformGameCount[$platformId])) {
            $platformGameCount[$platformId] = 0;
        }
        $platformGameCount[$platformId]++;
    }
}

foreach ($genres as $genre) {
    $genreId = $genre['id'];
    $genreName = $genre['name'];
    $genreImage = $genre['image_background'];

    $gameCount = isset($genreGameCount[$genreId]) ? $genreGameCount[$genreId] : 0;

    $data['genre'][] = [
        'id' => $genreId,
        'name' => $genreName,
        'image' => $genreImage,
        'games_count' => $gameCount
    ];
}

foreach ($platforms as $platform) {
    $platformId = $platform['id'];
    $platformName = $platform['name'];
    $platformImage = $platform['image_background'];

    $gameCount = isset($platformGameCount[$platformId]) ? $platformGameCount[$platformId] : 0;

    $data['platform'][] = [
        'id' => $platformId,
        'name' => $platformName,
        'image' => $platformImage,
        'games_count' => $gameCount
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
?>
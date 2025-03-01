<?php
$apiKey = 'ffa2dafa779f4fa58f39bdef9851c466';
$genreUrl = "https://api.rawg.io/api/genres?key={$apiKey}";
$platformUrl = "https://api.rawg.io/api/platforms?key={$apiKey}";

function getAllData($url) {
    $allData = [];
    do {
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        $allData = array_merge($allData, $data['results']);
        $url = $data['next'];
    } while ($url);
    return $allData;
}

$genres = getAllData($genreUrl);
$platforms = getAllData($platformUrl);
$data = [
    'genre' => [],
    'platform' => []
];

foreach ($genres as $genre) {
    $genreId = $genre['id'];
    $genreName = $genre['name'];
    $genreImage = $genre['image_background'];
    $gameCount = $genre['games_count'];

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
    $gameCount = $platform['games_count'];

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
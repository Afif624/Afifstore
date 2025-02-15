<?php
// Include file koneksi ke database
include_once("produk_list_all.php");

// URL API untuk genre dan platform
$genreUrl = "https://api.rawg.io/api/genres?key={$apiKey}";
$platformUrl = "https://api.rawg.io/api/platforms?key={$apiKey}";

// Fungsi untuk mengambil semua data dari API multi-page
function getAllData($url) {
    $allData = [];
    do {
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        $allData = array_merge($allData, $data['results']);
        $url = $data['next']; // URL halaman berikutnya
    } while ($url); // Lanjutkan selama ada halaman berikutnya
    return $allData;
}

// Mengambil semua data genre dari API
$genres = getAllData($genreUrl);

// Mengambil semua data platform dari API
$platforms = getAllData($platformUrl);

// Inisialisasi array untuk menyimpan data genre dan platform
$data = array(
    'genre' => array(),
    'platform' => array()
);

// Mengumpulkan data genre (id, nama, dan jumlah game)
foreach ($genres as $genre) {
    $genreId = $genre['id'];
    $genreName = $genre['name'];
    $genreImage = $genre['image_background'];
    $gameCount = 0;

    // Menghitung jumlah game yang memiliki genre ini
    foreach ($allGames as $game) {
        // Ekstrak ID genre dari array asosiatif
        $gameGenreIds = array_column($game['genres'], 'id');
        if (in_array($genreId, $gameGenreIds)) {
            $gameCount++;
        }
    }

    $data['genre'][] = array(
        'id' => $genreId,
        'name' => $genreName,
        'image' => $genreImage,
        'games_count' => $gameCount
    );
}

// Mengumpulkan data platform (id, nama, dan jumlah game)
foreach ($platforms as $platform) {
    $platformId = $platform['id'];
    $platformName = $platform['name'];
    $platformImage = $platform['image_background'];
    $gameCount = 0;

    // Menghitung jumlah game yang memiliki platform ini
    foreach ($allGames as $game) {
        // Ekstrak ID platform dari array platform yang kompleks
        $gamePlatformIds = array_column(array_column($game['platforms'], 'platform'), 'id');
        if (in_array($platformId, $gamePlatformIds)) {
            $gameCount++;
        }
    }

    $data['platform'][] = array(
        'id' => $platformId,
        'name' => $platformName,
        'image' => $platformImage,
        'games_count' => $gameCount
    );
}

// Mengirimkan data genre dan platform sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
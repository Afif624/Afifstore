<?php
// Include file koneksi ke database
include_once("connect.php");

// URL API untuk genre dan platform
$genreUrl = "https://api.rawg.io/api/genres?key={$apiKey}";
$platformUrl = "https://api.rawg.io/api/platforms?key={$apiKey}";

// Mengambil data genre dari API
$genreResponse = file_get_contents($genreUrl);
$genres = json_decode($genreResponse, true);

// Mengambil data platform dari API
$platformResponse = file_get_contents($platformUrl);
$platforms = json_decode($platformResponse, true);

// Inisialisasi array untuk menyimpan data genre dan platform
$data = array(
    'genre' => array(),
    'platform' => array()
);

// Mengumpulkan data genre (id dan nama)
foreach ($genres['results'] as $genre) {
    $data['genre'][] = array(
        'id' => $genre['id'],
        'name' => $genre['name']
    );
}

// Mengumpulkan data platform (id dan nama)
foreach ($platforms['results'] as $platform) {
    $data['platform'][] = array(
        'id' => $platform['id'],
        'name' => $platform['name']
    );
}

// Mengirimkan data genre dan platform sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
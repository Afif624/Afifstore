<?php
// URL API
$apiUrl = "https://www.freetogame.com/api/games";

// Mengambil data dari API
$response = file_get_contents($apiUrl);

// Mengubah respons JSON menjadi array PHP
$games = json_decode($response, true);

// Inisialisasi array untuk menyimpan data platform dan genre
$data = array(
    'platform' => array(),
    'genre' => array()
);

// Mengumpulkan data platform dan genre tanpa duplikasi
foreach ($games as $game) {
    // Menambahkan platform ke dalam array jika belum ada
    if (!in_array($game['platform'], $data['platform'])) {
        $data['platform'][] = $game['platform'];
    }

    // Menambahkan genre ke dalam array jika belum ada
    if (!in_array($game['genre'], $data['genre'])) {
        $data['genre'][] = $game['genre'];
    }
}

// Mengirimkan data platform dan genre sebagai respons JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
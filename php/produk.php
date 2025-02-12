<?php
// Include file koneksi ke database
include_once("connect.php");

// Initialize filter
$filters = [];

// Filter by platform
if (isset($_GET['platform'])) {
    $filters['platform'] = $_GET['platform'];
}

// Filter by genre
if (isset($_GET['genre'])) {
    $filters['genre'] = $_GET['genre'];
}

// Filter by price (if applicable)
if (isset($_GET['harga'])) {
    $filters['harga'] = $_GET['harga'];
}

// Function to fetch data from RAWG API
function fetchDataFromRAWGAPI($url) {
    $response = file_get_contents($url);
    if ($response === FALSE) {
        die('Error fetching data from RAWG API');
    }
    return json_decode($response, true);
}

// Build the initial RAWG API URL with filters
$rawgUrl = "https://api.rawg.io/api/games?key={$apiKey}";

// Add platform filter if set
if (isset($filters['platform'])) {
    $rawgUrl .= "&platforms={$filters['platform']}";
}

// Add genre filter if set
if (isset($filters['genre'])) {
    $rawgUrl .= "&genres={$filters['genre']}";
}

// Fetch data from all pages, but limit to 100 games
$allGames = [];
$nextPageUrl = $rawgUrl;
$totalGames = 0;

do {
    // Fetch data from the current page
    $data = fetchDataFromRAWGAPI($nextPageUrl);

    // Add games from the current page to the list
    $allGames = array_merge($allGames, $data['results']);

    // Update the total number of games
    $totalGames += count($data['results']);

    // Check if we have reached 100 games
    if ($totalGames >= 100) {
        break;
    }

    // Check if there is a next page
    $nextPageUrl = $data['next'];
} while ($nextPageUrl); // Continue until there are no more pages or we have 100 games

// Apply additional filters (e.g., price) if needed
$filteredData = array_filter($allGames, function($game) use ($filters) {
    $match = true;

    // Filter by price (if applicable)
    if (isset($filters['harga'])) {
        // RAWG API tidak memiliki informasi harga, jadi Anda perlu menyesuaikan logika ini
        // Misalnya, jika Anda menyimpan harga di database atau sumber lain
        $match = $match && ($game['price'] <= $filters['harga']);
    }

    return $match;
});

// Limit the final result to 100 games
$filteredData = array_slice($filteredData, 0, 100);

// Prepare the response
$response = [
    'terfilter' => array_values($filteredData) // Re-index array
];

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
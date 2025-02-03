<?php
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

// Filter by price
if (isset($_GET['harga'])) {
    $filters['harga'] = $_GET['harga'];
}

// Function to fetch data from the API
function fetchDataFromAPI($url) {
    $response = file_get_contents($url);
    if ($response === FALSE) {
        die('Error fetching data from API');
    }
    return json_decode($response, true);
}

// Fetch data from the API
$apiUrl = "https://www.freetogame.com/api/games";
$data = fetchDataFromAPI($apiUrl);

// Apply filters
$filteredData = array_filter($data, function($game) use ($filters) {
    $match = true;

    // Filter by platform
    if (isset($filters['platform'])) {
        $match = $match && (strpos($game['platform'], $filters['platform']) !== false);
    }

    // Filter by genre
    if (isset($filters['genre'])) {
        $match = $match && (strpos($game['genre'], $filters['genre']) !== false);
    }

    // Filter by price
    if (isset($filters['harga'])) {
        $match = $match && ($game['price'] <= $filters['harga']);
    }

    return $match;
});

// Prepare the response
$response = [
    'terfilter' => array_values($filteredData) // Re-index array
];

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
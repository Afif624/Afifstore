<?php
function getAllData($filename) {
    $data = file_get_contents($filename);
    return json_decode($data, true);
}

$gameReviews = getAllData('../db/game_reviews.json');

function getGameReviews($gameId) {
    global $gameReviews;

    $allReviews = array_filter($gameReviews, function($review) use ($gameId) {
        return $review['game_id'] == $gameId;
    });

    // Karena kita hanya menginginkan array datar dari ulasan, cukup gunakan array_values untuk mengambil elemen pertama dari setiap ulasan.
    $reviewsOnly = array_map(function($review) {
        return $review['reviews'];
    }, $allReviews);

    // Menggunakan array_merge untuk meratakan array.
    $flattenedReviews = call_user_func_array('array_merge', $reviewsOnly);

    return $flattenedReviews;
}

$gameId = $_GET['id'];
$reviews = getGameReviews($gameId);

header('Content-Type: application/json');
echo json_encode($reviews);
?>

<?php
ini_set('memory_limit', '1024M');
session_start();
include_once 'connect.php';

$id_user = $_SESSION['id_user'];
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $genres = isset($_POST["genres"]) ? $_POST["genres"] : [];
    $platforms = isset($_POST["platforms"]) ? $_POST["platforms"] : [];
    $tags = isset($_POST["tags"]) ? $_POST["tags"] : [];

    $genresJson = json_encode($genres);
    $platformsJson = json_encode($platforms);
    $tagsJson = json_encode($tags);

    $sql = "UPDATE user 
            SET genres = ?, 
                platforms = ?, 
                tags = ? 
            WHERE id_user = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssi", $genresJson, $platformsJson, $tagsJson, $id_user);

    if ($stmt->execute()) {
        echo "<script>alert('Preferences successfully saved!');
            window.location.href = '../account.html';
        </script>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    function getAllData($filename) {
        $data = file_get_contents($filename);
        $dataArray = json_decode($data, true);
    
        usort($dataArray, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
    
        return $dataArray;
    }    
    
    $genres = getAllData('../dataset/genres.json');
    $platforms = getAllData('../dataset/platforms.json');
    $tags = getAllData('../dataset/tags.json');
    
    $data = [
        'genre' => [],
        'platform' => [],
        'tag' => []
    ];

    if (isset($_GET['preferences'])) {
        $sql = "SELECT * FROM user WHERE id_user = $id_user";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $preferences = [
            'genres' => json_decode($row['genres'], true),
            'platforms' => json_decode($row['platforms'], true),
            'tags' => json_decode($row['tags'], true)
        ];
        $data['preferences'] = $preferences;
    } else {
        $games = getAllData('../dataset/games.json');
        
        $genreGameCount = [];
        $platformGameCount = [];
        $tagGameCount = [];
        
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
        
            foreach ($game['tags'] as $tag) {
                $tagId = $tag['id'];
                if (!isset($tagGameCount[$tagId])) {
                    $tagGameCount[$tagId] = 0;
                }
                $tagGameCount[$tagId]++;
            }
        }
    }
    
    foreach ($genres as $genre) {
        $genreId = $genre['id'];
        $genreName = $genre['name'];

        if (isset($_GET['preferences'])) {
            $data['genre'][] = [
                'id' => $genreId,
                'name' => $genreName
            ];
        } else {
            $genreImage = $genre['image_background'];
            $gameCount = isset($genreGameCount[$genreId]) ? $genreGameCount[$genreId] : 0;
            $data['genre'][] = [
                'id' => $genreId,
                'name' => $genreName,
                'image' => $genreImage,
                'games_count' => $gameCount
            ];
        }
    }
    
    foreach ($platforms as $platform) {
        $platformId = $platform['id'];
        $platformName = $platform['name'];
       
        if (isset($_GET['preferences'])) {
            $data['platform'][] = [
                'id' => $platformId,
                'name' => $platformName
            ];
        } else {
            $platformImage = $platform['image_background'];
            $gameCount = isset($platformGameCount[$platformId]) ? $platformGameCount[$platformId] : 0;
            $data['platform'][] = [
                'id' => $platformId,
                'name' => $platformName,
                'image' => $platformImage,
                'games_count' => $gameCount
            ];
        }
    }
    
    foreach ($tags as $tag) {
        $tagId = $tag['id'];
        $tagName = $tag['name'];
        
        if (isset($_GET['preferences'])) {
            $data['tag'][] = [
                'id' => $tagId,
                'name' => $tagName
            ];
        } else {
            $tagImage = $tag['image_background'];
            $gameCount = isset($tagGameCount[$tagId]) ? $tagGameCount[$tagId] : 0;
            $data['tag'][] = [
                'id' => $tagId,
                'name' => $tagName,
                'image' => $tagImage,
                'games_count' => $gameCount
            ];
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($data);    
}
?>
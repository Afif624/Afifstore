<?php
// Fungsi untuk menghitung cosine similarity antara dua vektor fitur
function cosine_similarity($vector1, $vector2) {
    $dot_product = 0;
    $magnitude1 = 0;
    $magnitude2 = 0;

    foreach ($vector1 as $key => $value) {
        if (isset($vector2[$key])) {
            $dot_product += $vector1[$key] * $vector2[$key];
        }
        $magnitude1 += $vector1[$key] ** 2;
    }

    foreach ($vector2 as $value) {
        $magnitude2 += $value ** 2;
    }

    $magnitude1 = sqrt($magnitude1);
    $magnitude2 = sqrt($magnitude2);

    if ($magnitude1 != 0 && $magnitude2 != 0) {
        return $dot_product / ($magnitude1 * $magnitude2);
    } else {
        return 0;
    }
}

// Koneksi ke database
include_once("connect.php");

// Ambil ID user dari parameter URL atau session
$user_id = 3;

// Ambil semua produk yang pernah dibeli oleh pengguna dari tabel order
$sql_user_orders = "SELECT DISTINCT id_produk FROM `order` WHERE id_user = $user_id";
$result_user_orders = $conn->query($sql_user_orders);

$user_purchased_products = [];
if ($result_user_orders->num_rows > 0) {
    while ($row = $result_user_orders->fetch_assoc()) {
        $user_purchased_products[] = $row['id_produk'];
    }
}

// Jika tidak ada produk yang pernah dibeli oleh pengguna, keluarkan pesan
if (empty($user_purchased_products)) {
    echo json_encode([]);
    exit();
}

// Ambil detail dari semua produk yang pernah dibeli
$purchased_product_details = [];
foreach ($user_purchased_products as $product_id) {
    $sql_product_details = "SELECT * FROM produk WHERE id_produk = $product_id";
    $result_product_details = $conn->query($sql_product_details);
    if ($result_product_details->num_rows > 0) {
        $purchased_product_details[] = $result_product_details->fetch_assoc();
    }
}

// Fungsi untuk menghitung vektor fitur untuk deskripsi produk
function calculate_description_feature_vector($description) {
    // Memisahkan kata-kata dari deskripsi produk
    $words = explode(' ', $description);
    // Menghitung frekuensi kemunculan setiap kata
    $word_frequency = array_count_values($words);
    return $word_frequency;
}

// Fungsi untuk mengambil genre produk dari tabel detailgenre
function get_product_genre($conn, $product_id) {
    $sql_genre = "SELECT nama_genre FROM detailgenre 
        LEFT JOIN genre ON detailgenre.id_genre = genre.id_genre WHERE id_produk = $product_id";
    $result_genre = $conn->query($sql_genre);

    $genres = [];
    if ($result_genre->num_rows > 0) {
        while ($row = $result_genre->fetch_assoc()) {
            $genres[] = $row['nama_genre'];
        }
    }
    return $genres;
}

// Fungsi untuk mengambil kategori produk dari tabel detailkategori
function get_product_category($conn, $product_id) {
    $sql_category = "SELECT nama_kategori FROM detailkategori 
        LEFT JOIN kategori ON detailkategori.id_kategori = kategori.id_kategori WHERE id_produk = $product_id";
    $result_category = $conn->query($sql_category);

    $categories = [];
    if ($result_category->num_rows > 0) {
        while ($row = $result_category->fetch_assoc()) {
            $categories[] = $row['nama_kategori'];
        }
    }
    return $categories;
}

// Ambil semua produk dari database yang tidak dibeli oleh pengguna
$sql_all_products = "SELECT * FROM produk WHERE id_produk NOT IN (" . implode(',', $user_purchased_products) . ")";
$result_all_products = $conn->query($sql_all_products);

// Menghitung similarity dengan produk lain
$recommendations = [];
while ($row = $result_all_products->fetch_assoc()) {
    $total_similarity = 0;
    $num_similarities = 0;

    foreach ($purchased_product_details as $purchased_product) {
        // Menghitung vektor fitur untuk produk yang dibeli
        $purchased_description_vector = calculate_description_feature_vector($purchased_product['desk_produk']);
        $purchased_developer = $purchased_product['dev_produk'];
        $purchased_genres = get_product_genre($conn, $purchased_product['id_produk']);
        $purchased_categories = get_product_category($conn, $purchased_product['id_produk']);

        // Menghitung vektor fitur untuk produk saat ini
        $current_description_vector = calculate_description_feature_vector($row['desk_produk']);
        $current_developer = $row['dev_produk'];
        $current_genres = get_product_genre($conn, $row['id_produk']);
        $current_categories = get_product_category($conn, $row['id_produk']);

        // Menghitung similarity berdasarkan berbagai jenis fitur
        $description_similarity = cosine_similarity($purchased_description_vector, $current_description_vector);
        $developer_similarity = ($purchased_developer == $current_developer) ? 1 : 0;
        $genre_similarity = count(array_intersect($purchased_genres, $current_genres)) / max(count($purchased_genres), count($current_genres));
        $category_similarity = count(array_intersect($purchased_categories, $current_categories)) / max(count($purchased_categories), count($current_categories));

        // Menghitung similarity total untuk produk yang dibeli ini
        $product_similarity = ($description_similarity + $developer_similarity + $genre_similarity + $category_similarity) / 4;

        $total_similarity += $product_similarity;
        $num_similarities++;
    }

    // Rata-rata similarity dari semua produk yang dibeli
    if ($num_similarities > 0) {
        $average_similarity = $total_similarity / $num_similarities;
        $threshold = 0.1; // Anda dapat menyesuaikan nilai threshold sesuai kebutuhan
        if ($average_similarity > $threshold) {
            $recommendations[] = $row;
        }
    }
}

// Mengirim data rekomendasi dalam format JSON
echo json_encode($recommendations);

// Tutup koneksi
$conn->close();
?>

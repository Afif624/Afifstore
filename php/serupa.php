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

// Ambil ID produk yang dipilih dari parameter URL
$selected_product_id = $_GET['id'];

// Ambil detail produk yang dipilih dari database
$sql_selected_product = "SELECT * FROM produk WHERE id_produk = $selected_product_id";
$result_selected_product = $conn->query($sql_selected_product);

if ($result_selected_product->num_rows > 0) {
    $selected_product = $result_selected_product->fetch_assoc();

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

    // Menghitung vektor fitur untuk produk yang dipilih
    $selected_description_vector = calculate_description_feature_vector($selected_product['desk_produk']);
    $selected_developer = $selected_product['dev_produk'];
    $selected_genres = get_product_genre($conn, $selected_product_id);
    $selected_categories = get_product_category($conn, $selected_product_id);

    // Ambil semua produk dari database
    $sql_all_products = "SELECT * FROM produk WHERE id_produk != $selected_product_id";
    $result_all_products = $conn->query($sql_all_products);

    // Menghitung similarity dengan produk lain
    $recommendations = [];
    while ($row = $result_all_products->fetch_assoc()) {
        // Menghitung vektor fitur untuk produk saat ini
        $current_description_vector = calculate_description_feature_vector($row['desk_produk']);
        $current_developer = $row['dev_produk'];
        $current_genres = get_product_genre($conn, $row['id_produk']);
        $current_categories = get_product_category($conn, $row['id_produk']);

        // Menghitung similarity berdasarkan berbagai jenis fitur
        $description_similarity = cosine_similarity($selected_description_vector, $current_description_vector);
        $developer_similarity = ($selected_developer == $current_developer) ? 1 : 0;
        $genre_similarity = count(array_intersect($selected_genres, $current_genres)) / max(count($selected_genres), count($current_genres));
        $category_similarity = count(array_intersect($selected_categories, $current_categories)) / max(count($selected_categories), count($current_categories));

        // Menghitung similarity total
        $total_similarity = ($description_similarity + $developer_similarity + $genre_similarity + $category_similarity) / 4;

        // Jika similarity melewati threshold, tambahkan produk saat ini ke dalam rekomendasi
        $threshold = 0.3; // Anda dapat menyesuaikan nilai threshold sesuai kebutuhan
        if ($total_similarity > $threshold) {
            $recommendations[] = $row;
        }
    }

    // Mengirim data rekomendasi dalam format JSON
    echo json_encode($recommendations);
} else {
    echo "Produk tidak ditemukan.";
}

// Tutup koneksi
$conn->close();
?>

<?php
session_start();

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

// Ambil ID pengguna dari parameter URL
$user_id = $_SESSION['id_user'];

// Ambil daftar produk yang pernah dibeli pengguna dari tabel `order`
$sql_purchased_products = "SELECT DISTINCT id_produk FROM `order` WHERE id_user = $user_id";
$result_purchased_products = $conn->query($sql_purchased_products);

if ($result_purchased_products->num_rows > 0) {
    $purchased_products = [];
    while ($row = $result_purchased_products->fetch_assoc()) {
        $purchased_products[] = $row['id_produk'];
    }

    // Ambil semua produk dari database yang tidak termasuk dalam produk yang pernah dibeli
    $purchased_products_list = implode(',', $purchased_products);
    $sql_all_products = "SELECT * FROM produk WHERE id_produk NOT IN ($purchased_products_list)";
    $result_all_products = $conn->query($sql_all_products);

    // Fungsi untuk menghitung vektor fitur untuk deskripsi produk
    function calculate_description_feature_vector($description) {
        $words = explode(' ', $description);
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

    // Fungsi untuk mengambil rating rata-rata produk dari tabel review
    function get_product_rating($conn, $product_id) {
        $sql_rating = "SELECT AVG(rating) AS avg_rating FROM review WHERE id_produk = $product_id";
        $result_rating = $conn->query($sql_rating);

        if ($result_rating->num_rows > 0) {
            $row = $result_rating->fetch_assoc();
            return floatval($row['avg_rating']);
        }
        return 0;
    }

    // Fungsi untuk mengambil jumlah produk yang sudah diorder dari tabel order
    function get_product_order_count($conn, $product_id) {
        $sql_order_count = "SELECT COUNT(*) AS order_count FROM `order` WHERE id_produk = $product_id";
        $result_order_count = $conn->query($sql_order_count);

        if ($result_order_count->num_rows > 0) {
            $row = $result_order_count->fetch_assoc();
            return intval($row['order_count']);
        }
        return 0;
    }

    // Fungsi untuk mengambil jumlah produk yang sudah dimasukkan cart dari tabel cart
    function get_product_cart_count($conn, $product_id) {
        $sql_cart_count = "SELECT COUNT(*) AS cart_count FROM cart WHERE id_produk = $product_id";
        $result_cart_count = $conn->query($sql_cart_count);

        if ($result_cart_count->num_rows > 0) {
            $row = $result_cart_count->fetch_assoc();
            return intval($row['cart_count']);
        }
        return 0;
    }

    // Fungsi untuk mengambil jumlah produk yang sudah dimasukkan wishlist dari tabel wishlist
    function get_product_wishlist_count($conn, $product_id) {
        $sql_wishlist_count = "SELECT COUNT(*) AS wishlist_count FROM wishlist WHERE id_produk = $product_id";
        $result_wishlist_count = $conn->query($sql_wishlist_count);

        if ($result_wishlist_count->num_rows > 0) {
            $row = $result_wishlist_count->fetch_assoc();
            return intval($row['wishlist_count']);
        }
        return 0;
    }

    // Menghitung similarity dengan produk yang pernah dibeli
    $recommendations = [];
    while ($row = $result_all_products->fetch_assoc()) {
        $is_recommended = false;

        foreach ($purchased_products as $purchased_product_id) {
            // Ambil detail produk yang pernah dibeli dari database
            $sql_purchased_product = "SELECT * FROM produk WHERE id_produk = $purchased_product_id";
            $result_purchased_product = $conn->query($sql_purchased_product);

            if ($result_purchased_product->num_rows > 0) {
                $purchased_product = $result_purchased_product->fetch_assoc();

                // Menghitung vektor fitur untuk produk yang pernah dibeli
                $purchased_description_vector = calculate_description_feature_vector($purchased_product['desk_produk']);
                $purchased_developer = $purchased_product['dev_produk'];
                $purchased_genres = get_product_genre($conn, $purchased_product_id);
                $purchased_categories = get_product_category($conn, $purchased_product_id);

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

                // Menghitung similarity total
                $total_similarity = ($description_similarity + $developer_similarity + $genre_similarity + $category_similarity) / 4;

                // Jika similarity melewati threshold, tandai produk saat ini sebagai rekomendasi
                $threshold = 0.3; // Anda dapat menyesuaikan nilai threshold sesuai kebutuhan
                if ($total_similarity > $threshold) {
                    $is_recommended = true;
                    break;
                }
            }
        }

        if ($is_recommended) {
            // Tambahkan fitur tambahan ke produk
            $row['avg_rating'] = get_product_rating($conn, $row['id_produk']);
            $row['order_count'] = get_product_order_count($conn, $row['id_produk']);
            $row['cart_count'] = get_product_cart_count($conn, $row['id_produk']);
            $row['wishlist_count'] = get_product_wishlist_count($conn, $row['id_produk']);

            // Simpan produk beserta nilai similarity untuk pengurutan
            $row['similarity'] = $total_similarity;
            $recommendations[] = $row;
        }
    }

    // Mengurutkan rekomendasi berdasarkan prioritas
    usort($recommendations, function($a, $b) {
        if ($b['avg_rating'] != $a['avg_rating']) {
            return $b['avg_rating'] <=> $a['avg_rating'];
        } elseif ($b['order_count'] != $a['order_count']) {
            return $b['order_count'] <=> $a['order_count'];
        } elseif ($b['cart_count'] != $a['cart_count']) {
            return $b['cart_count'] <=> $a['cart_count'];
        } else {
            return $b['wishlist_count'] <=> $a['wishlist_count'];
        }
    });

    // Mengirim data rekomendasi dalam format JSON
    echo json_encode($recommendations);
} else {
    // Jika tidak ada produk yang pernah dibeli, ambil semua produk
    $sql_all_products = "SELECT * FROM produk";
    $result_all_products = $conn->query($sql_all_products);

    $all_products = [];
    while ($row = $result_all_products->fetch_assoc()) {
        // Tambahkan fitur tambahan ke produk
        $row['avg_rating'] = get_product_rating($conn, $row['id_produk']);
        $row['order_count'] = get_product_order_count($conn, $row['id_produk']);
        $row['cart_count'] = get_product_cart_count($conn, $row['id_produk']);
        $row['wishlist_count'] = get_product_wishlist_count($conn, $row['id_produk']);

        $all_products[] = $row;
    }

    // Acak produk secara random
    shuffle($all_products);

    // Mengirim data dalam format JSON
    echo json_encode($all_products);
}

// Tutup koneksi
$conn->close();
?>

<?php
// Fungsi untuk menghitung kesamaan kosinus antara dua vektor
function cosine_similarity($vector1, $vector2) {
    $dotProduct = 0.0;
    $magnitude1 = 0.0;
    $magnitude2 = 0.0;

    foreach ($vector1 as $key => $value) {
        $dotProduct += $value * $vector2[$key];
        $magnitude1 += $value * $value;
        $magnitude2 += $vector2[$key] * $vector2[$key];
    }

    if ($magnitude1 == 0.0 || $magnitude2 == 0.0) {
        return 0.0;
    } else {
        return $dotProduct / (sqrt($magnitude1) * sqrt($magnitude2));
    }
}

// Koneksi ke database
include_once("connect.php");

// Memeriksa koneksi
if ($conn->connect_error) {
    die("Koneksi Gagal: " . $conn->connect_error);
}

// Mendapatkan id produk dari parameter URL
if (isset($_GET['id'])) {
    $selected_product_id = $_GET['id'];

    // Query untuk mendapatkan data produk yang dipilih
    $sql_selected_product = "SELECT * FROM produk WHERE id_produk = $selected_product_id";
    $result_selected_product = $conn->query($sql_selected_product);

    if ($result_selected_product->num_rows > 0) {
        // Menemukan data produk yang dipilih
        $selected_product = $result_selected_product->fetch_assoc();

        // Query untuk mendapatkan semua produk kecuali yang dipilih
        $sql_all_products = "SELECT * FROM produk WHERE id_produk != $selected_product_id";
        $result_all_products = $conn->query($sql_all_products);

        // Membuat vektor fitur untuk produk yang dipilih
        $selected_features = explode(' ', $selected_product['desk_produk']);
        // Asumsikan desk_produk mengandung fitur-fitur

        // Mendapatkan rekomendasi berdasarkan kesamaan kosinus
        $recommendations = [];
        if ($result_all_products->num_rows > 0) {
            while ($row = $result_all_products->fetch_assoc()) {
                // Membuat vektor fitur untuk produk saat ini
                $current_features = explode(' ', $row['desk_produk']);
                // Asumsikan desk_produk mengandung fitur-fitur

                // Menghitung kesamaan kosinus antara produk yang dipilih dan produk saat ini
                $similarity = cosine_similarity($selected_features, $current_features);

                // Menyimpan produk saat ini ke dalam rekomendasi jika similarity > threshold
                $threshold = 0.5; // Anda dapat menyesuaikan nilai threshold sesuai kebutuhan
                if ($similarity > $threshold) {
                    $recommendations[] = $row;
                }
            }
        }

        // Tampilkan detail produk yang dipilih
        echo "<h1>{$selected_product['nama_produk']}</h1>";
        echo "<p>Harga: {$selected_product['harga_produk']}</p>";
        echo "<p>{$selected_product['desk_produk']}</p>";

        // Tampilkan rekomendasi
        echo "<h2>Produk Rekomendasi:</h2>";
        foreach ($recommendations as $recommendation) {
            echo "<p>{$recommendation['nama_produk']}</p>";
            // Tampilkan detail lainnya dari produk rekomendasi jika diperlukan
            echo '<div class="product-item bg-light">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="img/' . $recommendation['file_produk'] . '" alt="">
                    <div class="product-action">
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="">' . $recommendation['nama_produk'] . '</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>$' . $recommendation['harga_produk'] . '</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        <small class="fa fa-star text-primary mr-1"></small>
                        <small class="fa fa-star text-primary mr-1"></small>
                        <small class="fa fa-star text-primary mr-1"></small>
                        <small class="fa fa-star text-primary mr-1"></small>
                        <small class="fa fa-star text-primary mr-1"></small>
                        <small>(99)</small>
                    </div>
                </div>
            </div>';
        }
    } else {
        echo "Produk tidak ditemukan.";
    }
} else {
    echo "Parameter ID produk tidak ditemukan.";
}

// Menutup koneksi
$conn->close();
?>

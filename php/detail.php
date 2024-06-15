<?php
session_start();
$product_id = $_GET['id']; // Assuming you're getting product ID from URL parameter
$filename = $_GET['filename'];

// Include file koneksi ke database
include_once("connect.php");

// Fetch product details query
$sql = "SELECT * FROM produk WHERE id_produk = $product_id";
$result = $conn->query($sql);

// Check if there's any result
if ($result->num_rows > 0) {
    // Output data of the product
    $row = $result->fetch_assoc();
    $nama_produk = $row["nama_produk"];
    $harga_produk = $row["harga_produk"];
    $desk_produk = $row["desk_produk"];
    $dev_produk = $row["dev_produk"];
    $publ_produk = $row["publ_produk"];
    $tgl_produk = $row["tgl_produk"];
    $file_produk = $row["file_produk"];

    // Fetch genre name based on product ID
    $genre_query = "SELECT nama_genre FROM detailgenre INNER JOIN genre ON detailgenre.id_genre = genre.id_genre WHERE detailgenre.id_produk = $product_id";
    $genre_result = $conn->query($genre_query);
    $genre_names = [];
    while ($genre_row = $genre_result->fetch_assoc()) {
        $genre_names[] = $genre_row["nama_genre"];
    }
    $genres = implode(", ", $genre_names);

    // Fetch category name based on product ID
    $kategori_query = "SELECT nama_kategori FROM detailkategori INNER JOIN kategori ON detailkategori.id_kategori = kategori.id_kategori WHERE detailkategori.id_produk = $product_id";
    $kategori_result = $conn->query($kategori_query);
    $kategori_names = [];
    while ($kategori_row = $kategori_result->fetch_assoc()) {
        $kategori_names[] = $kategori_row["nama_kategori"];
    }
    $kategoris = implode(", ", $kategori_names);

    // Query untuk mengambil review dari database
    $sql_reviews = "SELECT *,user.nama FROM review INNER JOIN user 
        ON review.id_user = user.id_user WHERE review.id_produk = $product_id";
    $result_reviews = $conn->query($sql_reviews);

    // Ambil id_user dari sesi
    $id_user = $_SESSION['id_user'];
    
    // Query untuk mengambil nama dan email dari tabel pengguna berdasarkan id_user
    $sql_user = "SELECT nama, email FROM user WHERE id_user = $id_user";
    $result_user = $conn->query($sql_user);
    if ($result_user->num_rows > 0) {
        $row_user = $result_user->fetch_assoc();
        $nama = $row_user['nama'];
        $email = $row_user['email'];
    } else {
        $nama = "Nama Pengguna";
        $email = "email@example.com";
    }

    // Output product details HTML
    echo '
    <div class="row px-xl-5">
        <div class="col-lg-5 mb-30">
            <div id="product-carousel" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner bg-light">
                    <div class="carousel-item active">
                        <img class="w-100 h-100" src="img/' . $file_produk . '" alt="Image">
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-7 h-auto mb-30">
            <div class="h-100 bg-light p-30">
                <h3>' . $nama_produk . '</h3>
                <div class="d-flex mb-3">
                    <div class="text-primary mr-2">';
                        $ratings = [];
                        while($row = $result_reviews->fetch_assoc()) {
                            $ratings[] = $row['rating'];
                        }
                        
                        if (count($ratings) > 0) {
                            $average_rating = array_sum($ratings) / count($ratings);
                        } else {
                            $average_rating = 0;
                        }
                        
                        $full_stars = floor($average_rating);
                        $half_star = ($average_rating - $full_stars) >= 0.5 ? 1 : 0;
                        $empty_stars = 5 - ($full_stars + $half_star);
                        
                        echo '<div class="text-primary mr-2">';
                        for ($i = 0; $i < $full_stars; $i++) {
                            echo '<small class="fas fa-star"></small>';
                        }
                        if ($half_star) {
                            echo '<small class="fas fa-star-half-alt"></small>';
                        }
                        for ($i = 0; $i < $empty_stars; $i++) {
                            echo '<small class="far fa-star"></small>';
                        }
                        echo '</div>';
                    echo '</div>
                    <small class="pt-1">('. $result_reviews->num_rows .' Reviews)</small>
                </div>
                <h3 class="font-weight-semi-bold mb-4">Rp ' . $harga_produk. '</h3>
                <div class="d-flex mb-4">
                    <strong class="text-dark mr-3">Genre:</strong>';
                    // Fetch genre names based on product ID
                    $genre_query = "SELECT nama_genre FROM detailgenre INNER JOIN genre ON detailgenre.id_genre = genre.id_genre WHERE detailgenre.id_produk = $product_id";
                    $genre_result = $conn->query($genre_query);
                    while ($genre_row = $genre_result->fetch_assoc()) {
                        echo '<div class="custom-control custom-radio custom-control-inline">';
                        echo '<input type="radio" class="custom-control-input" id="genre-' . $genre_row["nama_genre"] . '" name="genre" disabled>';
                        echo '<label class="custom-control-label" for="genre-' . $genre_row["nama_genre"] . '">' . $genre_row["nama_genre"] . '</label>';
                        echo '</div>';
                    }
                echo '</div>
                <div class="d-flex mb-4">
                    <strong class="text-dark mr-3">Category:</strong>';
                    // Fetch category names based on product ID
                    $category_query = "SELECT nama_kategori FROM detailkategori INNER JOIN kategori ON detailkategori.id_kategori = kategori.id_kategori WHERE detailkategori.id_produk = $product_id";
                    $category_result = $conn->query($category_query);
                    while ($category_row = $category_result->fetch_assoc()) {
                        echo '<div class="custom-control custom-radio custom-control-inline">';
                        echo '<input type="radio" class="custom-control-input" id="category-' . $category_row["nama_kategori"] . '" name="category" disabled>';
                        echo '<label class="custom-control-label" for="category-' . $category_row["nama_kategori"] . '">' . $category_row["nama_kategori"] . '</label>';
                        echo '</div>';
                    }
                echo '</div>
                <div class="d-flex align-items-center mb-4 pt-2">';
                    $sql_order = "SELECT * FROM `order` WHERE id_user = $id_user AND id_produk = $product_id";
                    $result_order = $conn->query($sql_order);
                    if ($result_order->num_rows > 0){
                        echo '
                        <form method="post" class="mr-3">
                            <button class="btn btn-primary px-3" disabled>Sudah Anda Dibeli</button>
                        </form>';
                    } else {
                        $sql_wish = "SELECT * FROM wishlist WHERE id_user = $id_user AND id_produk = $product_id";
                        $result_wish = $conn->query($sql_wish);
                        if ($result_wish->num_rows > 0){
                            echo '
                            <form method="post" action="php/form_wish.php?id_produk=' . $product_id . '" class="mr-3">
                                <input type="hidden" name="sourcePage" value="'. $filename .'?id='. $product_id .'" />
                                <button class="btn btn-primary px-3" type="submit" name="delete"><i class="far fa-heart mr-1"></i> Delete From Wishlist</button>
                            </form>';
                        } else {
                            echo '
                            <form method="post" action="php/tambahwish.php" class="mr-3">
                                <input type="hidden" name="id_produk" value="' . $product_id . '">
                                <button class="btn btn-primary px-3" type="submit" name="add"><i class="far fa-heart mr-1"></i> Add To Wishlist</button>
                            </form>';
                        }
                        $sql_cart = "SELECT * FROM cart WHERE id_user = $id_user AND id_produk = $product_id";
                        $result_cart = $conn->query($sql_cart);
                        if ($result_cart->num_rows > 0){
                            echo '
                            <form method="post" action="php/form_cart.php?id_produk=' . $product_id . '">
                                <input type="hidden" name="sourcePage" value="'. $filename .'?id='. $product_id .'" />
                                <button class="btn btn-primary px-3" type="submit" name="delete"><i class="fa fa-shopping-cart mr-1"></i> Delete From Cart</button>
                            </form>';
                        } else{
                            echo '
                            <form method="post" action="php/tambahcart.php">
                                <input type="hidden" name="id_produk" value="' . $product_id . '">
                                <button class="btn btn-primary px-3" type="submit" name="add"><i class="fa fa-shopping-cart mr-1"></i> Add To Cart</button>
                            </form>';
                        }
                    }
                    echo '
                </div>
                <div class="d-flex pt-2">
                    <strong class="text-dark mr-2">Share on:</strong>
                    <div class="d-inline-flex">
                        <a class="text-dark px-2" href="">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a class="text-dark px-2" href="">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a class="text-dark px-2" href="">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a class="text-dark px-2" href="">
                            <i class="fab fa-pinterest"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row px-xl-5">
        <div class="col">
            <div class="bg-light p-30">
                <div class="nav nav-tabs mb-4">
                    <a class="nav-item nav-link text-dark active" data-toggle="tab" href="#tab-pane-1">Description</a>
                    <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-2">Information</a>
                    <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews ('. $result_reviews->num_rows .')</a>
                </div>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="tab-pane-1">
                        <h4 class="mb-3">Product Description</h4>
                        <p>' . $desk_produk . '</p>
                    </div>
                    <div class="tab-pane fade" id="tab-pane-2">
                        <h4 class="mb-3">Additional Information</h4>
                        <div class="row">
                            <div class="col-md-6">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item px-0">Developer: ' . $dev_produk . '</li>
                                    <li class="list-group-item px-0">Publisher: ' . $publ_produk . '</li>
                                    <li class="list-group-item px-0">Release Date: ' . $tgl_produk . '</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item px-0">Genre: ' . $genres . '</li>
                                    <li class="list-group-item px-0">Category: ' . $kategoris . '</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="tab-pane-3">
                        <div class="row">
                            <div class="col-md-6">
                                <h4 class="mb-4">Leave a review</h4>
                                <form method="post" action="php/review.php">
                                    <div class="d-flex my-3">
                                        <p class="mb-0 mr-2">Your Rating * :</p>
                                        <div class="text-primary">
                                            <!-- Rating stars -->
                                            <input type="hidden" id="rating" name="rating" value="0">
                                            <i class="far fa-star" onclick="setRating(1)" id="star1"></i>
                                            <i class="far fa-star" onclick="setRating(2)" id="star2"></i>
                                            <i class="far fa-star" onclick="setRating(3)" id="star3"></i>
                                            <i class="far fa-star" onclick="setRating(4)" id="star4"></i>
                                            <i class="far fa-star" onclick="setRating(5)" id="star5"></i>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="review">Your Review *</label>
                                        <textarea id="review" name="review" cols="30" rows="5" class="form-control" required></textarea>
                                    </div>
                                    <div class="form-group">
                                        <!-- Menampilkan nama berdasarkan hasil query -->
                                        <label for="name">Your Name *</label>
                                        <input type="text" class="form-control" id="name" name="name" value="' . $nama . '" required readonly>
                                    </div>
                                    <div class="form-group">
                                        <!-- Menampilkan email berdasarkan hasil query -->
                                        <label for="email">Your Email *</label>
                                        <input type="email" class="form-control" id="email" name="email" value="' . $email . '" required readonly>
                                    </div>
                                    <input type="hidden" name="id_produk" value="' . $product_id . '">
                                    <div class="form-group mb-0">
                                        <input type="submit" value="Leave Your Review" class="btn btn-primary px-3">
                                    </div>
                                </form>
                            </div>
                            <div class="col-md-6">';
                            if ($result_reviews->num_rows > 0) {
                                echo '<h4 class="mb-4">Review for "' . $nama_produk . '"</h4>';
                                while ($row_review = $result_reviews->fetch_assoc()) {
                                echo '<div class="media mb-4">
                                    <img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
                                    <div class="media-body">
                                        <h6>' . $row_review['nama'] . '<small> - <i>' . $row_review['tanggal'] . '</i></small></h6>
                                        <div class="text-primary mb-2">';
                                        for ($i = 1; $i <= $row_review['rating']; $i++) {
                                            echo '<i class="fas fa-star"></i>';
                                        }
                                        for ($i = $row_review['rating'] + 1; $i <= 5; $i++) {
                                            echo '<i class="far fa-star"></i>';
                                        }
                                        echo '</div>
                                        <p>' . $row_review['review'] . '</p>
                                    </div>
                                </div>';
                                }
                            } else {
                                echo '<h4 class="mb-4">No reviews yet</h4>';
                            }
                            echo '</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>';
} else {
    echo "0 results";
}
$conn->close();
?>

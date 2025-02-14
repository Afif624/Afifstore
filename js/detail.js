$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "php/jumlah_cart&wishlist.php",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
        console.log(response);
            // Update elemen HTML kategori
            var wishlistHTML = '';
            wishlistHTML += '<i class="fas fa-heart text-primary"></i>';
            wishlistHTML += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.wishlist +'</span>';
            $('#wishlist').html(wishlistHTML);

            // Update elemen HTML genre
            var cartHTML = '';
            cartHTML += '<i class="fas fa-shopping-cart text-primary"></i>';
            cartHTML += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.cart +'</span>';
            $('#cart').html(cartHTML);
        }
    });
});

// Function to get product ID from URL parameters
function getFilename() {
    var segments = window.location.pathname.split('/');
    var toDelete = [];
    for (var i = 0; i < segments.length; i++) {
        if (segments[i].length < 1) {
            toDelete.push(i);
        }
    }
    for (var i = 0; i < toDelete.length; i++) {
        segments.splice(i, 1);
    }
    var filename = segments[segments.length - 1];
    return filename;
}

// Function to get product ID from URL parameters
function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    return productId;
}

// Fungsi untuk memuat detail produk
function loadProductDetails(productId) {
    // Array untuk menyimpan semua data
    let productData = {};

    // Fetch data produk, review, genre, dan kategori
    fetch(`php/produk_list_all.php?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            productData = { ...productData, ...data };

            // Fetch data wishlist
            return fetch(`php/wish_list.php?id=${productId}`);
        })
        .then(response => response.json())
        .then(data => {
            productData.wish_count = data.wish_count;

            // Fetch data cart
            return fetch(`php/cart_list.php?id=${productId}`);
        })
        .then(response => response.json())
        .then(data => {
            productData.cart_count = data.cart_count;

            // Fetch data order
            return fetch(`php/order_list.php?id=${productId}`);
        })
        .then(response => response.json())
        .then(data => {
            productData.order_count = data.order_count;

            // Render semua data
            renderProductDetails(productData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Fungsi untuk menampilkan detail produk
function renderProductDetails(data) {
    console.log(data);
    var game = data.game;
    var added = game.added_by_status;
    var platforms = game.platforms;

    var reviews = data.reviews;
    var reviewUser = reviews.user;

    var username = data.nama_user;
    var email = data.email_user;

    var wishCount = data.wish_count;
    var cartCount = data.cart_count;
    var orderCount = data.order_count;

    var html = '';
    function renderScreenShots(screenshots) {
        screenshots.forEach(screenshot => {
            html += '<div class="carousel-item">';
            html += '<img class="w-100 h-100" src="'+ screenshot.image +'" alt="Image">';
            html += '</div>';
        });
        return html;
    }

    function renderRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
        for (let i = 0; i < fullStars; i++) {
            html += '<small class="fa fa-star"></small>';
        }
        if (hasHalfStar) {
            html += '<small class="fa fa-star-half-alt"></small>';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '<small class="far fa-star"></small>';
        }
        return html;
    }

    function renderGenres(genres) {
        genres.forEach(genre => {
            html += '<div class="custom-control custom-radio custom-control-inline">';
            html += '<input type="radio" class="custom-control-input" id="genre-'+ genre.name +'" name="genre" disabled>';
            html += '<label class="custom-control-label" for="genre-'+ genre.name +'">'+ genre.name +'</label>';
            html += '</div>';
        });
        return html;
    }

    function renderPlatforms(platforms) {
        platforms.forEach(platform => {
            html += '<div class="custom-control custom-radio custom-control-inline">';
            html += '<input type="radio" class="custom-control-input" id="platform-'+ platform.name +'" name="platform" disabled>';
            html += '<label class="custom-control-label" for="platform-'+ platform.name +'">'+ platform.name +'</label>';
            html += '</div>';
        });
        return html;
    }

    function renderButtons(order, wish, cart){
        if (order.length > 0){
            html += '<form method="post" class="mr-3">';
            html += '<button class="btn btn-primary px-3" disabled>Sudah Anda Beli</button>';
            html += '</form>';
        } else {
            if (wish.length > 0){
                html += '<form method="post" action="php/wish_form.php?id_produk='+ game.id +'" class="mr-3">';
                html += '<input type="hidden" name="sourcePage" value="'+ filename +'?id='+ game.id +'" />';
                html += '<button class="btn btn-primary px-3" type="submit" name="delete"><i class="far fa-heart mr-1"></i> Delete From Wishlist</button>';
                html += '</form>';
            } else {
                html += '<form method="post" action="php/wish_add.php" class="mr-3">';
                html += '<input type="hidden" name="id_produk" value="'+ game.id +'">';
                html += '<button class="btn btn-primary px-3" type="submit" name="add"><i class="far fa-heart mr-1"></i> Add To Wishlist</button>';
                html += '</form>';
            }

            if (cart.length > 0){
                html += '<form method="post" action="php/cart_form.php?id_produk='+ game.id +'">';
                html += '<input type="hidden" name="sourcePage" value="'+ filename +'?id='+ game.id +'" />';
                html += '<button class="btn btn-primary px-3" type="submit" name="delete"><i class="fa fa-shopping-cart mr-1"></i> Delete From Cart</button>';
                html += '</form>';
            } else {
                html += '<form method="post" action="php/cart_add.php">';
                html += '<input type="hidden" name="id_produk" value="'+ game.id +'">';
                html += '<button class="btn btn-primary px-3" type="submit" name="add"><i class="fa fa-shopping-cart mr-1"></i> Add To Cart</button>';
                html += '</form>';
            }
        }
        return html;
    }

    function renderReviews(reviews){
        if (reviews.length > 0){
            html += '<h4 class="mb-4">Review for "'+ game.name +'"</h4>';
            reviews.forEach(review => {
                html += '<div class="media mb-4">';
                html += '<img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">';
                html += '<div class="media-body">';
                html += '<h6>'+ reviewUser.username +'<small> - ';
                html += '<i>'+ review.created; if(review.edited > 0){'edited'}+'</i></small></h6>';
                html += '<div class="text-primary mb-2">';

                const fullStars = Math.floor(review.rating);
                const hasHalfStar = rating % 1 !== 0;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                for (let i = 0; i < fullStars; i++) {
                    html += '<i class="fas fa-star"></i>';
                }
                if (hasHalfStar) {
                    html += '<i class="fas fa-star-half-alt"></i>';
                }
                for (let i = 0; i < emptyStars; i++) {
                    html += '<i class="far fa-star"></i>';
                }

                html += '</div>';
                html += '<p>'+ review.text +'</p>';
                html += '</div>';
                html += '</div>';
            });
        } else {
            html += '<h4 class="mb-4">No reviews yet</h4>';
        }
        return html;
    }

    html += `
        <div class="row px-xl-5">
            <div class="col-lg-5 mb-30">
                <div id="product-carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner bg-light">
                        <div class="carousel-item active">
                            <img class="w-100 h-100" src="img/${game.background_image}" alt="Image">
                        </div>
                        ${renderScreenShots(game.short_screenshots)}
                    </div>
                </div>
            </div>

            <div class="col-lg-7 h-auto mb-30">
                <div class="h-100 bg-light p-30">
                    <h3>${game.name}</h3>
                    <h3 class="font-weight-semi-bold mb-4">Rp ${game.price}</h3>
                    <div class="d-flex mb-3">
                        <div class="text-primary mr-2">
                            ${renderRatingStars(game.rating)}
                        </div>
                        <small class="pt-1">(${game.ratings_count} Reviews)</small>
                    </div>
                    <div class="d-flex mb-4">
                        <strong class="text-dark mr-3">Genre:</strong>
                        ${renderGenres(game.genres)}
                    </div>
                    <div class="d-flex mb-4">
                        <strong class="text-dark mr-3">Platform:</strong>
                        ${renderPlatforms(platforms.platform)}
                    </div>
                    <div class="d-flex mb-4">
                        <strong class="text-dark mr-3">Added:</strong>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="wish" name="wish" disabled>
                            <label class="custom-control-label" for="wish">${added.beaten} Wishs</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="cart" name="cart" disabled>
                            <label class="custom-control-label" for="cart">${added.dropped} Carts</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="order" name="order" disabled>
                            <label class="custom-control-label" for="order">${added.owned} Orders</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="wish" name="wish" disabled>
                            <label class="custom-control-label" for="wish">${added.playing} Wishs</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="cart" name="cart" disabled>
                            <label class="custom-control-label" for="cart">${added.toplay} Carts</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="order" name="order" disabled>
                            <label class="custom-control-label" for="order">${added.yet} Orders</label>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mb-4 pt-2">
                        ${renderButtons(orderCount, wishCount, cartCount)}
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
                        <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-3">Reviews (${reviews.length})</a>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-pane-1">
                            <h4 class="mb-3">Product Description</h4>
                            <p>${game.description}</p>
                        </div>
                        <div class="tab-pane fade" id="tab-pane-2">
                            <h4 class="mb-3">Additional Information</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item px-0">Developer: ${game.developers}</li>
                                        <li class="list-group-item px-0">Publisher: ${game.publishers}</li>
                                        <li class="list-group-item px-0">Release Date: ${game.released}</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item px-0">Metacritic: ${game.metacritic}</li>
                                        <li class="list-group-item px-0">Suggestions: ${game.suggestions_count}</li>
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
                                            <label for="name">Your Name *</label>
                                            <input type="text" class="form-control" id="name" name="name" value="${username}" required readonly>
                                        </div>
                                        <div class="form-group">
                                            <label for="email">Your Email *</label>
                                            <input type="email" class="form-control" id="email" name="email" value="${email}" required readonly>
                                        </div>
                                        <input type="hidden" name="id_produk" value="${game.id}">
                                        <div class="form-group mb-0">
                                            <input type="submit" value="Leave Your Review" class="btn btn-primary px-3">
                                        </div>
                                    </form>
                                </div>
                                <div class="col-md-6">
                                    ${renderReviews(reviews)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.shop-detail').html(html);
}

function setRating(rating) {
    // Atur nilai rating ke input tersembunyi
    document.getElementById('rating').value = rating;

    // Perbarui tampilan bintang berdasarkan rating yang dipilih
    for (let i = 1; i <= 5; i++) {
        const star = document.getElementById('star' + i);
        if (i <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    }
}

function loadRecommendations() {
    var productId = getProductIdFromUrl();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/serupa.php?id=" + productId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var recommendations = JSON.parse(xhr.responseText);
            renderRecommendations(recommendations);
        }
    };
    xhr.send();
}

function renderRecommendations(recommendations) {
    var productsContainer = document.querySelector('.shop-similar');
    productsContainer.innerHTML = "";
    var htmlContent = ``;
    if (recommendations.length > 0) {
        htmlContent += `<div class="owl-carousel related-carousel" id="carousel-container">`;
        recommendations.forEach(function(product) {
            htmlContent += `
            <div class="product-item bg-light">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="img/${game.background_image}" alt="">
                    <div class="product-action">
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${game.id}">${game.name}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${game.price}</h5>
                    </div>
                </div>
            </div>`;
        });
        htmlContent += `</div>`;
    } else {
        htmlContent += `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">No recommendations found</span>
        </h2>`;
    }
    productsContainer.innerHTML = htmlContent;

    // Assuming you have loaded the HTML using innerHTML
    var carouselContainer = document.getElementById('carousel-container');

    // Initialize owl carousel
    $(carouselContainer).owlCarousel({
        loop: true,
        autoplay: true
    });
}

// Memuat detail produk saat halaman dimuat
$(document).ready(function() {
    var productId = getProductIdFromUrl();
    if (productId) {
        loadProductDetails(productId);
        loadRecommendations();
    } else {
        console.error('Product ID not found in URL.');
    }
});

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
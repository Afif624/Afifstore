$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "php/wish.php",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
            console.log(response.wish_count);
            // Update elemen HTML wish
            var wishHTML = '';
            wishHTML += '<i class="fas fa-heart text-primary"></i>';
            wishHTML += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.wish_count +'</span>';
            $('#wishlist').html(wishHTML);
        }
    });
    $.ajax({
        type: "GET",
        url: "php/cart.php",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
            console.log(response.cart_count);
            // Update elemen HTML cart
            var cartHTML = '';
            cartHTML += '<i class="fas fa-shopping-cart text-primary"></i>';
            cartHTML += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.cart_count +'</span>';
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

function loadProductDetails(productId, file) {
    let productData = {};

    fetch(`php/produk_one.php?id=${productId}`)
        .then(response => {
            console.log('Response from produk_one.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from produk_one.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData = { ...productData, ...data };
            return fetch(`php/login_check.php?id=${productId}`);
        })
        .then(response => {
            console.log('Response from login_check.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from login_check.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData = { ...productData, ...data };
            return fetch(`php/yourreview.php?id=${productId}`);
        })
        .then(response => {
            console.log('Response from yourreview.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from yourreview.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData.yourreview = data.yourreview;
            return fetch(`php/wish.php?id=${productId}`);
        })
        .then(response => {
            console.log('Response from wish.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from wish.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData.wish_status = data.wish_status;
            return fetch(`php/cart.php?id=${productId}`);
        })
        .then(response => {
            console.log('Response from cart.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from cart.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData.cart_status = data.cart_status;
            return fetch(`php/order.php?id=${productId}`);
        })
        .then(response => {
            console.log('Response from order.php:', response); // Log respons mentah
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Ubah sementara ke .text() untuk melihat respons mentah
        })
        .then(text => {
            console.log('Raw data from order.php:', text); // Log teks respons
            return JSON.parse(text); // Coba parse teks ke JSON
        })
        .then(data => {
            productData.order_status = data.order_status;
            renderProductDetails(productData, file);
        })
        .catch(error => {
            console.error('Error in loadProductDetails:', error.message);
            console.error('Stack trace:', error.stack); // Tampilkan stack trace untuk debugging
        });
}

// Fungsi untuk menampilkan detail produk
function renderProductDetails(data, file) {
    console.log(data);
    var game = data.game;
    var added = game.added_by_status;

    var reviews = data.reviews;

    var user_name = data.nama_user;
    var user_email = data.email_user;

    var wishStatus = data.wish_status;
    var cartStatus = data.cart_status;
    var orderStatus = data.order_status;

    function renderScreenShots(image, screenshots) {
        var html = '';
        if (image != null){
            html += '<div class="carousel-item">';
            html += '<img class="w-100 h-100" src="'+ image +'" alt="Image">';
            html += '</div>';
        }
        if (screenshots != null){
            screenshots.forEach(screenshot => {
                html += '<div class="carousel-item">';
                html += '<img class="w-100 h-100" src="'+ screenshot.image +'" alt="Image">';
                html += '</div>';
            });
        }
        return html;
    }

    function renderRatingStars(rating) {
        var html = '';
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 !== 0;
        var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
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
        var html = '';
        genres.forEach((genre, index) => {
            html += genre.name;
            if (index < genres.length - 1) {
                html += ', ';
            }
        });
        return html;
    }

    function renderPlatforms(platforms) {
        var html = '';
        platforms.forEach((platform, index) => {
            var plat = platform.platform;
            html += plat.name;
            if (index < platforms.length - 1) {
                html += ', ';
            }
        });
        return html;
    }

    function renderDevelopers(developers) {
        var html = '';
        developers.forEach((developer, index) => {
            html += developer.name;
            if (index < developers.length - 1) {
                html += ', ';
            }
        });
        return html;
    }

    function renderPublishers(publishers) {
        var html = '';
        publishers.forEach((publisher, index) => {
            html += publisher.name;
            if (index < publishers.length - 1) {
                html += ', ';
            }
        });
        return html;
    }

    function renderButtons(order, wish, cart, id, file){
        var html = '';
        if (order > 0){
            html += '<form method="post" class="mr-3">';
            html += '<button class="btn btn-primary px-3" disabled>Sudah Anda Beli</button>';
            html += '</form>';
        } else {
            if (wish > 0){
                html += '<form method="post" action="php/wish.php?id_produk='+ id +'" class="mr-3">';
                html += '<input type="hidden" name="sourcePage" value="'+ file +'?id='+ id +'" />';
                html += '<button class="btn btn-primary px-3" type="submit" name="delete"><i class="far fa-heart mr-1"></i> Delete From Wishlist</button>';
                html += '</form>';
            } else {
                html += '<form method="post" action="php/wish.php" class="mr-3">';
                html += '<input type="hidden" name="id_produk" value="'+ id +'">';
                html += '<button class="btn btn-primary px-3" type="submit" name="add"><i class="far fa-heart mr-1"></i> Add To Wishlist</button>';
                html += '</form>';
            }

            if (cart > 0){
                html += '<form method="post" action="php/cart.php?id_produk='+ id +'">';
                html += '<input type="hidden" name="sourcePage" value="'+ file +'?id='+ id +'" />';
                html += '<button class="btn btn-primary px-3" type="submit" name="delete"><i class="fa fa-shopping-cart mr-1"></i> Delete From Cart</button>';
                html += '</form>';
            } else {
                html += '<form method="post" action="php/cart.php">';
                html += '<input type="hidden" name="id_produk" value="'+ id +'">';
                html += '<button class="btn btn-primary px-3" type="submit" name="add"><i class="fa fa-shopping-cart mr-1"></i> Add To Cart</button>';
                html += '</form>';
            }
        }
        return html;
    }

    function renderReviews(reviews){
        function getAvatar(avatar, user){
            var html = '';
            if(avatar != null){html += avatar}
            else{
                if(user != null && user.avatar != null){html += user.avatar}
                else{html += 'img/user.jpg'}
            }
            return html;
        }
        function getAuthor(author, user){
            var html = '';
            if(author != null){html += author}
            else{
                if(user != null && user.username !=null){html += user.username}
                else{html += 'username'}
            }
            return html;
        }
        function getEdited(edited){
            var html = '';
            if(edited != null){html += '(edited)';}
            return html;
        }

        var html = '';
        if (reviews.length > 0){
            html += '<h4 class="mb-4">Review for "'+ game.name +'"</h4>';
            reviews.forEach(review => {
                html += '<div class="media mb-4">';
                html += '<img src="'+ getAvatar(review.external_avatar, review.user) +'" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">';
                html += '<div class="media-body">';
                html += '<h6>'+ getAuthor(review.external_author, review.user) +'<small> - ';
                html += '<i>'+ review.created +' '+ getEdited(review.edited)+'</i></small></h6>';
                html += '<div class="text-primary mb-2">';

                var fullStars = Math.floor(review.rating);
                var hasHalfStar = review.rating % 1 !== 0;
                var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
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

    function renderYourReview(yourReview, game_id, user_name, user_email){
        var html = '';
        if (yourReview != null){
            html += `
                <h4 class="mb-4">Edit a review</h4>
                <form method="post" action="php/yourreview.php">
                    <div class="d-flex my-3">
                        <p class="mb-0 mr-2">Your Rating * :</p>
                        <div class="text-primary">
                            <input type="hidden" id="rating" name="rating" value="${yourReview.rating}">
                            <i class="far fa-star" onclick="setRating(1)" id="star1"></i>
                            <i class="far fa-star" onclick="setRating(2)" id="star2"></i>
                            <i class="far fa-star" onclick="setRating(3)" id="star3"></i>
                            <i class="far fa-star" onclick="setRating(4)" id="star4"></i>
                            <i class="far fa-star" onclick="setRating(5)" id="star5"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="review">Your Review *</label>
                        <textarea id="review" name="review" cols="30" rows="5" class="form-control" value="${yourReview.review}" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="date">Your Review Date *</label>
                        <input type="date" class="form-control" id="date" name="date" value="${yourReview.tanggal}" required readonly>
                    </div>
                    <div class="form-group">
                        <label for="name">Your Name *</label>
                        <input type="text" class="form-control" id="name" name="name" value="${user_name}" required readonly>
                    </div>
                    <div class="form-group">
                        <label for="email">Your Email *</label>
                        <input type="email" class="form-control" id="email" name="email" value="${user_email}" required readonly>
                    </div>
                    <input type="hidden" name="id_review" value="${yourReview.id_review}">
                    <input type="hidden" name="edit" value="edit">
                    <div class="form-group mb-0">
                        <input type="submit" value="Edit Your Review" class="btn btn-primary px-3">
                    </div>
                </form>`;
        } else {
            html += `
                <h4 class="mb-4">Leave a review</h4>
                <form method="post" action="php/yourreview.php">
                    <div class="d-flex my-3">
                        <p class="mb-0 mr-2">Your Rating * :</p>
                        <div class="text-primary">
                            <input type="hidden" id="rating" name="rating" value="">
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
                        <input type="text" class="form-control" id="name" name="name" value="${user_name}" required readonly>
                    </div>
                    <div class="form-group">
                        <label for="email">Your Email *</label>
                        <input type="email" class="form-control" id="email" name="email" value="${user_email}" required readonly>
                    </div>
                    <input type="hidden" name="id_produk" value="${game_id}">
                    <input type="hidden" name="edit" value="edit">
                    <div class="form-group mb-0">
                        <input type="submit" value="Leave Your Review" class="btn btn-primary px-3">
                    </div>
                </form>`;
        }
        return html;
    }

    var html = '';
    html += `
        <div class="row px-xl-5">
            <div class="col-lg-5 mb-30">
                <div id="product-carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner bg-light">
                        <div class="carousel-item active">
                            <img class="w-100 h-100" src="${game.background_image}" alt="Image">
                        </div>
                        ${renderScreenShots(game.background_image_additional, game.short_screenshots)}
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
                        ${renderPlatforms(game.platforms)}
                    </div>
                    <div class="d-flex mb-4">
                        <strong class="text-dark mr-3">Added:</strong>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="beaten" name="beaten" disabled>
                            <label class="custom-control-label" for="beaten">${added.beaten} Beaten</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="dropped" name="dropped" disabled>
                            <label class="custom-control-label" for="dropped">${added.dropped} Dropped</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="owned" name="owned" disabled>
                            <label class="custom-control-label" for="owned">${added.owned} Owned</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="playing" name="playing" disabled>
                            <label class="custom-control-label" for="playing">${added.playing} Playing</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="toplay" name="toplay" disabled>
                            <label class="custom-control-label" for="toplay">${added.toplay} Toplay</label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" id="yet" name="yet" disabled>
                            <label class="custom-control-label" for="yet">${added.yet} Yet</label>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mb-4 pt-2">
                        ${renderButtons(orderStatus, wishStatus, cartStatus, game.id, file)}
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
                        <a class="nav-item nav-link text-dark" data-toggle="tab" href="#tab-pane-4">Your Review</a>
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
                                        <li class="list-group-item px-0">Developer: ${renderDevelopers(game.developers)}</li>
                                        <li class="list-group-item px-0">Publisher: ${renderPublishers(game.publishers)}</li>
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
                            ${renderReviews(reviews)}
                        </div>
                        <div class="tab-pane fade" id="tab-pane-4">
                            ${renderYourReview(data.yourreview, game.id, user_name, user_email)}
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
        var star = document.getElementById('star' + i);
        if (i <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    }
}

function loadSimilars(productId) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_one.php?id=" + productId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            renderSimilars(response.similarGames);
        }
    };
    xhr.send();
}

function renderSimilars(similars) {
    var productsContainer = document.querySelector('.shop-similar');
    productsContainer.innerHTML = "";
    var htmlContent = ``;
    if (similars.length > 0) {
        htmlContent += `<div class="owl-carousel related-carousel" id="carousel-container">`;
        similars.forEach(function(similar) {
            function generateRatingStars(rating) {
                let stars = '';
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 !== 0;
                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
                for (let i = 0; i < fullStars; i++) {
                    stars += '<small class="fa fa-star text-primary mr-1"></small>';
                }
                if (hasHalfStar) {
                    stars += '<small class="fa fa-star-half-alt text-primary mr-1"></small>';
                }
                for (let i = 0; i < emptyStars; i++) {
                    stars += '<small class="far fa-star text-primary mr-1"></small>';
                }
                return stars;
            }

            htmlContent += `
            <div class="product-item bg-light">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${similar.background_image}" alt="${similar.name}">
                    <div class="product-action">
                        <form method="post" action="php/cart.php">
                            <input type="hidden" name="id_produk" value="${similar.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="fa fa-shopping-cart"></i></a>
                        </form>
                        <form method="post" action="php/wish.php">
                            <input type="hidden" name="id_produk" value="${similar.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="far fa-heart"></i></a>
                        </form>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${similar.id}">${similar.name}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${similar.price}</h5>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        ${generateRatingStars(similar.rating)}
                        <small>(${similar.ratings_count})</small>
                    </div>
                </div>
            </div>`;
        });
        htmlContent += `</div>`;
    } else {
        htmlContent += `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">No similars found</span>
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
    var filename = getFilename();
    var productId = getProductIdFromUrl();
    if (productId) {
        loadProductDetails(productId, filename);
        loadSimilars(productId);
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
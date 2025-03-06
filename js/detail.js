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

function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    return productId;
}

function loadDetails(productId, file) {
    let productData = {};

    var endpoints = [
        `php/login_check.php?id=${productId}`,
        `php/produk_one.php?id=${productId}`,
        `php/produk_one_reviews.php?id=${productId}`,
        `php/yourreview.php?id=${productId}`,
        `php/wish.php?id=${productId}`,
        `php/cart.php?id=${productId}`,
        `php/order.php?id=${productId}`
    ];

    Promise.all(endpoints.map(endpoint => 
        fetch(endpoint)
            .then(response => {
                console.log(`Response from ${endpoint}:`, response);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(text => {
                console.log(`Raw data from ${endpoint}:`, text);
                return JSON.parse(text);
            })
    ))
    .then(dataArray => {
        productData = {
            ...productData,
            ...dataArray[0],
            ...dataArray[1],
            reviews: dataArray[2],
            yourreview: dataArray[3],
            wish_status: dataArray[4].wish_status,
            cart_status: dataArray[5].cart_status,
            order_status: dataArray[6].order_status
        };
        console.log(productData);
        renderProductDetails(productData, file);
        renderSimilars(productData.similarGames, file);
    })
    .catch(error => {
        console.error('Error in loadDetails:', error.message);
        console.error('Stack trace:', error.stack);
    });
}

function renderProductDetails(data, file) {
    var game = data.game;
    var added = game.added_by_status;
    var details = game.details;

    var reviews = data.reviews;
    var user_name = data.name_user;
    var user_email = data.email_user;
    var wishStatus = data.wish_status;
    var cartStatus = data.cart_status;
    var orderStatus = data.order_status;

    function renderScreenShots(image1, image2, screenshots) {
        let html = `<div class="carousel-item active"><img class="w-100 h-100" src="${image1}" alt="Image"></div>`;
        if (image2) {
            html += `<div class="carousel-item"><img class="w-100 h-100" src="${image2}" alt="Image"></div>`;
        }
        if (screenshots) {
            screenshots.forEach(screenshot => {
                if (screenshot.image !== image1 && screenshot.image !== image2) {
                    html += `<div class="carousel-item"><img class="w-100 h-100" src="${screenshot.image}" alt="Image"></div>`;
                }
            });
        }
        return html;
    }        
    
    function renderRatingStars(rating) {
        let html = '';
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 !== 0;
        var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
        html += '<small class="fa fa-star"></small>'.repeat(fullStars);
        if (hasHalfStar) html += '<small class="fa fa-star-half-alt"></small>';
        html += '<small class="far fa-star"></small>'.repeat(emptyStars);
    
        return html;
    }
    
    function renderGenres(genres) {
        return genres.map((genre, index) => index < genres.length - 1 ? `${genre.name}, ` : genre.name).join('');
    }
    
    function renderPlatforms(platforms) {
        return platforms.map((platform, index) => index < platforms.length - 1 ? `${platform.platform.name}, ` : platform.platform.name).join('');
    }
    
    function renderDevelopers(developers) {
        return developers.map((developer, index) => index < developers.length - 1 ? `${developer.name}, ` : developer.name).join('');
    }
    
    function renderPublishers(publishers) {
        return publishers.map((publisher, index) => index < publishers.length - 1 ? `${publisher.name}, ` : publisher.name).join('');
    }
    
    function renderAddedOptions(added) {
        return `
            ${Object.keys(added).map(key => `
                <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" class="custom-control-input" id="${key}" name="${key}" disabled>
                    <label class="custom-control-label" for="${key}">${added[key]} ${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                </div>
            `).join('')}
        `;
    }
    
    function renderButtons(order, wish, cart, id, file) {
        let html = '';
        var formHtml = (action, buttonClass, buttonText, name) => 
            `<form method="post" action="php/${action}.php?id_produk=${id}" class="mr-3">
                <input type="hidden" name="sourcePage" value="${file}?id=${id}" />
                <button class="btn btn-primary px-3" type="submit" name="${name}"><i class="${buttonClass}"></i>${buttonText}</button>
            </form>`;
    
        if (order) {
            html += '<form method="post" class="mr-3"><button class="btn btn-primary px-3" disabled>Sudah Anda Beli</button></form>';
        } else {
            html += wish ? formHtml('wish', 'far fa-heart mr-1', 'Delete From Wishlist', 'delete') 
                         : formHtml('wish', 'far fa-heart mr-1', 'Add To Wishlist', 'add');
            html += cart ? formHtml('cart', 'fa fa-shopping-cart mr-1', 'Delete From Cart', 'delete') 
                         : formHtml('cart', 'fa fa-shopping-cart mr-1', 'Add To Cart', 'add');
        }
        return html;
    }
    
    function renderReviews(reviews, gameName) {
        var getAvatar = (avatar, user) => avatar || (user && user.avatar) || 'img/user.jpg';
        var getAuthor = (author, user) => author || (user && user.username) || 'username';
        var getEdited = edited => edited ? '(edited)' : '';

        function formatDateTime(dateTime) {
            const date = new Date(dateTime);
            const options = { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            };
        
            return `${date.toLocaleDateString('en-GB', options)}`;
        }
    
        if (!reviews.length) return '<h4 class="mb-4">No reviews yet</h4>';
    
        return `<h4 class="mb-4">Review for "${gameName}"</h4>` + reviews.map(review => 
            `<div class="media mb-4">
                <img src="${getAvatar(review.external_avatar, review.user)}" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
                <div class="media-body">
                    <h6>${getAuthor(review.external_author, review.user)}<small> - <i>${formatDateTime(review.created)} ${getEdited(review.edited)}</i></small></h6>
                    <div class="text-primary mb-2">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(review.rating))}
                        ${review.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(5 - Math.floor(review.rating) - (review.rating % 1 ? 1 : 0))}
                    </div>
                    <p>${review.text}</p>
                </div>
            </div>`).join('');
    }    

    function renderYourReview(yourReview, game_id, user_name, user_email) {
        var displayHtml = (review, rating) => `
            <h4 class="mb-4">Your Existing Review</h4>
            <div class="d-flex my-3">
                <p class="mb-0 mr-2">Your Rating:</p>
                <div class="text-primary">
                    ${Array(5).fill(0).map((_, i) => `<i class="${i < rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
                </div>
            </div>
            <div class="form-group">
                <label for="existing-review">Your Review:</label>
                <textarea id="existing-review" cols="30" rows="5" class="form-control" readonly>${review}</textarea>
            </div>
        `;
    
        var formHtml = (action, name) => `
            <h4 class="mb-4">${action}</h4>
            <form method="post" action="php/yourreview.php">
                <div class="d-flex my-3">
                    <p class="mb-0 mr-2">Your Rating * :</p>
                    <div class="text-primary">
                        <input type="hidden" id="rating" name="rating" value="${yourReview ? yourReview.rating : ''}">
                        ${Array(5).fill(0).map((_, i) => `<i class="far fa-star" onclick="setRating(${i + 1})" id="star${i + 1}"></i>`).join('')}
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
                <input type="hidden" name="${yourReview ? 'id_review' : 'id_produk'}" value="${yourReview ? yourReview.id_review : game_id}">
                <input type="hidden" name="${name}" value="1">
                <div class="form-group mb-0">
                    <input type="submit" value="${action}" class="btn btn-primary px-3">
                </div>
            </form>
        `;
    
        var html = yourReview ? displayHtml(yourReview.review, yourReview.rating) + formHtml('Edit Your Review', 'edit') : formHtml('Leave a Review', 'add');
        return html;
    }            

    var generateGameHTML = (game, added, reviews, orderStatus, wishStatus, cartStatus, file, user_name, user_email) => `
        <div class="row px-xl-5">
            <div class="col-lg-5 mb-30">
                <div id="product-carousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner bg-light">
                        ${renderScreenShots(game.background_image, details.background_image_additional, game.short_screenshots)}
                    </div>
                    <a class="carousel-control-prev" href="#product-carousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#product-carousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
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
                        ${renderAddedOptions(added)}
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
                            <p>${details.description}</p>
                        </div>
                        <div class="tab-pane fade" id="tab-pane-2">
                            <h4 class="mb-3">Additional Information</h4>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item px-0">Developer: ${renderDevelopers(details.developers)}</li>
                                        <li class="list-group-item px-0">Publisher: ${renderPublishers(details.publishers)}</li>
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
                            ${renderReviews(reviews, game.name)}
                        </div>
                        <div class="tab-pane fade" id="tab-pane-4">
                            ${renderYourReview(data.yourreview, game.id, user_name, user_email)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('.shop-detail').html(generateGameHTML(game, added, reviews, orderStatus, wishStatus, cartStatus, file, user_name, user_email));
}

function setRating(rating) {
    document.getElementById('rating').value = rating;

    for (let i = 1; i <= 5; i++) {
        let star = document.getElementById('star' + i);
        star.classList.toggle('fas', i <= rating);
        star.classList.toggle('far', i > rating);
    }
}

function renderSimilars(similars, file) {
    var productsContainer = document.querySelector('.shop-similar');

    function renderRatingStars(rating) {
        let stars = '';
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 !== 0;
        var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
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

    function renderSimilarProductsHTML(similars) {
        let htmlContent = `<div class="owl-carousel related-carousel" id="carousel-container">`;
        similars.forEach(similar => {
            htmlContent += `
                <div class="product-item bg-light">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" src="${similar.background_image}" alt="${similar.name}">
                        <div class="product-action">
                            <form id="wishForm${similar.id}" method="post" action="php/wish.php?id_produk=${similar.id}">
                                <input type="hidden" name="sourcePage" value="${file}?id=${similar.id}">
                                <input type="hidden" name="add" value="true">
                                <a class="btn btn-outline-dark btn-square" href="#" onclick="document.getElementById('wishForm${similar.id}').submit();">
                                    <i class="far fa-heart"></i>
                                </a>
                            </form>
                            <form id="cartForm${similar.id}" method="post" action="php/cart.php?id_produk=${similar.id}">
                                <input type="hidden" name="sourcePage" value="${file}?id=${similar.id}">
                                <input type="hidden" name="add" value="true">
                                <a class="btn btn-outline-dark btn-square" href="#" onclick="document.getElementById('cartForm${similar.id}').submit();">
                                    <i class="fa fa-shopping-cart"></i>
                                </a>
                            </form>
                        </div>
                    </div>
                    <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${similar.id}">${similar.name}</a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                            <h5>Rp ${similar.price}</h5>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            ${renderRatingStars(similar.rating)}
                            <small>(${similar.ratings_count})</small>
                        </div>
                    </div>
                </div>`;
        });
        htmlContent += `</div>`;
        return htmlContent;
    }
    
    function renderNoSimilarsFoundHTML() {
        return `
            <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
                <span class="bg-secondary pr-3">No similars found</span>
            </h2>`;
    }

    productsContainer.innerHTML = similars.length > 0 ? renderSimilarProductsHTML(similars) : renderNoSimilarsFoundHTML();
    initializeOwlCarousel();
}

function initializeOwlCarousel() {
    $('#carousel-container').owlCarousel({
        loop: true,
        autoplay: true
    });
}

$(document).ready(function() {
    var filename = getFilename();
    var productId = getProductIdFromUrl();
    if (productId) {
        loadDetails(productId, filename);
    } else {
        console.error('Product ID not found in URL.');
    }
});


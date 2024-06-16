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
function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    return productId;
}

// Function to render product details
function renderProductDetails() {
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
    var productId = getProductIdFromUrl();
    if (productId) {
        // Fetch product details from PHP script
        $.ajax({
            url: 'php/detail.php?id=' + productId + '&filename=' + filename,
            type: 'GET',
            success: function(data) {
                // Insert product details into the HTML
                $('.shop-detail').html(data);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } else {
        console.error('Product ID not found in URL.');
    }
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
                    <img class="img-fluid w-100" src="img/${product.file_produk}" alt="">
                    <div class="product-action">
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id_produk}">${product.nama_produk}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${product.harga_produk}</h5>
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

// Call renderProductDetails function
$(document).ready(function() {
    renderProductDetails();
    loadRecommendations();
});

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
// Function to get product ID from URL parameters
function getProductIdFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    return productId;
}

// Function to render product details
function renderProductDetails() {
    var productId = getProductIdFromUrl();
    if (productId) {
        // Fetch product details from PHP script
        $.ajax({
            url: 'php/detail.php?id=' + productId,
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
    if (recommendations.length > 0) {
        var htmlContent = `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">You May Also Liked</span></h2>
        <div class="row px-xl-5">
            <div class="col">
                <div class="owl-carousel related-carousel">`;
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
                            <a class="h6 text-decoration-none text-truncate" href="">${product.nama_produk}</a>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                <h5>$${product.harga_produk}</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
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
                    </div>`;
                });
                htmlContent += `
                </div>
            </div>
        </div>`;
        productsContainer.innerHTML = htmlContent;
    } else {
        console.error("No recommendations found.");
    }
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
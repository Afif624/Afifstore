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

// Call renderProductDetails function
$(document).ready(function() {
    renderProductDetails();
});

function setRating(rating) {
    document.getElementById('rating').value = rating;
    var stars = document.querySelectorAll('.fa-star');
    for (var i = 0; i < stars.length; i++) {
        if (i < rating) {
            stars[i].classList.add('fas');
            stars[i].classList.remove('far');
        } else {
            stars[i].classList.add('far');
            stars[i].classList.remove('fas');
        }
    }
}

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
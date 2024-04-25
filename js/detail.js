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
        $.ajax({
            url: 'php/serupa.php?id=' + productId,
            type: 'GET',
            success: function(data) {
                // Insert product details into the HTML
                $('.related-carousel').html(data);
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

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
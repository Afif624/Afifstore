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

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
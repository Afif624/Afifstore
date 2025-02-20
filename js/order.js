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

function loadOrder() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/order.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var order = JSON.parse(xhr.responseText);
            renderOrder(order);
        }
    };
    xhr.send();
}

function renderOrder(groupedData) {
    var productsContainer = document.querySelector('.checkout-order');
    productsContainer.innerHTML = "";
    var htmlContent = ``;
    if (Object.keys(groupedData).length > 0) {
        let numberOrder = 1;
        Object.keys(groupedData).forEach(function(waktu) {
            var group = groupedData[waktu];
            htmlContent += `
            <div class="col-lg-4">
                <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Order Total ${numberOrder}</span></h5>
                <div class="bg-light p-30 mb-5">
                    <div class="border-bottom">
                        <h6 class="mb-3">Products</h6>`;
                        let total_harga = 0;
                        group.forEach(function(product) {
                            htmlContent += `
                            <div class="d-flex justify-content-between">
                                <p>${product.nama_produk}</p>
                                <p>Rp ${product.harga_produk}</p>
                            </div>`;
                            total_harga += parseFloat(product.harga_produk);
                        });
                        htmlContent += `
                    </div>
                    <div class="border-bottom pt-3 pb-2">
                        <div class="d-flex justify-content-between mb-3">
                            <h6>Subtotal</h6>
                            <h6>Rp ${total_harga}</h6>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 class="font-weight-medium">Shipping</h6>
                            <h6 class="font-weight-medium">Rp 1000</h6>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Total</h5>
                            <h5>Rp ${total_harga + 1000}</h5>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Payment</h5>
                            <h5>${group[0].payment}</h5>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Datetime</h5>
                            <h5>${group[0].waktu}</h5>
                        </div>
                    </div>
                </div>
            </div>`;
            numberOrder ++;
        });
    } else {
        htmlContent += `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">Masih Kosong</span>
        </h2>`;
    }
    productsContainer.innerHTML = htmlContent;
}

// Call renderProductDetails function
$(document).ready(function() {
    loadOrder();
});

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
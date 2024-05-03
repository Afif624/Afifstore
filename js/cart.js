function loadCart() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/daftar_cart.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var cart = JSON.parse(xhr.responseText);
            renderCart(cart);
        }
    };
    xhr.send();
}

function renderCart(cart) {
    var productsContainer = document.querySelector('.cartshop');
    productsContainer.innerHTML = "";
    if (cart.length > 0) {
        var htmlContent = `
        <div class="row px-xl-5">
            <div class="col-lg-8 table-responsive mb-5">
                <table class="table table-light table-borderless table-hover text-center mb-0">
                    <thead class="thead-dark">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Developer</th>
                            <th>Publisher</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody class="align-middle">`;
                    let totalPrice = 0;
                    cart.forEach(function(product) {
                        htmlContent += `
                        <tr>
                            <td class="align-middle"><img src="img/${product.file_produk}" alt="" style="width: 50px;"></td>
                            <td class="align-middle">${product.nama_produk}</td>
                            <td class="align-middle">$${product.harga_produk}</td>
                            <td class="align-middle">$${product.dev_produk}</td>
                            <td class="align-middle">$${product.publ_produk}</td>
                            <td class="align-middle">
                                <form action="php/form_cart.php?id_produk=${product.id_produk}" method="POST">
                                    <button class="btn btn-sm btn-danger" type="submit" name="delete">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </form
                            </td>
                        </tr>`;
                        totalPrice += parseFloat(product.harga_produk);
                    });
                    htmlContent += `
                    </tbody>
                </table>
            </div>
            <div class="col-lg-4">
                <form class="mb-30" action="">
                    <div class="input-group">
                        <input type="text" class="form-control border-0 p-4" placeholder="Coupon Code">
                        <div class="input-group-append">
                            <button class="btn btn-primary">Apply Coupon</button>
                        </div>
                    </div>
                </form>
                <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Cart Summary</span></h5>
                <div class="bg-light p-30 mb-5">
                    <div class="border-bottom pb-2">
                        <div class="d-flex justify-content-between mb-3">
                            <h6>Subtotal</h6>
                            <h6>$${totalPrice}</h6>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 class="font-weight-medium">Tax</h6>
                            <h6 class="font-weight-medium">$10</h6>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Total</h5>
                            <h5>$${totalPrice+10}</h5>
                        </div>
                    </div>
                </div>
                <div class="mb-5">
                    <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Payment</span></h5>
                    <form class="bg-light p-30" action="php/form_cart.php" method="POST">
                        <div class="form-group">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="paypal">
                                <label class="custom-control-label" for="paypal">Paypal</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="directcheck">
                                <label class="custom-control-label" for="directcheck">Direct Check</label>
                            </div>
                        </div>
                        <div class="form-group mb-4">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="banktransfer">
                                <label class="custom-control-label" for="banktransfer">Bank Transfer</label>
                            </div>
                        </div>
                        <button class="btn btn-block btn-primary font-weight-bold py-3" type="submit" name="order">Place Order</button>
                    </form>
                </div>
            </div>
        </div>`;
        productsContainer.innerHTML = htmlContent;
    } else {
        console.error("No cart found.");
    }
}

// Call renderProductDetails function
$(document).ready(function() {
    loadCart();
});

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
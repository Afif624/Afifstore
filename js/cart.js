function fetchAndRenderCart() {
    $.ajax({
        type: "GET",
        url: "php/cart.php",
        dataType: "json",
        success: function(response) {
            let cartDetails = [];
            let pendingRequests = response.cart_detail.length;

            response.cart_detail.forEach(function(productId) {
                getProductDetails(productId, function(productDetail) {
                    cartDetails.push(productDetail.game);
                    pendingRequests--;

                    if (pendingRequests === 0) {
                        console.log(cartDetails);
                        renderCartDetails(cartDetails);
                    }
                });
            });
        }
    });
}

function getProductDetails(productId, callback) {
    $.ajax({
        type: "GET",
        url: `php/produk_one.php?id=${productId}&list=1`,
        dataType: "json",
        success: function(response) {
            callback(response);
        }
    });
}

function renderCartDetails(cartDetails) {
    function renderDetails(details) {
        return details.map(detail => detail.name).join(', ');
    }
    
    function renderFilename() {
        var segments = window.location.pathname.split('/').filter(segment => segment.length > 0);
        return segments[segments.length - 1];
    }

    var html = cartDetails.length ? `
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
                    <tbody class="align-middle">
    ` : `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">Masih Kosong</span>
        </h2>
    `;

    let totalPrice = 0;

    cartDetails.forEach(cart => {
        html += `
                        <tr>
                            <td class="align-middle"><img src="${cart.background_image}" alt="" style="width: 50px;"></td>
                            <td class="align-middle">${cart.name}</td>
                            <td class="align-middle">Rp ${cart.price}</td>
                            <td class="align-middle">${renderDetails(cart.details.developers)}</td>
                            <td class="align-middle">${renderDetails(cart.details.publishers)}</td>
                            <td class="align-middle">
                                <form action="php/cart.php?id_produk=${cart.id}" method="POST">
                                    <input type="hidden" name="sourcePage" value="${renderFilename()}" />
                                    <button class="btn btn-sm btn-danger" type="submit" name="delete">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
        `;
        totalPrice += parseFloat(cart.price);
    });

    html += cartDetails.length ? `
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
                <h5 class="section-title position-relative text-uppercase mb-3">
                    <span class="bg-secondary pr-3">Cart Summary</span>
                </h5>
                <div class="bg-light p-30 mb-5">
                    <div class="border-bottom pb-2">
                        <div class="d-flex justify-content-between mb-3">
                            <h6>Subtotal</h6>
                            <h6>Rp ${totalPrice}</h6>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 class="font-weight-medium">Tax</h6>
                            <h6 class="font-weight-medium">Rp 1000</h6>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Total</h5>
                            <h5>Rp ${totalPrice + 1000}</h5>
                        </div>
                    </div>
                </div>
                <div class="mb-5">
                    <h5 class="section-title position-relative text-uppercase mb-3">
                        <span class="bg-secondary pr-3">Payment</span>
                    </h5>
                    <form class="bg-light p-30" action="php/cart.php" method="POST">
                        <div class="form-group">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="paypal" value="Paypal" checked>
                                <label class="custom-control-label" for="paypal">Paypal</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="directcheck" value="Direct Check">
                                <label class="custom-control-label" for="directcheck">Direct Check</label>
                            </div>
                        </div>
                        <div class="form-group mb-4">
                            <div class="custom-control custom-radio">
                                <input type="radio" class="custom-control-input" name="payment" id="banktransfer" value="Bank Transfer">
                                <label class="custom-control-label" for="banktransfer">Bank Transfer</label>
                            </div>
                        </div>
                        <button class="btn btn-block btn-primary font-weight-bold py-3" type="submit" name="order">Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    ` : '';

    document.querySelector('.cartshop').innerHTML = html;
}

$(document).ready(function() {
    fetchAndRenderCart();
});

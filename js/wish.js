function fetchAndRenderWish() {
    $.ajax({
        type: "GET",
        url: "php/wish.php",
        dataType: "json",
        success: function(response) {
            let wishDetails = [];
            let pendingRequests = response.wish_detail.length;

            response.wish_detail.forEach(function(productId) {
                getProductDetails(productId, function(productDetail) {
                    wishDetails.push(productDetail.game);
                    pendingRequests--;

                    if (pendingRequests === 0) {
                        console.log(wishDetails);
                        renderWishDetails(wishDetails);
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

function renderWishDetails(wishDetails) {
    function renderDetails(details) {
        return details.map(detail => detail.name).join(', ');
    }
    
    function renderFilename() {
        var segments = window.location.pathname.split('/').filter(segment => segment.length > 0);
        return segments[segments.length - 1];
    }

    var html = wishDetails.length ? `
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
                            <th>Placed</th>
                        </tr>
                    </thead>
                    <tbody class="align-middle">
    ` : `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">Masih Kosong</span>
        </h2>
    `;

    let totalPrice = 0;

    wishDetails.forEach(wish => {
        html += `
                        <tr>
                            <td class="align-middle"><img src="${wish.background_image}" alt="" style="width: 50px;"></td>
                            <td class="align-middle">${wish.name}</td>
                            <td class="align-middle">Rp ${wish.price}</td>
                            <td class="align-middle">${renderDetails(wish.details.developers)}</td>
                            <td class="align-middle">${renderDetails(wish.details.publishers)}</td>
                            <td class="align-middle">
                                <form action="php/wish.php?id_produk=${wish.id}" method="POST">
                                    <input type="hidden" name="sourcePage" value="${renderFilename()}" />
                                    <button class="btn btn-sm btn-danger" type="submit" name="delete">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </form
                            </td>
                            <td class="align-middle">
                                <form action="php/wish.php?id_produk=${wish.id}" method="POST">
                                    <input type="hidden" name="sourcePage" value="${renderFilename()}" />
                                    <button class="btn btn-sm btn-danger" type="submit" name="cart">
                                        <i class="fa fa-check"></i>
                                    </button>
                                </form
                            </td>
                        </tr>
        `;
        totalPrice += parseFloat(wish.price);
    });

    html += wishDetails.length ? `
                    </tbody>
                </table>
            </div>
        </div>
    ` : '';

    document.querySelector('.wishlist').innerHTML = html;
}

$(document).ready(function() {
    fetchAndRenderWish();
});

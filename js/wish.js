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

function loadWish() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/wish_list.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var wish = JSON.parse(xhr.responseText);
            renderWish(wish);
        }
    };
    xhr.send();
}

function renderWish(wish) {
    var productsContainer = document.querySelector('.wishlist');
    productsContainer.innerHTML = "";
    var htmlContent = ``;
    if (wish.length > 0) {
        htmlContent += `
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
                    <tbody class="align-middle">`;
                    let totalPrice = 0;
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
                    wish.forEach(function(product) {
                        htmlContent += `
                        <tr>
                            <td class="align-middle"><img src="img/${product.file_produk}" alt="" style="width: 50px;"></td>
                            <td class="align-middle">${product.nama_produk}</td>
                            <td class="align-middle">Rp ${product.harga_produk}</td>
                            <td class="align-middle">${product.dev_produk}</td>
                            <td class="align-middle">${product.publ_produk}</td>
                            <td class="align-middle">
                                <form action="php/wish_form.php?id_produk=${product.id_produk}" method="POST">
                                    <input type="hidden" name="sourcePage" value="${filename}" />
                                    <button class="btn btn-sm btn-danger" type="submit" name="delete">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </form
                            </td>
                            <td class="align-middle">
                                <form action="php/wish_form.php?id_produk=${product.id_produk}" method="POST">
                                    <input type="hidden" name="sourcePage" value="${filename}" />
                                    <button class="btn btn-sm btn-danger" type="submit" name="add">
                                        <i class="fa fa-check"></i>
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
        </div>`;
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
    loadWish();
});

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
function getProductDetails(productId) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "php/produk_one.php?id=" + productId + "&list=1", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var productDetail = JSON.parse(xhr.responseText);
                    resolve(productDetail);
                } else {
                    reject(xhr.status);
                }
            }
        };
        xhr.send();
    });
}

function loadOrder() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/order.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var order = JSON.parse(xhr.responseText);
            console.log(order);
            renderOrder(order);
        }
    };
    xhr.send();
}

async function renderOrder(groupedData) {
    var productsContainer = document.querySelector('.checkout-order');
    productsContainer.innerHTML = "";
    var html = ``;
    if (Object.keys(groupedData).length > 0) {
        let numberOrder = 1;
        for (const waktu of Object.keys(groupedData)) {
            var group = groupedData[waktu];
            let total_harga = 0;
            html += `
            <div class="col-lg-4">
                <h5 class="section-title position-relative text-uppercase mb-3"><span class="bg-secondary pr-3">Order Total ${numberOrder}</span></h5>
                <div class="bg-light p-30 mb-5">
                    <div class="border-bottom">
                        <h6 class="mb-3">Products</h6>`;
            for (const product of group) {
                try {
                    const productDetail = await getProductDetails(product.id_produk);
                    const game = productDetail.game;
                    html += `
                        <div class="d-flex justify-content-between">
                            <p>${game.name}</p>
                            <p>Rp ${game.price}</p>
                        </div>`;
                    total_harga += parseFloat(game.price);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }
            html += `
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
            numberOrder++;
        }
    } else {
        html += `
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4">
            <span class="bg-secondary pr-3">Masih Kosong</span>
        </h2>`;
    }
    productsContainer.innerHTML = html;
}

// Call renderProductDetails function
$(document).ready(function() {
    loadOrder();
});


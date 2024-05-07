function loadOrder() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/daftar_checkout.php", true);
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
                                <p>$${product.harga_produk}</p>
                            </div>`;
                            total_harga += parseFloat(product.harga_produk);
                        });
                        htmlContent += `
                    </div>
                    <div class="border-bottom pt-3 pb-2">
                        <div class="d-flex justify-content-between mb-3">
                            <h6>Subtotal</h6>
                            <h6>$${total_harga.toFixed(2)}</h6>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 class="font-weight-medium">Shipping</h6>
                            <h6 class="font-weight-medium">$10</h6>
                        </div>
                    </div>
                    <div class="pt-2">
                        <div class="d-flex justify-content-between mt-2">
                            <h5>Total</h5>
                            <h5>$${(total_harga + 10).toFixed(2)}</h5>
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
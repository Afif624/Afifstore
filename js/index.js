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

var currentRecomPage = 1;
var recomProductsPerPage = 8;
var recomProductsData = [];

var currentRecentPage = 1;
var recentProductsPerPage = 8;
var recentProductsData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadPlatformGenre();
    loadProductRecomData();
    loadProductRecentData();
});

function loadPlatformGenre() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/platform_&_genre.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        populatePlatform(response.platform);
        populateGenre(response.genre);
    }
    };
    xhr.send();
}

function populatePlatform(platforms) {
    var rowPlatform = document.getElementById("rowPlatform");
    rowPlatform.innerHTML = "";
    platforms.forEach(function(platform) {
        var platformDiv = document.createElement("div");
        platformDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        platformDiv.innerHTML = `
        <a class="text-decoration-none" href="">
            <div class="cat-item d-flex align-items-center mb-4">
                <div class="overflow-hidden" style="width: 100px; height: 100px;">
                    <img class="img-fluid" src="${platform.image}" alt="">
                </div>
                <div class="flex-fill pl-3">
                    <h6>${platform.name}</h6>
                    <small class="text-body">${platform.games_count} Produk</small>
                </div>
            </div>
        </a>
        `;
        rowPlatform.appendChild(platformDiv);
    });
}

function populateGenre(genres) {
    var rowGenre = document.getElementById("rowGenre");
    rowGenre.innerHTML = "";
    genres.forEach(function(genre) {
        var genreDiv = document.createElement("div");
        genreDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        genreDiv.innerHTML = `
        <a class="text-decoration-none" href="">
            <div class="cat-item d-flex align-items-center mb-4">
                <div class="overflow-hidden" style="width: 100px; height: 100px;">
                    <img class="img-fluid" src="${genre.image}" alt="">
                </div>
                <div class="flex-fill pl-3">
                    <h6>${genre.name}</h6>
                    <small class="text-body">${genre.games_count} Produk</small>
                </div>
            </div>
        </a>
        `;
        rowGenre.appendChild(genreDiv);
    });
}

function loadProductRecomData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_list.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response.terekomendasi);
        recomProductsData = response.terekomendasi;
        renderProductsRecom(currentRecomPage);
        renderPaginationRecom();
    }
    };
    xhr.send();
}

function renderProductsRecom(page) {
    var startIndex = (page - 1) * recomProductsPerPage;
    var endIndex = startIndex + recomProductsPerPage;
    var slicedData = recomProductsData.slice(startIndex, endIndex);

    var rowProduk = document.getElementById("rowProdukRekom");
    rowProduk.innerHTML = "";
    slicedData.forEach(function(product) {
        function getOrSetRandomPrice(id, min, max) {
            var hargaKey = `harga_${id}`;
            var harga = localStorage.getItem(hargaKey);
        
            if (!harga) {
                harga = Math.floor(Math.random() * (max - min + 1)) + min;
                localStorage.setItem(hargaKey, harga);
            }
            return parseInt(harga, 10);
        }

        function generateRatingStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
            for (let i = 0; i < fullStars; i++) {
                stars += '<small class="fa fa-star text-primary mr-1"></small>';
            }
            if (hasHalfStar) {
                stars += '<small class="fa fa-star-half-alt text-primary mr-1"></small>';
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += '<small class="far fa-star text-primary mr-1"></small>';
            }
            return stars;
        }
        
        var harga = getOrSetRandomPrice(product.id, 100000, 1000000);
        var ratingStars = generateRatingStars(product.rating);
        
        var productDiv = document.createElement("div");
        productDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        productDiv.innerHTML = `
            <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${product.background_image}" alt="${product.name}">
                    <div class="product-action">
                        <form method="post" action="php/cart.php">
                            <input type="hidden" name="id_produk" value="${product.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="fa fa-shopping-cart"></i></a>
                        </form>
                        <form method="post" action="php/wish.php">
                            <input type="hidden" name="id_produk" value="${product.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="far fa-heart"></i></a>
                        </form>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none product-name" href="detail.html?id=${product.id}">${product.name}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${harga}</h5>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        ${ratingStars}
                        <small>(${product.ratings_count})</small>
                    </div>
                </div>
            </div>
        `;
        rowProduk.appendChild(productDiv);
    });
}

function renderPaginationRecom() {
    var totalPages = Math.ceil(recomProductsData.length / recomProductsPerPage);
    var pagination = document.getElementById("pagination-rekom");
    pagination.innerHTML = "";

    var liPrevious = document.createElement("li");
    liPrevious.className = "page-item";
    var aPrevious = document.createElement("a");
    aPrevious.className = "page-link";
    aPrevious.setAttribute("href", "#");
    aPrevious.innerText = "Previous";
    aPrevious.addEventListener("click", function(event) {
        event.preventDefault();
        if (currentRecomPage > 1) {
            currentRecomPage--;
            renderProductsRecom(currentRecomPage);
            updatePaginationRecomState();
        }
    });
    liPrevious.appendChild(aPrevious);
    pagination.appendChild(liPrevious);

    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement("li");
        li.className = "page-item";
        var a = document.createElement("a");
        a.className = "page-link recom";
        a.innerText = i;
        a.setAttribute("href", "#");
        a.addEventListener("click", function(event) {
            event.preventDefault();
            currentRecomPage = parseInt(this.innerText);
            renderProductsRecom(currentRecomPage);
            updatePaginationRecomState();
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }

    var liNext = document.createElement("li");
    liNext.className = "page-item";
    var aNext = document.createElement("a");
    aNext.className = "page-link";
    aNext.setAttribute("href", "#");
    aNext.innerText = "Next";
    aNext.addEventListener("click", function(event) {
        event.preventDefault();
        if (currentRecomPage < totalPages) {
            currentRecomPage++;
            renderProductsRecom(currentRecomPage);
            updatePaginationRecomState();
        }
    });
    liNext.appendChild(aNext);
    pagination.appendChild(liNext);

    updatePaginationRecomState();
}

function updatePaginationRecomState() {
    var pageLinks = document.querySelectorAll(".recom");
    pageLinks.forEach(function(link) {
        if (parseInt(link.innerText) === currentRecomPage) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }
    });
}

function loadProductRecentData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_list.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response.terbaru);
        recentProductsData = response.terbaru;
        renderProductsRecent(currentRecentPage);
        renderPaginationRecent();
    }
    };
    xhr.send();
}

function renderProductsRecent(page) {
    var startIndex = (page - 1) * recentProductsPerPage;
    var endIndex = startIndex + recentProductsPerPage;
    var slicedData = recentProductsData.slice(startIndex, endIndex);

    var rowProduk = document.getElementById("rowProdukBaru");
    rowProduk.innerHTML = "";
    slicedData.forEach(function(product) {
        function getOrSetRandomPrice(id, min, max) {
            var hargaKey = `harga_${id}`;
            var harga = localStorage.getItem(hargaKey);
        
            if (!harga) {
                harga = Math.floor(Math.random() * (max - min + 1)) + min;
                localStorage.setItem(hargaKey, harga);
            }
            return parseInt(harga, 10);
        }

        function generateRatingStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
            for (let i = 0; i < fullStars; i++) {
                stars += '<small class="fa fa-star text-primary mr-1"></small>';
            }
            if (hasHalfStar) {
                stars += '<small class="fa fa-star-half-alt text-primary mr-1"></small>';
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += '<small class="far fa-star text-primary mr-1"></small>';
            }
            return stars;
        }
        
        var harga = getOrSetRandomPrice(product.id, 100000, 1000000);
        var ratingStars = generateRatingStars(product.rating);
        
        var productDiv = document.createElement("div");
        productDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        productDiv.innerHTML = `
            <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${product.background_image}" alt="${product.name}">
                    <div class="product-action">
                        <form method="post" action="php/cart.php">
                            <input type="hidden" name="id_produk" value="${product.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="fa fa-shopping-cart"></i></a>
                        </form>
                        <form method="post" action="php/wish.php">
                            <input type="hidden" name="id_produk" value="${product.id}">
                            <a class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="far fa-heart"></i></a>
                        </form>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none product-name" href="detail.html?id=${product.id}">${product.name}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${harga}</h5>
                    </div>
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        ${ratingStars}
                        <small>(${product.ratings_count})</small>
                    </div>
                </div>
            </div>
        `;
        rowProduk.appendChild(productDiv);
    });
}

function renderPaginationRecent() {
    var totalPages = Math.ceil(recentProductsData.length / recentProductsPerPage);
    var pagination = document.getElementById("pagination-recent");
    pagination.innerHTML = "";

    var liPrevious = document.createElement("li");
    liPrevious.className = "page-item";
    var aPrevious = document.createElement("a");
    aPrevious.className = "page-link";
    aPrevious.setAttribute("href", "#");
    aPrevious.innerText = "Previous";
    aPrevious.addEventListener("click", function(event) {
        event.preventDefault();
        if (currentRecentPage > 1) {
            currentRecentPage--;
            renderProductsRecent(currentRecentPage);
            updatePaginationRecentState();
        }
    });
    liPrevious.appendChild(aPrevious);
    pagination.appendChild(liPrevious);

    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement("li");
        li.className = "page-item";
        var a = document.createElement("a");
        a.className = "page-link recent";
        a.innerText = i;
        a.setAttribute("href", "#");
        a.addEventListener("click", function(event) {
            event.preventDefault();
            currentRecentPage = parseInt(this.innerText);
            renderProductsRecent(currentRecentPage);
            updatePaginationRecentState();
        });
        li.appendChild(a);
        pagination.appendChild(li);
    }

    var liNext = document.createElement("li");
    liNext.className = "page-item";
    var aNext = document.createElement("a");
    aNext.className = "page-link";
    aNext.setAttribute("href", "#");
    aNext.innerText = "Next";
    aNext.addEventListener("click", function(event) {
        event.preventDefault();
        if (currentRecentPage < totalPages) {
            currentRecentPage++;
            renderProductsRecent(currentRecentPage);
            updatePaginationRecentState();
        }
    });
    liNext.appendChild(aNext);
    pagination.appendChild(liNext);

    updatePaginationRecentState();
}

function updatePaginationRecentState() {
    var pageLinks = document.querySelectorAll(".recent");
    pageLinks.forEach(function(link) {
        if (parseInt(link.innerText) === currentRecentPage) {
            link.parentElement.classList.add("active");
        } else {
            link.parentElement.classList.remove("active");
        }
    });
}

fetch('topbar.html').then(response => response.text()).then(html => {
    document.getElementById('topbar').innerHTML = html;
});

fetch('footer.html').then(response => response.text()).then(html => {
    document.getElementById('footer').innerHTML = html;
});
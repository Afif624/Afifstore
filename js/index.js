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

var currentRecomPage = 1;
var recomProductsPerPage = 8;
var recomProductsData = [];

var currentRecentPage = 1;
var recentProductsPerPage = 8;
var recentProductsData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadKategoriData();
    loadGenreData();
    loadProductRecomData();
    loadProductRecentData();
});

function loadKategoriData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/kategori.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        populateKategoris(response);
    }
    };
    xhr.send();
}

function populateKategoris(kategoris) {
    var rowKategori = document.getElementById("rowKategori");
    rowKategori.innerHTML = "";
    kategoris.forEach(function(kategori) {
        var kategoriDiv = document.createElement("div");
        kategoriDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        kategoriDiv.innerHTML = `
        <a class="text-decoration-none" href="">
            <div class="cat-item d-flex align-items-center mb-4">
                <div class="flex-fill pl-3">
                    <h6>${kategori.nama_kategori}</h6>
                    <small class="text-body">${kategori.jumlah_produk} Produk</small>
                </div>
            </div>
        </a>
        `;
        rowKategori.appendChild(kategoriDiv);
    });
}

function loadGenreData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/genre.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        populateGenres(response);
    }
    };
    xhr.send();
}

function populateGenres(genres) {
    var rowGenre = document.getElementById("rowGenre");
    rowGenre.innerHTML = "";
    genres.forEach(function(genre) {
        var genreDiv = document.createElement("div");
        genreDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        genreDiv.innerHTML = `
        <a class="text-decoration-none" href="">
            <div class="cat-item d-flex align-items-center mb-4">
                <div class="flex-fill pl-3">
                    <h6>${genre.nama_genre}</h6>
                    <small class="text-body">${genre.jumlah_produk} Produk</small>
                </div>
            </div>
        </a>
        `;
        rowGenre.appendChild(genreDiv);
    });
}

function loadProductRecomData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/rekomendasi.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        recomProductsData = JSON.parse(xhr.responseText);
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
    var productDiv = document.createElement("div");
    productDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
    productDiv.innerHTML = `
    <div class="product-item bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid w-100" src="img/${product.file_produk}" alt="${product.nama_produk}">
            <div class="product-action">
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
            </div>
        </div>
        <div class="text-center py-4">
            <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id_produk}">${product.nama_produk}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>Rp ${product.harga_produk}</h5>
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
    xhr.open("GET", "php/terbaru.php", true);
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        recentProductsData = JSON.parse(xhr.responseText);
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
    var productDiv = document.createElement("div");
    productDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
    productDiv.innerHTML = `
    <div class="product-item bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid w-100" src="img/${product.file_produk}" alt="${product.nama_produk}">
            <div class="product-action">
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
            </div>
        </div>
        <div class="text-center py-4">
            <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id_produk}">${product.nama_produk}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>Rp ${product.harga_produk}</h5>
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
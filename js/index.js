var currentRecomPage = 1;
var recomProductsPerPage = 8;
var recomProductsData = [];

var currentRecentPage = 1;
var recentProductsPerPage = 8;
var recentProductsData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadGenreData();
    loadProductRecomData();
    loadProductRecentData();
});

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
            <a class="h6 text-decoration-none text-truncate" href="">${product.nama_produk}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>$${product.harga_produk}</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
            </div>
            <div class="d-flex align-items-center justify-content-center mb-1">
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small>(99)</small>
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
            <a class="h6 text-decoration-none text-truncate" href="">${product.nama_produk}</a>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5>$${product.harga_produk}</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
            </div>
            <div class="d-flex align-items-center justify-content-center mb-1">
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small class="fa fa-star text-primary mr-1"></small>
                <small>(99)</small>
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
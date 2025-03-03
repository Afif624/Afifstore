var productsPerPage = 8;
var currentRecomPage = 1;
var currentRecentPage = 1;
var recomProductsData = [];
var recentProductsData = [];

function loadPlatformsAndGenres() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/platform_&_genre.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            renderPlatformsAndGenres(response.platform, response.genre);
        }
    };
    xhr.send();
}

function renderPlatformsAndGenres(platforms, genres) {
    var rowPlatform = document.getElementById("rowPlatform");
    var rowGenre = document.getElementById("rowGenre");

    function renderCategoryDiv(category) {
        var categoryDiv = document.createElement("div");
        categoryDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        categoryDiv.innerHTML = `
            <a class="text-decoration-none" href="">
                <div class="cat-item d-flex align-items-center mb-4">
                    <div class="overflow-hidden" style="width: 100px; height: 100px;">
                        <img class="img-fluid" src="${category.image}" alt="">
                    </div>
                    <div class="flex-fill pl-3">
                        <h6>${category.name}</h6>
                        <small class="text-body">${category.games_count} Produk</small>
                    </div>
                </div>
            </a>
        `;
        return categoryDiv;
    }

    rowPlatform.innerHTML = "";
    rowGenre.innerHTML = "";

    platforms.forEach(platform => {
        rowPlatform.appendChild(renderCategoryDiv(platform));
    });

    genres.forEach(genre => {
        rowGenre.appendChild(renderCategoryDiv(genre));
    });
}

function loadProductData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_list.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            recomProductsData = response.terekomendasi;
            recentProductsData = response.terbaru;
            renderProducts("recom", recomProductsData, currentRecomPage);
            renderProducts("recent", recentProductsData, currentRecentPage);
            renderPagination("recom", recomProductsData);
            renderPagination("recent", recentProductsData);
        }
    };
    xhr.send();
}

function renderProducts(type, data, page) {
    var startIndex = (page - 1) * productsPerPage;
    var endIndex = startIndex + productsPerPage;
    var slicedData = data.slice(startIndex, endIndex);
    var rowProduk = document.getElementById(`rowProduk${capitalizeFirstLetter(type)}`);

    function renderRatingStars(rating) {
        let stars = '';
        var fullStars = Math.floor(rating);
        var hasHalfStar = rating % 1 !== 0;
        var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
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

    rowProduk.innerHTML = "";
    slicedData.forEach(function(product) {
        var ratingStars = renderRatingStars(product.rating);
        var productDiv = document.createElement("div");
        productDiv.className = "col-lg-3 col-md-4 col-sm-6 pb-1";
        productDiv.innerHTML = `
            <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${product.background_image}" alt="${product.name}">
                    <div class="product-action">
                        <form method="post" action="php/wish.php?id_produk=${product.id}">
                            <input type="hidden" name="sourcePage" value="detail.html?id=${product.id}">
                            <button class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="far fa-heart"></i></button>
                        </form>
                        <form method="post" action="php/cart.php?id_produk=${product.id}">
                            <input type="hidden" name="sourcePage" value="detail.html?id=${product.id}">
                            <button class="btn btn-outline-dark btn-square" href="" type="submit" name="add"><i class="fa fa-shopping-cart"></i></button>
                        </form>
                    </div>
                </div>
                <div class="text-center py-4">
                    <a class="h6 text-decoration-none product-name" href="detail.html?id=${product.id}">${product.name}</a>
                    <div class="d-flex align-items-center justify-content-center mt-2">
                        <h5>Rp ${product.price}</h5>
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPagination(type, data) {
    var totalPages = Math.ceil(data.length / productsPerPage);
    var pagination = document.getElementById(`pagination-${type}`);
    pagination.innerHTML = "";

    var liPrevious = createPaginationItem("Previous", function() {
        if (type === "recom" && currentRecomPage > 1) {
            currentRecomPage--;
            renderProducts(type, data, currentRecomPage);
        } else if (type === "recent" && currentRecentPage > 1) {
            currentRecentPage--;
            renderProducts(type, data, currentRecentPage);
        }
    }, type);
    pagination.appendChild(liPrevious);

    for (var i = 1; i <= totalPages; i++) {
        var li = createPaginationItem(i, function() {
            if (type === "recom") {
                currentRecomPage = parseInt(this.innerText);
                renderProducts(type, data, currentRecomPage);
            } else if (type === "recent") {
                currentRecentPage = parseInt(this.innerText);
                renderProducts(type, data, currentRecentPage);
            }
        }, type);
        if (i === 1) {
            li.classList.add("active");
        }
        pagination.appendChild(li);
    }

    var liNext = createPaginationItem("Next", function() {
        if (type === "recom" && currentRecomPage < totalPages) {
            currentRecomPage++;
            renderProducts(type, data, currentRecomPage);
        } else if (type === "recent" && currentRecentPage < totalPages) {
            currentRecentPage++;
            renderProducts(type, data, currentRecentPage);
        }
    }, type);
    pagination.appendChild(liNext);

    updatePaginationState(); // Ensure the initial state is updated
}

function createPaginationItem(text, onClick, type) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    li.className = `page-item ${type}`;
    a.className = `page-link ${type}`;
    a.setAttribute("href", "#");
    a.innerText = text;
    a.addEventListener("click", function(event) {
        event.preventDefault();
        onClick.call(this);
        updatePaginationState();
    });
    li.appendChild(a);
    return li;
}

function updatePaginationState() {
    ["recom", "recent"].forEach(function(type) {
        var pageLinks = document.querySelectorAll(`.page-link.${type}`);
        pageLinks.forEach(function(link) {
            var pageNumber = parseInt(link.innerText);
            if ((type === "recom" && pageNumber === currentRecomPage) || 
                (type === "recent" && pageNumber === currentRecentPage)) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        });
    });
}

$(document).ready(function() {
    loadPlatformsAndGenres();
    loadProductData();
});
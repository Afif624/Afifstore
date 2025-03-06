var productsPerPage = 8;
var currentLatestPage = 1;
var currentPopularPage = 1;
var currentBestPage = 1;
var latestProductsData = [];
var popularProductsData = [];
var bestProductsData = [];

function loadCarouselData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_recom.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            renderCarousel(response);
        }
    };
    xhr.send();
}

function renderCarousel(data) {
    var carouselIndicators = document.querySelector('.carousel-indicators');
    var carouselInner = document.querySelector('.carousel-inner');

    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";

    data.forEach((item, index) => {
        var indicator = document.createElement("li");
        indicator.setAttribute("data-target", "#header-carousel");
        indicator.setAttribute("data-slide-to", index);
        if (index === 0) indicator.classList.add("active");
        carouselIndicators.appendChild(indicator);

        var carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item", "position-relative");
        if (index === 0) carouselItem.classList.add("active");
        carouselItem.style.height = "600px";

        var mainImage = document.createElement("img");
        mainImage.classList.add("position-absolute", "w-100", "h-100");
        mainImage.src = item.short_screenshots[0]; // Use the first screenshot as the main image
        mainImage.style.objectFit = "cover";

        var thumbnailContainer = document.createElement("div");
        thumbnailContainer.classList.add("thumbnail-container", "d-flex", "flex-row", "justify-content-center");
        thumbnailContainer.style.marginTop = "10px"; // Add some space between caption and thumbnails

        item.short_screenshots.forEach((screenshot, thumbIndex) => {
            var thumbnail = document.createElement("img");
            thumbnail.classList.add("thumbnail");
            thumbnail.src = screenshot;
            thumbnail.style.width = "50px"; // Adjust the size of thumbnails as needed
            thumbnail.style.height = "50px";
            thumbnail.style.margin = "5px";
            thumbnail.style.cursor = "pointer";

            thumbnail.addEventListener("click", () => {
                mainImage.src = screenshot;
            });

            thumbnailContainer.appendChild(thumbnail);
        });

        carouselItem.innerHTML = `
            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div class="p-3" style="max-width: 700px;">
                    <h1 class="display-4 text-white mb-3 animate__animated animate__fadeInDown">${item.name}</h1>
                    <p class="mx-md-5 px-5 animate__animated animate__bounceIn">${item.details.description_raw.slice(0, 100)}...</p>
                    <a class="btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp" href="detail.html?id=${item.id}">Shop Now</a>
                </div>
                <!-- Move the thumbnail container here -->
                <div class="d-flex justify-content-center w-100">
                    ${thumbnailContainer.innerHTML}
                </div>
            </div>
        `;

        // Add event listeners for thumbnails
        carouselItem.querySelectorAll(".thumbnail").forEach((thumbnail, thumbIndex) => {
            thumbnail.addEventListener("click", () => {
                mainImage.src = item.short_screenshots[thumbIndex];
            });
        });

        carouselItem.appendChild(mainImage);
        carouselInner.appendChild(carouselItem);

        // Change main image on indicator click
        indicator.addEventListener("click", () => {
            mainImage.src = item.short_screenshots[0];
        });
    });
}

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

    platforms.forEach(platform => rowPlatform.appendChild(renderCategoryDiv(platform)));
    genres.forEach(genre => rowGenre.appendChild(renderCategoryDiv(genre)));
}

function loadProductData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/produk_list.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            latestProductsData = response.terbaru;
            popularProductsData = response.terpopuler;
            bestProductsData = response.terbaik;
            renderProducts("latest", latestProductsData, currentLatestPage);
            renderProducts("popular", popularProductsData, currentPopularPage);
            renderProducts("best", bestProductsData, currentBestPage);
            renderPagination("latest", latestProductsData, currentLatestPage);
            renderPagination("popular", popularProductsData, currentPopularPage);
            renderPagination("best", bestProductsData, currentBestPage);
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
    
        for (let i = 0; i < fullStars; i++) stars += '<small class="fa fa-star text-primary mr-1"></small>';
        if (hasHalfStar) stars += '<small class="fa fa-star-half-alt text-primary mr-1"></small>';
        for (let i = 0; i < emptyStars; i++) stars += '<small class="far fa-star text-primary mr-1"></small>';
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
                        <form id="wishForm${product.id}" method="post" action="php/wish.php?id_produk=${product.id}">
                            <input type="hidden" name="sourcePage" value="detail.html?id=${product.id}">
                            <input type="hidden" name="add" value="true">
                            <a class="btn btn-outline-dark btn-square" href="#" onclick="document.getElementById('wishForm${product.id}').submit();">
                                <i class="far fa-heart"></i>
                            </a>
                        </form>
                        <form id="cartForm${product.id}" method="post" action="php/cart.php?id_produk=${product.id}">
                            <input type="hidden" name="sourcePage" value="detail.html?id=${product.id}">
                            <input type="hidden" name="add" value="true">
                            <a class="btn btn-outline-dark btn-square" href="#" onclick="document.getElementById('cartForm${product.id}').submit();">
                                <i class="fa fa-shopping-cart"></i>
                            </a>
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

function renderPagination(type, data, currentPage) {
    var totalPages = Math.ceil(data.length / productsPerPage);
    var pagination = document.getElementById(`pagination-${type}`);
    var paginationLinks = '';
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }

    if (startPage > 1) {
        paginationLinks += `<li class="page-item"><a class="page-link" href="#">1</a></li>`;
        if (startPage > 2) {
            paginationLinks += `<li class="page-item"><a class="page-link">...</a></li>`;
        }
    }

    for (var i = startPage; i <= endPage; i++) {
        paginationLinks += `<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationLinks += `<li class="page-item"><a class="page-link">...</a></li>`;
        }
        paginationLinks += `<li class="page-item"><a class="page-link" href="#">${totalPages}</a></li>`;
    }

    pagination.innerHTML = `
        <li class="page-item"><a class="page-link" href="#" id="prev-${type}">Previous</a></li>
        ${paginationLinks}
        <li class="page-item"><a class="page-link" href="#" id="next-${type}">Next</a></li>
    `;

    updatePaginationState(type, currentPage);

    document.getElementById(`prev-${type}`).addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderProducts(type, data, currentPage);
            renderPagination(type, data, currentPage); // Re-render pagination
            updatePaginationState(type, currentPage); // Update pagination state after changing page
        }
    });

    document.getElementById(`next-${type}`).addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(type, data, currentPage);
            renderPagination(type, data, currentPage); // Re-render pagination
            updatePaginationState(type, currentPage); // Update pagination state after changing page
        }
    });

    document.querySelectorAll(`#pagination-${type} .page-link`).forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            var page = parseInt(event.target.innerText);
            if (!isNaN(page)) {
                currentPage = page;
                renderProducts(type, data, currentPage);
                renderPagination(type, data, currentPage); // Re-render pagination
                updatePaginationState(type, currentPage); // Update pagination state after changing page
            }
        });
    });
}

function updatePaginationState(type, currentPage) {
    document.querySelectorAll(`#pagination-${type} .page-item`).forEach((item) => {
        var page = parseInt(item.querySelector(".page-link").innerText);
        item.classList.toggle("active", page === currentPage);
    });
}

$(document).ready(function() {
    loadCarouselData();
    loadPlatformsAndGenres();
    loadProductData();
});
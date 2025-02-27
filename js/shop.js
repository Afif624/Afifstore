var currentPage = 1;
var ProductsPerPage = 40;
var ProductsData = [];

function initializeFilters() {
    $.ajax({
        type: "GET",
        url: "php/platform_&_genre.php",
        dataType: "json",
        success: function(response) {
            updateHTML(response.platform, 'platform');
            updateHTML(response.genre, 'genre');
            loadSavedFilters();
            addEventListeners();
        }
    });
}

function updateHTML(data, type) {
    var htmlContent = '';
    $.each(data, function(index, value) {
        var isChecked = localStorage.getItem(type + '-' + value.id) === 'true' ? 'checked' : '';
        htmlContent += '<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">';
        htmlContent += '<input type="checkbox" class="custom-control-input ' + type + '-checkbox" id="' + type + '-' + value.id + '" value="' + value.id + '" ' + isChecked + '>';
        htmlContent += '<label class="custom-control-label" for="' + type + '-' + value.id + '">' + value.name + '</label>';
        htmlContent += '<span class="badge border font-weight-normal">'+ value.games_count +'</span>';
        htmlContent += '</div>';
    });
    $('#' + type).html(htmlContent);
}

function loadSavedFilters() {
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    if (filterStorage) {
        filterStorage.platform.forEach(function(id) {
            $('#platform-' + id).prop('checked', true);
        });
        filterStorage.genre.forEach(function(id) {
            $('#genre-' + id).prop('checked', true);
        });
        $('input[name="harga"][value="' + filterStorage.harga + '"]').prop('checked', true);
    }
}

function addEventListeners() {
    $('#platform').on('change', '.platform-checkbox', function() {
        updateFilterStorage();
        location.reload();
    });

    $('#genre').on('change', '.genre-checkbox', function() {
        updateFilterStorage();
        location.reload();
    });

    $('#harga').on('change', 'input[type="radio"]', function() {
        updateFilterStorage();
        location.reload();
    });
}

function updateFilterStorage() {
    var selectedPlatform = [];
    var selectedGenre = [];

    $('#platform input:checked').each(function() {
        selectedPlatform.push($(this).val());
        localStorage.setItem('platform-' + $(this).val(), 'true');
    });

    $('#genre input:checked').each(function() {
        selectedGenre.push($(this).val());
        localStorage.setItem('genre-' + $(this).val(), 'true');
    });

    $('#platform input:not(:checked)').each(function() {
        localStorage.removeItem('platform-' + $(this).val());
    });

    $('#genre input:not(:checked)').each(function() {
        localStorage.removeItem('genre-' + $(this).val());
    });

    var filterStorage = {
        platform: selectedPlatform,
        genre: selectedGenre,
        harga: $('#harga input:checked').val()
    };

    localStorage.setItem('filterStorage', JSON.stringify(filterStorage));
    alert('Filter updated!');
}

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const sortCriteria = this.getAttribute('data-sort');
        localStorage.setItem('sortCriteria', sortCriteria);
        location.reload();
    });
});

function loadProductData() {
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    var sortCriteria = localStorage.getItem('sortCriteria') || 'latest';
    let url = `php/produk_list.php?terfilter=1&sort=${sortCriteria}`;

    if (filterStorage) {
        var { platform, genre, harga } = filterStorage;
        url += platform.length ? `&platform=${platform.join(",")}` : "";
        url += genre.length ? `&genre=${genre.join(",")}` : "";
        url += harga ? `&harga=${harga}` : "";
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            ProductsData = data.terfilter;
            renderProducts(currentPage);
            renderPagination();
        })
        .catch(error => console.error('Error:', error));
}

function renderProducts(page) {
    var startIndex = (page - 1) * ProductsPerPage;
    var slicedData = ProductsData.slice(startIndex, startIndex + ProductsPerPage);
    var rowProduk = document.getElementById("rowProdukRekom");

    rowProduk.innerHTML = slicedData.map(product => {
        var ratingStars = generateRatingStars(product.rating);
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
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
                            <h5>Rp ${product.price}</h5>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            ${ratingStars}
                            <small>(${product.ratings_count})</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function generateRatingStars(rating) {
    var fullStars = Math.floor(rating);
    var hasHalfStar = rating % 1 !== 0;
    var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
        ${'<small class="fa fa-star text-primary mr-1"></small>'.repeat(fullStars)}
        ${hasHalfStar ? '<small class="fa fa-star-half-alt text-primary mr-1"></small>' : ''}
        ${'<small class="far fa-star text-primary mr-1"></small>'.repeat(emptyStars)}
    `;
}

function renderPagination() {
    var totalPages = Math.ceil(ProductsData.length / ProductsPerPage);
    var pagination = document.getElementById("pagination-rekom");

    pagination.innerHTML = `
        <li class="page-item"><a class="page-link" href="#" id="prev">Previous</a></li>
        ${Array.from({ length: totalPages }, (_, i) => `
            <li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>
        `).join('')}
        <li class="page-item"><a class="page-link" href="#" id="next">Next</a></li>
    `;

    updatePaginationState();

    document.getElementById("prev").addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderProducts(currentPage);
            updatePaginationState();
        }
    });

    document.getElementById("next").addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(currentPage);
            updatePaginationState();
        }
    });

    document.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            var page = parseInt(event.target.innerText);
            if (!isNaN(page)) {
                currentPage = page;
                renderProducts(currentPage);
                updatePaginationState();
            }
        });
    });
}

function updatePaginationState() {
    document.querySelectorAll(".page-item").forEach((item, index) => {
        item.classList.toggle("active", index === currentPage);
    });
}

$(document).ready(function() {
    initializeFilters();
    loadProductData();
});
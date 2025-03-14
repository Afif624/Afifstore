var currentPage = 1;
var ProductsData = [];

function initializeFilters() {
    $.ajax({
        type: "GET",
        url: "php/store_preferences.php",
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

function loadProductData() {
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    var sortCriteria = localStorage.getItem('sortCriteria') || 'latest';
    var showCriteria = localStorage.getItem('showCriteria') || 40;
    let url = `php/produk_list.php?terfilter=1&sort=${sortCriteria}`;

    if (sortCriteria) {
        const activeSortItem = document.querySelector(`.dropdown-item[data-sort="${sortCriteria}"]`);
        if (activeSortItem) {
            activeSortItem.classList.add('active');
        }
    }
    if (showCriteria) {
        const activeShowItem = document.querySelector(`.dropdown-item[data-show="${showCriteria}"]`);
        if (activeShowItem) {
            activeShowItem.classList.add('active');
        }
    }
    
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
        renderProducts(currentPage, showCriteria);
        renderPagination(showCriteria);
    })
    .catch(error => console.error('Error:', error));
}

function renderProducts(page, ProductsPerPage) {
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
                        ${ratingStars} <small>(${product.ratings_count})</small>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function renderPagination(ProductsPerPage) {
    var totalPages = Math.ceil(ProductsData.length / ProductsPerPage);
    var pagination = document.getElementById("pagination-rekom");

    var paginationLinks = '';
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, currentPage + 2);

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
        <li class="page-item"><a class="page-link" href="#" id="prev">Previous</a></li>
        ${paginationLinks}
        <li class="page-item"><a class="page-link" href="#" id="next">Next</a></li>
    `;

    updatePaginationState();

    document.getElementById("prev").addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            loadProductData();
        }
    });

    document.getElementById("next").addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            loadProductData();
        }
    });

    document.querySelectorAll(".page-link").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            var page = parseInt(event.target.innerText);
            if (!isNaN(page)) {
                currentPage = page;
                loadProductData();
            }
        });
    });
}

function updatePaginationState() {
    document.querySelectorAll(".page-item").forEach((item) => {
        var page = parseInt(item.querySelector(".page-link").innerText);
        item.classList.toggle("active", page === currentPage);
    });
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

document.querySelectorAll('.dropdown-item[data-sort]').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const sortCriteria = this.getAttribute('data-sort');
        localStorage.setItem('sortCriteria', sortCriteria);
        location.reload();

        document.querySelectorAll('.dropdown-item[data-sort]').forEach(function(el) {
            el.classList.remove('active');
        });
        this.classList.add('active');
    });
});

document.querySelectorAll('.dropdown-item[data-show]').forEach(function(item) {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const showCriteria = this.getAttribute('data-show');
        localStorage.setItem('showCriteria', showCriteria);
        location.reload();

        document.querySelectorAll('.dropdown-item[data-show])').forEach(function(el) {
            el.classList.remove('active');
        });
        this.classList.add('active');
    });
});

$(document).ready(function() {
    initializeFilters();
    loadProductData();
});
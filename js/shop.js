var currentPage = 1;
var ProductsPerPage = 100;
var ProductsData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadProductData();
});

// JavaScript untuk mengambil data platform dan genre dari database
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
    
    // Ambil data platform dan genre saat halaman dimuat
    $.ajax({
        type: "GET",
        url: "php/platform_&_genre.php",
        dataType: "json",
        success: function(response) {
            console.log(response);
            // Update elemen HTML platform
            var platformHTML = '';
            $.each(response.platform, function(index, value) {
                var isChecked = localStorage.getItem('platform-' + value.id) === 'true' ? 'checked' : '';
                platformHTML += '<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">';
                platformHTML += '<input type="checkbox" class="custom-control-input platform-checkbox" id="platform-' + value.id + '" value="' + value.id + '" ' + isChecked + '>';
                platformHTML += '<label class="custom-control-label" for="platform-' + value.id + '">' + value.name + '</label>';
                platformHTML += '<span class="badge border font-weight-normal">'+ value.games_count +'</span>';
                platformHTML += '</div>';
            });
            $('#platform').html(platformHTML);

            // Update elemen HTML genre
            var genreHTML = '';
            $.each(response.genre, function(index, value) {
                var isChecked = localStorage.getItem('genre-' + value.id) === 'true' ? 'checked' : '';
                genreHTML += '<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">';
                genreHTML += '<input type="checkbox" class="custom-control-input genre-checkbox" id="genre-' + value.id + '" value="' + value.id + '" ' + isChecked + '>';
                genreHTML += '<label class="custom-control-label" for="genre-' + value.id + '">' + value.name + '</label>';
                genreHTML += '<span class="badge border font-weight-normal">'+ value.games_count +'</span>';
                genreHTML += '</div>';
            });
            $('#genre').html(genreHTML);
        }
    });

    // Periksa apakah ada filter yang tersimpan di localStorage
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    if (filterStorage) {
        // Periksa apakah ada filter platform yang tersimpan
        if (filterStorage.platform.length > 0) {
            filterStorage.platform.forEach(function(id_platform) {
                $('#platform-' + id_platform).prop('checked', true);
            });
        }

        // Periksa apakah ada filter genre yang tersimpan
        if (filterStorage.genre.length > 0) {
            filterStorage.genre.forEach(function(id_genre) {
                $('#genre-' + id_genre).prop('checked', true);
            });
        }

        // Periksa apakah ada filter harga yang tersimpan
        if (filterStorage.harga) {
            $('input[name="harga"][value="' + filterStorage.harga + '"]').prop('checked', true);
        }
    }

    // Tambahkan event listener pada checkbox platform
    $('#platform').on('change', '.platform-checkbox', function() {
        updateFilterStorage(); // Perbarui filterStorage saat checkbox diubah
        location.reload(); // Muat ulang halaman setelah pembaruan filter
    });

    // Tambahkan event listener pada checkbox genre
    $('#genre').on('change', '.genre-checkbox', function() {
        updateFilterStorage(); // Perbarui filterStorage saat checkbox diubah
        location.reload(); // Muat ulang halaman setelah pembaruan filter
    });

    // Tambahkan event listener pada checkbox harga
    $('#harga').on('change', 'input[type="radio"]', function() {
        updateFilterStorage(); // Perbarui filterStorage saat checkbox diubah
        location.reload(); // Muat ulang halaman setelah pembaruan filter
    });
});

// Fungsi untuk memperbarui filterStorage
function updateFilterStorage() {
    var selectedPlatform = [];
    var selectedGenre = [];

    // Ambil nilai filter platform yang dipilih
    $('#platform input:checked').each(function() {
        selectedPlatform.push($(this).val());
        localStorage.setItem('platform-' + $(this).val(), 'true'); // Simpan status centang ke localStorage
    });

    // Ambil nilai filter genre yang dipilih
    $('#genre input:checked').each(function() {
        selectedGenre.push($(this).val());
        localStorage.setItem('genre-' + $(this).val(), 'true'); // Simpan status centang ke localStorage
    });

    // Hapus status centang dari platform yang tidak dipilih
    $('#platform input:not(:checked)').each(function() {
        localStorage.removeItem('platform-' + $(this).val()); // Hapus status centang dari localStorage
    });

    // Hapus status centang dari genre yang tidak dipilih
    $('#genre input:not(:checked)').each(function() {
        localStorage.removeItem('genre-' + $(this).val()); // Hapus status centang dari localStorage
    });

    // Simpan filter ke dalam filterStorage (gunakan sesuai kebutuhan, misalnya localStorage)
    var filterStorage = {
        platform: selectedPlatform,
        genre: selectedGenre,
        harga: $('#harga input:checked').val() // Harga hanya menyimpan satu nilai yang dipilih
        
    };

    // Simpan ke localStorage atau sesuai kebutuhan
    localStorage.setItem('filterStorage', JSON.stringify(filterStorage));

    // Tambahkan pesan alert atau log ke konsol untuk memastikan bahwa filterStorage sudah diperbarui
    alert('Filter updated!'); // Atau console.log('Filter updated!');
}

// Fungsi untuk memuat data produk sesuai dengan filter yang diterapkan
function loadProductData() {
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    var xhr = new XMLHttpRequest();
    var url = "php/produk_list.php";
    if (filterStorage) {
        url += "?";
        if (filterStorage.platform.length > 0) {
            url += "platform=" + filterStorage.platform.join(",") + "&";
        }
        if (filterStorage.genre.length > 0) {
            url += "genre=" + filterStorage.genre.join(",") + "&";
        }
        if (filterStorage.harga) {
            url += "harga=" + filterStorage.harga;
        }
    }
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response.terfilter);
            ProductsData = response.terfilter;
            renderProducts(currentPage);
            renderPagination();
        }
    };
    xhr.send();
}

function renderProducts(page) {
    var startIndex = (page - 1) * ProductsPerPage;
    var endIndex = startIndex + ProductsPerPage;
    var slicedData = ProductsData.slice(startIndex, endIndex);

    var rowProduk = document.getElementById("rowProdukRekom");
    rowProduk.innerHTML = "";
    slicedData.forEach(function(product) {
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

function renderPagination() {
    var totalPages = Math.ceil(ProductsData.length / ProductsPerPage);
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
        if (currentPage > 1) {
            currentPage--;
            renderProducts(currentPage);
            updatePaginationState();
        }
    });
    liPrevious.appendChild(aPrevious);
    pagination.appendChild(liPrevious);

    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement("li");
        li.className = "page-item";
        var a = document.createElement("a");
        a.className = "page-link ";
        a.innerText = i;
        a.setAttribute("href", "#");
        a.addEventListener("click", function(event) {
            event.preventDefault();
            currentPage = parseInt(this.innerText);
            renderProducts(currentPage);
            updatePaginationState();
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
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(currentPage);
            updatePaginationState();
        }
    });
    liNext.appendChild(aNext);
    pagination.appendChild(liNext);

    updatePaginationState();
}

function updatePaginationState() {
    var pageLinks = document.querySelectorAll(".");
    pageLinks.forEach(function(link) {
        if (parseInt(link.innerText) === currentPage) {
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
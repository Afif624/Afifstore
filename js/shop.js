var currentRecomPage = 1;
var recomProductsPerPage = 8;
var recomProductsData = [];

document.addEventListener("DOMContentLoaded", function() {
    loadProductRecomData();
});

// JavaScript untuk mengambil data kategori dan genre dari database

$(document).ready(function() {
    // Ambil data kategori dan genre saat halaman dimuat
    $.ajax({
        type: "GET",
        url: "php/kategori_genre.php",
        dataType: "json",
        success: function(response) {
            // Update elemen HTML kategori
            var kategoriHTML = '';
            $.each(response.kategori, function(index, value) {
                var isChecked = localStorage.getItem('kategori-' + value.id_kategori) === 'true' ? 'checked' : '';
                kategoriHTML += '<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">';
                kategoriHTML += '<input type="checkbox" class="custom-control-input kategori-checkbox" id="kategori-' + value.id_kategori + '" value="' + value.id_kategori + '" ' + isChecked + '>';
                kategoriHTML += '<label class="custom-control-label" for="kategori-' + value.id_kategori + '">' + value.nama_kategori + '</label>';
                kategoriHTML += '<span class="badge border font-weight-normal"></span>';
                kategoriHTML += '</div>';
            });
            $('#kategori').html(kategoriHTML);

            // Update elemen HTML genre
            var genreHTML = '';
            $.each(response.genre, function(index, value) {
                var isChecked = localStorage.getItem('genre-' + value.id_genre) === 'true' ? 'checked' : '';
                genreHTML += '<div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">';
                genreHTML += '<input type="checkbox" class="custom-control-input genre-checkbox" id="genre-' + value.id_genre + '" value="' + value.id_genre + '" ' + isChecked + '>';
                genreHTML += '<label class="custom-control-label" for="genre-' + value.id_genre + '">' + value.nama_genre + '</label>';
                genreHTML += '<span class="badge border font-weight-normal"></span>';
                genreHTML += '</div>';
            });
            $('#genre').html(genreHTML);
        }
    });

    // Periksa apakah ada filter yang tersimpan di localStorage
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    if (filterStorage) {
        // Periksa apakah ada filter kategori yang tersimpan
        if (filterStorage.kategori.length > 0) {
            filterStorage.kategori.forEach(function(id_kategori) {
                $('#kategori-' + id_kategori).prop('checked', true);
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

    // Tambahkan event listener pada checkbox kategori
    $('#kategori').on('change', '.kategori-checkbox', function() {
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
    var selectedKategori = [];
    var selectedGenre = [];

    // Ambil nilai filter kategori yang dipilih
    $('#kategori input:checked').each(function() {
        selectedKategori.push($(this).val());
        localStorage.setItem('kategori-' + $(this).val(), 'true'); // Simpan status centang ke localStorage
    });

    // Ambil nilai filter genre yang dipilih
    $('#genre input:checked').each(function() {
        selectedGenre.push($(this).val());
        localStorage.setItem('genre-' + $(this).val(), 'true'); // Simpan status centang ke localStorage
    });

    // Hapus status centang dari kategori yang tidak dipilih
    $('#kategori input:not(:checked)').each(function() {
        localStorage.removeItem('kategori-' + $(this).val()); // Hapus status centang dari localStorage
    });

    // Hapus status centang dari genre yang tidak dipilih
    $('#genre input:not(:checked)').each(function() {
        localStorage.removeItem('genre-' + $(this).val()); // Hapus status centang dari localStorage
    });

    // Simpan filter ke dalam filterStorage (gunakan sesuai kebutuhan, misalnya localStorage)
    var filterStorage = {
        kategori: selectedKategori,
        genre: selectedGenre,
        harga: $('#harga input:checked').val() // Harga hanya menyimpan satu nilai yang dipilih
        
    };

    // Simpan ke localStorage atau sesuai kebutuhan
    localStorage.setItem('filterStorage', JSON.stringify(filterStorage));

    // Tambahkan pesan alert atau log ke konsol untuk memastikan bahwa filterStorage sudah diperbarui
    alert('Filter updated!'); // Atau console.log('Filter updated!');
}

// Fungsi untuk memuat data produk sesuai dengan filter yang diterapkan
function loadProductRecomData() {
    var filterStorage = JSON.parse(localStorage.getItem('filterStorage'));
    var xhr = new XMLHttpRequest();
    var url = "php/filter.php";
    if (filterStorage) {
        url += "?";
        if (filterStorage.kategori.length > 0) {
            url += "kategori=" + filterStorage.kategori.join(",") + "&";
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
            recomProductsData = JSON.parse(xhr.responseText);
            renderProductsRecom(currentRecomPage);
            renderPaginationRecom();

            // Tambahkan pesan alert atau log ke konsol setelah data produk dimuat ulang
            alert('Data produk dimuat ulang!'); // Atau console.log('Data produk dimuat ulang!');
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

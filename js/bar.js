function loadContent(url, id, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            document.getElementById(id).innerHTML = doc.getElementById(id + '-content').innerHTML;
            if (callback) callback(); // Panggil callback jika ada
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop().split(".")[0];
    return page;
}

function setActiveNavLink() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split(".")[0];

        // Cek jika halaman saat ini adalah 'detail' dan aktifkan 'shop'
        if (currentPage === 'detail' && linkPage === 'shop') {
            link.classList.add('active');
        } else if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

window.onload = () => {
    // Muat konten topbar, navbar, dan footer kemudian setActiveNavLink
    loadContent('bar.html', 'topbar', function() {
        loadContent('bar.html', 'navbar', function() {
            loadContent('bar.html', 'footer', setActiveNavLink);
        });
    });
};

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "php/login_check.php?id=1",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
            console.log(response);
            // Update elemen HTML wish
            var accountHTML = '';
            accountHTML += `
                <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">${response.nama_user}</button>
                <div class="dropdown-menu dropdown-menu-right">
                    <button class="dropdown-item" type="button" id="logout-button">Logout</button>
                </div>
            `;
            $('#myaccount').html(accountHTML);

            document.getElementById('logout-button').addEventListener('click', function() {
                // Hapus sesi pengguna atau lakukan tindakan logout lainnya di sini
                window.location.href = 'php/logout.php'; // Ganti dengan URL logout yang sesuai
            });
        }
    });
    $.ajax({
        type: "GET",
        url: "php/wish.php",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
            console.log(response);
            // Update elemen HTML wish
            var wishHTML1 = '';
            wishHTML1 += '<i class="fas fa-heart text-dark"></i>';
            wishHTML1 += '<span class="badge text-dark border border-dark rounded-circle" style="padding-bottom: 2px;">'+ response.wish_count +'</span>';
            $('#wish1').html(wishHTML1);
            var wishHTML2 = '';
            wishHTML2 += '<i class="fas fa-heart text-primary"></i>';
            wishHTML2 += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.wish_count +'</span>';
            $('#wish2').html(wishHTML2);
        }
    });
    $.ajax({
        type: "GET",
        url: "php/cart.php",
        dataType: "json",
        success: function(response) {
            // Menampilkan respons di konsol
            console.log(response);
            // Update elemen HTML cart
            var cartHTML1 = '';
            cartHTML1 += '<i class="fas fa-shopping-cart text-dark"></i>';
            cartHTML1 += '<span class="badge text-dark border border-dark rounded-circle" style="padding-bottom: 2px;">'+ response.cart_count +'</span>';
            $('#cart1').html(cartHTML1);
            var cartHTML2 = '';
            cartHTML2 += '<i class="fas fa-shopping-cart text-primary"></i>';
            cartHTML2 += '<span class="badge text-secondary border border-secondary rounded-circle" style="padding-bottom: 2px;">'+ response.cart_count +'</span>';
            $('#cart2').html(cartHTML2);
        }
    });
});

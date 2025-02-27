function loadContent(url, id, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, 'text/html');
            document.getElementById(id).innerHTML = doc.getElementById(id + '-content').innerHTML;
            if (callback) callback(); // Panggil callback jika ada
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function getCurrentPage() {
    var path = window.location.pathname;
    var page = path.split("/").pop().split(".")[0];
    return page;
}

function setActiveNavLink() {
    var currentPage = getCurrentPage();
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        var linkPage = link.getAttribute('href').split(".")[0];

        if (currentPage === 'detail' && linkPage === 'shop') {
            link.classList.add('active');
        } else if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

function updateHTML(selector, iconClass, textClass, count) {
    $(selector).html(`
        <i class="${iconClass}"></i>
        <span class="badge ${textClass} border border-${textClass.split('-')[1]} rounded-circle" style="padding-bottom: 2px;">${count}</span>
    `);
}

window.onload = () => {
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
            $('#myaccount').html(`
                <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">${response.nama_user}</button>
                <div class="dropdown-menu dropdown-menu-right">
                    <button class="dropdown-item" type="button" id="logout-button">Logout</button>
                </div>
            `);

            $('#logout-button').click(function() {
                window.location.href = 'php/logout.php';
            });
        }
    });

    $.ajax({
        type: "GET",
        url: "php/wish.php",
        dataType: "json",
        success: function(response) {
            updateHTML('#wish1', 'fas fa-heart text-dark', 'text-dark', response.wish_count);
            updateHTML('#wish2', 'fas fa-heart text-primary', 'text-secondary', response.wish_count);
        }
    });

    $.ajax({
        type: "GET",
        url: "php/cart.php",
        dataType: "json",
        success: function(response) {
            updateHTML('#cart1', 'fas fa-shopping-cart text-dark', 'text-dark', response.cart_count);
            updateHTML('#cart2', 'fas fa-shopping-cart text-primary', 'text-secondary', response.cart_count);
        }
    });
});

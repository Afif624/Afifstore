var xhr = new XMLHttpRequest();
xhr.open('GET', 'php/login_check.php', true);

xhr.onload = function() {
    // Response berhasil, Anda dapat memeriksa hasilnya di sini
    var response = xhr.responseText;
    if (response === 'logged_in') {
        // Pengguna sudah login, tidak perlu tindakan tambahan
        console.log('Pengguna sudah login.');
    } else {
        // Pengguna belum login, redirect ke halaman login
        window.location.href = 'login.html';
    }
};

xhr.onerror = function() {
    // Gagal memuat halaman cek login
    console.error('Gagal memuat halaman cek login.');
};

xhr.send();
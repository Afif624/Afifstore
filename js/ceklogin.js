var xhr = new XMLHttpRequest();
xhr.open('GET', 'php/ceklogin.php', true);

xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
        // Response berhasil, Anda dapat memeriksa hasilnya di sini
        var response = xhr.responseText;
        if (response === 'logged_in') {
            // Pengguna sudah login, tidak perlu tindakan tambahan
        } else {
            // Pengguna belum login, redirect ke halaman login
            window.location.href = 'login.html';
        }
    } else {
        // Gagal memuat halaman cek login
        console.error('Gagal memuat halaman cek login.');
    }
};

xhr.send();
<?php
session_start();
session_unset();
session_destroy();
echo "<script>alert('Logout successful!');
    window.location.href = '../login.html';
        </script>"; // Ganti dengan URL halaman login yang sesuai
exit();
?>
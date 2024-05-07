-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 07 Bulan Mei 2024 pada 16.56
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamestore`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `detailgenre`
--

CREATE TABLE `detailgenre` (
  `id_detailgenre` int(11) NOT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `id_genre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `detailgenre`
--

INSERT INTO `detailgenre` (`id_detailgenre`, `id_produk`, `id_genre`) VALUES
(1, 1, 4),
(2, 1, 8),
(3, 2, 8),
(4, 3, 8),
(5, 3, 16),
(6, 3, 1),
(7, 4, 1),
(8, 4, 16),
(9, 6, 20),
(10, 7, 18),
(11, 8, 1),
(12, 8, 2),
(13, 9, 19),
(14, 9, 22),
(15, 10, 8),
(16, 11, 4),
(17, 12, 2),
(18, 12, 16),
(19, 13, 18);

-- --------------------------------------------------------

--
-- Struktur dari tabel `detailkategori`
--

CREATE TABLE `detailkategori` (
  `id_detailkategori` int(11) NOT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `id_kategori` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `detailkategori`
--

INSERT INTO `detailkategori` (`id_detailkategori`, `id_produk`, `id_kategori`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 1),
(5, 6, 2),
(6, 7, 3),
(7, 8, 1),
(8, 9, 2),
(9, 10, 3),
(10, 11, 1),
(11, 12, 2),
(12, 13, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `genre`
--

CREATE TABLE `genre` (
  `id_genre` int(11) NOT NULL,
  `nama_genre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `genre`
--

INSERT INTO `genre` (`id_genre`, `nama_genre`) VALUES
(1, 'Action'),
(2, 'Adventure'),
(3, 'Arcade'),
(4, 'Battle Royale'),
(5, 'Card & Board'),
(6, 'Educational'),
(7, 'Fighting'),
(8, 'FPS'),
(9, 'Hack & Slash'),
(10, 'MMORPG'),
(11, 'Musical'),
(12, 'Platformer'),
(13, 'Puzzle'),
(14, 'Racing'),
(15, 'Roguelike'),
(16, 'RPG'),
(17, 'Sandbox'),
(18, 'Shooter'),
(19, 'Simulation'),
(20, 'Sports'),
(21, 'Stealth'),
(22, 'Strategy'),
(23, 'Survival'),
(24, 'Tactical Role-playing');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Console'),
(2, 'PC'),
(3, 'Mobile');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order`
--

CREATE TABLE `order` (
  `id_order` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `payment` varchar(50) DEFAULT NULL,
  `waktu` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `order`
--

INSERT INTO `order` (`id_order`, `id_user`, `id_produk`, `payment`, `waktu`) VALUES
(8, 3, 1, 'Bank Transfer', '2024-05-07 04:34:16'),
(9, 3, 9, 'Bank Transfer', '2024-05-07 04:34:16'),
(10, 3, 2, 'Direct Check', '2024-05-07 12:26:34'),
(11, 3, 7, 'Direct Check', '2024-05-07 12:26:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(100) DEFAULT NULL,
  `harga_produk` decimal(10,0) DEFAULT NULL,
  `file_produk` varchar(255) DEFAULT NULL,
  `dev_produk` varchar(100) DEFAULT NULL,
  `publ_produk` varchar(100) DEFAULT NULL,
  `tgl_produk` date DEFAULT NULL,
  `desk_produk` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga_produk`, `file_produk`, `dev_produk`, `publ_produk`, `tgl_produk`, `desk_produk`) VALUES
(1, 'Apex Legends', '100', 'Apex Legends.jpg', 'Respawn Entertainment', 'Electronic Arts', '2019-02-04', 'Apex Legends adalah sebuah fenomena dalam genre permainan battle royale yang menggabungkan aksi cepat, mekanika permainan yang inovatif, dan karakter-karakter yang berbeda-beda dalam satu paket yang memukau. Dikembangkan oleh Respawn Entertainment dan diterbitkan oleh Electronic Arts pada tahun 2019, permainan ini segera memikat jutaan pemain di seluruh dunia dengan grafik yang memukau, peta yang luas dan bervariasi, serta gameplay yang sangat adiktif.\r\n\r\nSalah satu hal yang membuat Apex Legends begitu menarik adalah karakter-karakternya yang unik. Setiap karakter, atau yang dikenal sebagai \"Legends\", memiliki kemampuan khusus yang berbeda, memungkinkan pemain untuk memilih strategi yang sesuai dengan gaya bermain mereka. Dari Bloodhound yang mempunyai kemampuan untuk melacak musuh, hingga Gibraltar yang memiliki pertahanan yang kokoh, pemain memiliki banyak opsi untuk menyesuaikan tim mereka dan mengeksplorasi kombinasi strategi yang berbeda-beda.\r\n\r\nSelain itu, Apex Legends terus menghadirkan konten baru secara berkala, mulai dari pembaruan peta hingga penambahan karakter baru, yang menjaga kesegaran permainan. Turnamen dan acara komunitas yang diadakan secara reguler juga membuat pengalaman bermain semakin menarik dan berkesan bagi para pemain. Dengan komunitas yang besar dan aktif, serta pengembang yang responsif terhadap umpan balik dari pemain, Apex Legends terus menjadi salah satu judul yang paling populer dan diantisipasi di dunia permainan video saat ini.'),
(2, 'Counter-Strike 2', '200', 'Counter-Strike 2.jpg', 'Valve Corporation', 'Valve Corporation', '2023-09-27', 'Counter-Strike 2 adalah sekuel yang sangat dinantikan dari salah satu game first-person shooter (FPS) paling ikonik dalam sejarah gaming. Dikembangkan oleh Valve Corporation, Counter-Strike 2 menyuguhkan pengalaman bermain yang mendebarkan dengan mekanika permainan yang sudah dikenal namun dengan penyegaran yang signifikan. Dibandingkan dengan pendahulunya, game ini menampilkan grafis yang lebih canggih, peta yang lebih kompleks, dan beragam mode permainan baru yang akan memuaskan para penggemar setia dan juga para pemain baru.\r\n\r\nSalah satu aspek yang membuat Counter-Strike 2 begitu menarik adalah kesetiaannya terhadap akar-akar gameplay yang membuat seri ini begitu populer. Mode permainan klasik seperti Bomb Defusal dan Hostage Rescue kembali dengan peningkatan yang signifikan dalam tata letak peta, desain level, dan dinamika permainan. Selain itu, pembaruan pada senjata dan alat-alat baru memberikan pemain lebih banyak pilihan untuk menyesuaikan gaya bermain mereka dan merencanakan strategi yang efektif.\r\n\r\nNamun, Counter-Strike 2 juga menghadirkan inovasi yang segar ke dalam seri. Mode permainan baru seperti Battle Royale atau mode kooperatif dengan narasi yang kuat menambahkan kedalaman baru ke dalam pengalaman bermain. Selain itu, integrasi dengan platform online yang kuat memungkinkan para pemain untuk terlibat dalam komunitas yang luas, berpartisipasi dalam turnamen, dan bahkan membuat konten kustom untuk dibagikan dengan sesama pemain. Dengan demikian, Counter-Strike 2 menjanjikan pengalaman yang mendebarkan dan memuaskan bagi para pemain FPS di seluruh dunia.'),
(3, 'Destiny 2', '300', 'Destiny 2.jpg', 'Bungie', 'Bungie', '2017-09-06', 'Destiny 2 adalah sebuah epik sci-fi yang menggabungkan elemen-elemen dari permainan penembak orang pertama (FPS) dengan elemen-elemen permainan peran (RPG) dalam sebuah pengalaman yang mendebarkan dan berlatar belakang dunia yang luas. Dikembangkan oleh Bungie dan diterbitkan oleh Activision, Destiny 2 mengantarkan pemain ke dalam sebuah alam semesta futuristik di mana mereka berperan sebagai \"Guardian\" yang mempertahankan manusia dari ancaman yang mengancam keberadaan mereka.\r\n\r\nSalah satu aspek yang membuat Destiny 2 begitu menarik adalah dunia yang kaya dan terbuka untuk dijelajahi. Dengan peta yang luas dan beragam, pemain dapat menjelajahi planet-planet, bulan, dan ruang angkasa untuk menemukan rahasia-rahasia yang tersembunyi dan menyelesaikan misi-misi yang menantang. Setiap lokasi dalam game ini dihiasi dengan detail yang memukau dan menyajikan pengalaman visual yang memikat.\r\n\r\nSelain itu, Destiny 2 menawarkan berbagai jenis aktivitas yang dapat dimainkan bersama, mulai dari kampanye cerita yang epik hingga raid yang menantang dengan mekanika yang kompleks. Mode permainan kompetitif seperti Crucible juga memungkinkan pemain untuk bersaing dengan pemain lain dalam pertempuran PvP yang intens. Dengan tambahan konten secara teratur dan acara-acara komunitas yang diadakan oleh pengembang, Destiny 2 berhasil menjaga kesegaran dan daya tariknya untuk pemain yang sudah lama maupun yang baru bergabung. Dengan demikian, Destiny 2 terus menjadi salah satu judul yang paling dinanti dan disukai dalam industri game modern.'),
(4, 'Dragon\'s Dogma 2', '400', 'Dragon\'s Dogma 2.jpg', 'Capcom', 'Capcom', '2024-03-22', 'Dragon\'s Dogma 2 adalah kelanjutan yang sangat dinantikan dari franchise aksi peran (RPG) yang dikembangkan oleh Capcom. Menggabungkan elemen-elemen RPG klasik dengan aksi yang penuh adrenalin dan dunia yang terbuka untuk dijelajahi, Dragon\'s Dogma 2 menjanjikan pengalaman yang mendebarkan dan mendalam bagi para pemain yang mencari petualangan epik di dunia fantasi yang fantastis.\r\n\r\nSalah satu daya tarik utama dari Dragon\'s Dogma 2 adalah sistem pertarungan yang dinamis dan mendalam. Pemain dapat memilih dari berbagai kelas karakter yang berbeda, masing-masing dengan gaya pertarungan yang unik, dan memperkuat karakter mereka dengan berbagai keterampilan dan kekuatan khusus. Pertarungan melawan monster-monster raksasa yang epik dan bos-bos yang menantang menuntut pemain untuk menggunakan strategi dan keterampilan mereka dengan bijaksana untuk menghadapi setiap tantangan.\r\n\r\nSelain itu, Dragon\'s Dogma 2 menawarkan dunia yang terbuka yang luas dan penuh dengan keajaiban untuk dijelajahi. Dari dataran terbuka yang luas hingga gua-gua yang gelap dan hutan-hutan yang misterius, setiap sudut dunia game ini dihiasi dengan detail yang memukau dan menyimpan rahasia yang menunggu untuk diungkap. Pemain dapat melakukan petualangan solo atau bergabung dengan teman-teman mereka dalam petualangan kooperatif untuk menjelajahi dunia Dragon\'s Dogma 2 bersama-sama.\r\n\r\nDengan grafis yang memukau, mekanika permainan yang mendalam, dan dunia yang penuh dengan keajaiban, Dragon\'s Dogma 2 menjadi salah satu game yang paling dinantikan oleh para penggemar RPG di seluruh dunia. Dengan cerita yang mendebarkan, karakter-karakter yang menarik, dan tantangan yang menantang, Dragon\'s Dogma 2 menjanjikan pengalaman yang tak terlupakan bagi siapa pun yang berani memasuki dunianya.'),
(6, 'EA SPORTS FC™ 24', '500', 'EA SPORTS FC™ 24.jpg', 'Electronic Arts', 'Electronic Arts', '2023-09-29', 'EA SPORTS FC™ 24 adalah sebuah simbol baru dalam dunia olahraga virtual yang menggabungkan kegembiraan dari berbagai cabang olahraga populer dalam satu paket yang mengagumkan. Dikembangkan oleh Electronic Arts, permainan ini menghadirkan pengalaman olahraga yang mendebarkan dengan grafis yang memukau dan gameplay yang realistis. EA SPORTS FC™ 24 menempatkan pemain di tengah-tengah aksi olahraga favorit mereka, memungkinkan mereka untuk mengejar impian olahraga mereka sendiri dalam dunia virtual yang mengagumkan.\r\n\r\nSalah satu hal yang membuat EA SPORTS FC™ 24 begitu menarik adalah variasi olahraga yang ditawarkan. Dari sepak bola, basket, hingga balap mobil, pemain memiliki kesempatan untuk merasakan sensasi bermain di lapangan atau lintasan dalam berbagai cabang olahraga yang berbeda. Setiap cabang olahraga dalam permainan ini dipresentasikan dengan tingkat detail yang luar biasa, dari stadion yang ikonik hingga atlet yang terlihat seperti aslinya, sehingga pemain dapat merasakan pengalaman olahraga yang sebenarnya di kenyamanan rumah mereka sendiri.\r\n\r\nTidak hanya itu, EA SPORTS FC™ 24 juga menawarkan berbagai mode permainan yang menarik, mulai dari mode kariyer yang mendebarkan hingga mode multiplayer online yang kompetitif. Pemain dapat membangun karier olahraga mereka sendiri, menghadapi tantangan dari lawan-lawan yang kuat, dan bersaing untuk menjadi yang terbaik di dunia virtual. Dengan dukungan komunitas yang kuat dan pembaruan konten reguler dari pengembang, EA SPORTS FC™ 24 menjadi destinasi utama bagi para penggemar olahraga di seluruh dunia yang ingin merasakan aksi olahraga yang tak tertandingi dalam satu game yang mengagumkan.'),
(7, 'HELLDIVERS', '600', 'HELLDIVERS.jpg', 'Arrowhead Game Studios', 'Sony Computer Entertainment', '2024-02-08', 'HELLDIVERS adalah permainan taktis top-down shooter yang menghadirkan pengalaman pertempuran yang serba cepat dan penuh aksi dalam skenario perang bintang yang epik. Dikembangkan oleh Arrowhead Game Studios, permainan ini memadukan elemen-elemen dari genre permainan aksi dan strategi, memungkinkan pemain untuk merasakan ketegangan dan kegembiraan dari pertempuran yang intens di berbagai planet yang berbeda.\r\n\r\nSalah satu fitur yang paling mencolok dari HELLIVERS adalah fokusnya pada kerjasama tim dan koordinasi. Pemain dapat bermain sendiri atau bersama dengan hingga tiga pemain lainnya dalam mode multiplayer kooperatif, di mana koordinasi dan komunikasi yang baik antar pemain menjadi kunci untuk mencapai kemenangan. Setiap misi dalam permainan ini menuntut strategi yang cerdik, reaksi yang cepat, dan kerjasama tim yang solid untuk mengatasi musuh-musuh yang menantang dan menyelesaikan tujuan-tujuan misi yang beragam.\r\n\r\nSelain itu, HELLIVERS menawarkan tingkat kebebasan dan kustomisasi yang tinggi bagi pemainnya. Pemain dapat memilih dari berbagai macam senjata, peralatan, dan upgrade untuk menyesuaikan gaya bermain mereka dan menghadapi tantangan yang berbeda-beda. Sistem progresi yang mendalam juga memberikan insentif bagi pemain untuk terus bermain, dengan membuka akses ke peralatan baru, kemampuan baru, dan tantangan-tantangan yang semakin menantang seiring dengan kemajuan mereka dalam permainan.\r\n\r\nDengan aksi yang mendebarkan, taktik yang cerdas, dan kerjasama tim yang intens, HELLIVERS menjanjikan pengalaman permainan yang seru dan memuaskan bagi para pemain yang mencari tantangan dan kegembiraan dalam pertempuran antar bintang.'),
(8, 'Horizon Forbidden West', '700', 'Horizon Forbidden West.jpg', 'Guerrilla Games', 'Sony Interactive Entertainment', '2022-02-18', 'Horizon Forbidden West adalah sekuel yang sangat dinantikan dari permainan aksi-petualangan yang sukses secara kritis, Horizon Zero Dawn. Dikembangkan oleh Guerrilla Games, permainan ini menghadirkan pemain ke dalam dunia yang luas, indah, dan penuh dengan misteri di mana teknologi futuristik bertabrakan dengan alam liar yang megah. Sebagai Aloy, seorang pemburu yang ulung, pemain akan menjelajahi berbagai lanskap yang menakjubkan, menghadapi makhluk-makhluk mekanik yang ganas, dan mengungkap rahasia yang terkubur dalam peradaban yang telah punah.\r\n\r\nSalah satu aspek yang paling mencolok dari Horizon Forbidden West adalah visualnya yang memukau. Dengan menggunakan mesin grafis terbaru, permainan ini menyajikan dunia yang detailnya luar biasa, dari gurun pasir yang terpanggang matahari hingga hutan lebat yang hijau dan kota-kota kuno yang terlupakan. Setiap sudut dunia game ini dihiasi dengan keindahan yang memukau, menciptakan pengalaman yang memikat bagi pemain yang menjelajahi setiap setiap sudutnya.\r\n\r\nSelain itu, Horizon Forbidden West juga menjanjikan cerita yang mendalam dan menarik. Dengan melanjutkan petualangan Aloy, pemain akan terlibat dalam konflik-konflik yang kompleks, bertemu dengan karakter-karakter yang kuat, dan mengungkap misteri-misteri yang terkait dengan asal-usul dunia yang mereka tinggali. Dengan pengisi suara yang berkualitas tinggi, penulisan skenario yang brilian, dan sinematografi yang mengesankan, permainan ini akan membawa pemainnya dalam sebuah perjalanan epik yang tak terlupakan.\r\n\r\nDengan gameplay yang memikat, visual yang memukau, dan cerita yang mendalam, Horizon Forbidden West menjanjikan pengalaman gaming yang luar biasa bagi para pemain yang mencari petualangan yang tak terlupakan dalam sebuah dunia yang fantastis.'),
(9, 'Millenia', '800', 'Millenia.jpg', 'Thunderful Games', 'Thunderful Games', '2024-03-26', 'Millenia adalah sebuah permainan peran daring yang menjanjikan petualangan epik di dalam dunia fantasi yang penuh dengan misteri dan bahaya. Dikembangkan oleh studio indie yang berbakat, permainan ini menggabungkan elemen-elemen dari genre RPG klasik dengan grafis yang indah dan mekanika permainan yang mendalam. Dalam Millenia, pemain akan memulai perjalanan mereka sebagai seorang pahlawan yang bermimpi, menjelajahi daratan yang luas, dan menghadapi tantangan yang menguji keberanian dan keterampilan mereka.\r\n\r\nSalah satu hal yang paling mencolok dari Millenia adalah dunia yang fantastis dan penuh warna yang berhasil diciptakan oleh pengembangnya. Dari kota-kota yang ramai hingga hutan-hutan yang angker, setiap lokasi dalam permainan ini dihiasi dengan detail yang memukau dan atmosfer yang menarik. Pemain dapat menjelajahi dunia ini dengan bebas, menemukan rahasia-rahasia tersembunyi, dan bertemu dengan berbagai karakter yang menarik dalam perjalanan mereka.\r\n\r\nSelain itu, Millenia menawarkan sistem permainan yang mendalam dan menantang. Pemain dapat memilih dari berbagai kelas karakter yang berbeda, masing-masing dengan kemampuan dan kekuatan yang unik, dan mengembangkan karakter mereka sesuai dengan gaya bermain mereka sendiri. Dengan sistem pertarungan yang dinamis dan strategis, pemain harus memanfaatkan kekuatan mereka dengan bijaksana dan mengambil keputusan yang tepat untuk mengatasi musuh-musuh yang mengancam dan menyelesaikan misi-misi yang menantang.\r\n\r\nDengan visual yang memesona, gameplay yang mendebarkan, dan dunia yang luas untuk dijelajahi, Millenia menawarkan pengalaman RPG yang tak terlupakan bagi para pemain yang mencari petualangan yang mendalam dan imajinatif. Dengan cerita yang kaya, karakter-karakter yang menarik, dan tantangan yang menantang, Millenia akan membawa pemainnya dalam sebuah perjalanan yang penuh warna dan memikat.'),
(10, 'Outpost Infinity Siege', '900', 'Outpost Infinity Siege.jpg', 'Binary Option Studio', 'Binary Option Studio', '2024-03-26', 'Outpost Infinity Siege adalah permainan strategi real-time yang menghadirkan pengalaman pertahanan menara yang seru di dalam lanskap fiksi ilmiah yang futuristik. Dikembangkan oleh tim pengembang yang berbakat, permainan ini memadukan elemen-elemen strategi yang mendalam dengan aksi yang cepat dan intens, memungkinkan pemain untuk merancang dan mempertahankan benteng mereka sendiri dari serangan musuh yang datang dari segala arah.\r\n\r\nSalah satu fitur utama yang membuat Outpost Infinity Siege begitu menarik adalah kebebasan dan kreativitas dalam merancang sistem pertahanan. Pemain memiliki kontrol penuh atas bagaimana mereka ingin membangun benteng mereka, memilih dari berbagai jenis menara pertahanan, perangkat tambahan, dan jebakan untuk menangkal serangan musuh yang semakin kuat. Dengan berbagai strategi yang dapat diterapkan, pemain dapat bereksperimen dengan berbagai kombinasi dan taktik untuk mencapai kemenangan.\r\n\r\nSelain itu, Outpost Infinity Siege juga menawarkan berbagai mode permainan yang menarik. Pemain dapat menghadapi serangan gelombang musuh dalam mode Kampanye yang mendebarkan, menguji keterampilan dan ketahanan mereka dalam mode Survival yang menantang, atau bahkan berkompetisi dengan pemain lain dalam mode Multiplayer online. Dengan tambahan konten reguler dan pembaruan dari pengembang, permainan ini menjanjikan pengalaman yang menyenangkan dan menantang bagi para penggemar genre pertahanan menara.\r\n\r\nDengan grafis yang futuristik, mekanika permainan yang mendalam, dan tantangan yang menantang, Outpost Infinity Siege adalah pilihan yang sempurna bagi para pemain yang mencari pengalaman pertahanan menara yang seru dan adiktif. Dengan fokus pada strategi, kreativitas, dan kerjasama tim, permainan ini akan menguji kemampuan pemain untuk merancang dan mempertahankan benteng mereka sendiri dalam menghadapi serangan yang tak terelakkan.'),
(11, 'PUBG Battlegrounds', '1000', 'PUBG Battlegrounds.jpg', 'PUBG Corporation', 'PUBG Corporation', '2017-12-20', 'PUBG Battlegrounds adalah fenomena global dalam genre battle royale yang menawarkan pengalaman pertempuran intens di sebuah pulau terpencil yang luas. Dikembangkan oleh PUBG Corporation, permainan ini telah merevolusi cara kita memandang pertempuran online dengan memadukan elemen permainan survival dengan mekanika permainan yang realistis dan grafis yang memukau.\r\n\r\nSalah satu daya tarik utama dari PUBG Battlegrounds adalah kesederhanaan konsepnya yang memungkinkan para pemain untuk langsung terjun ke dalam pertempuran tanpa banyak penjelasan. Di dalam permainan, 100 pemain dari seluruh dunia dilemparkan ke dalam sebuah pulau terpencil tanpa senjata atau perlengkapan apa pun, dan mereka harus berjuang untuk bertahan hidup dan menjadi yang terakhir bertahan dalam pertempuran mati-matian. Konsep ini menciptakan ketegangan yang tak tertandingi dan menjamin setiap pertandingan berlangsung berbeda-beda.\r\n\r\nSelain itu, PUBG Battlegrounds juga terus berkembang dan menyediakan konten baru secara teratur. Pembaruan-pembaruan termasuk peta baru, senjata baru, mode permainan baru, dan banyak lagi, yang menjaga kesegaran dan keberagaman dalam permainan. Turnamen dan acara komunitas yang diadakan secara reguler juga menjaga minat para pemain dan memberikan kesempatan untuk bersaing dengan pemain lain dari seluruh dunia.\r\n\r\nDengan jutaan pemain aktif dan komunitas yang besar, PUBG Battlegrounds tetap menjadi salah satu game paling populer di dunia. Pengalaman yang adiktif, gameplay yang mendebarkan, dan dinamika pertempuran yang tak terduga membuatnya menjadi pilihan utama bagi para pemain yang mencari tantangan dan kegembiraan dalam pertempuran royale online.'),
(12, 'SOUTH PARK SNOW DAY!', '1100', 'SOUTH PARK SNOW DAY!.jpg', 'South Park Digital Studios', 'Ubisoft', '2024-03-26', 'SOUTH PARK SNOW DAY! adalah sebuah permainan video yang menghadirkan kesenangan dan kegilaan yang khas dari dunia South Park ke dalam dunia game. Dikembangkan oleh tim pengembang yang bekerja sama dengan pencipta South Park, Trey Parker dan Matt Stone, permainan ini menjanjikan pengalaman yang kocak dan menghibur bagi para penggemar serial animasi yang klasik ini.\r\n\r\nSalah satu aspek yang paling mencolok dari SOUTH PARK SNOW DAY! adalah humor yang tajam dan tak terduga yang menjadi ciri khas dari franchise South Park. Dengan skrip yang ditulis oleh Trey Parker dan Matt Stone sendiri, permainan ini dipenuhi dengan lelucon yang khas dari serial TV, referensi budaya pop, dan adegan-adegan lucu yang pasti akan membuat pemain tertawa terbahak-bahak.\r\n\r\nSelain itu, SOUTH PARK SNOW DAY! juga menawarkan gameplay yang seru dan beragam. Pemain akan menjelajahi kota South Park yang ikonis, bertemu dengan karakter-karakter yang terkenal seperti Stan, Kyle, Cartman, dan Kenny, dan mengikuti petualangan-petualangan gila yang diilhami dari episode-episode serial TV. Dengan berbagai misi dan tantangan yang berbeda, permainan ini akan memberikan pengalaman yang menyenangkan bagi para penggemar setia South Park dan juga bagi para pemain yang baru mengenal dunia ini.\r\n\r\nDengan grafis yang lucu dan menggemaskan, humor yang tajam dan menghibur, serta gameplay yang seru dan beragam, SOUTH PARK SNOW DAY! adalah pilihan yang sempurna bagi para penggemar South Park yang ingin menghabiskan waktu di dunia yang penuh dengan kegilaan dan kesenangan dari serial TV yang klasik ini.'),
(13, 'Tom Clancy\'s Rainbow Six® Siege', '1200', 'Tom Clancy\'s Rainbow Six® Siege.jpg', 'Ubisoft Montreal', 'Ubisoft', '2015-12-01', 'Tom Clancy\'s Rainbow Six® Siege adalah sebuah permainan tembak-menembak taktis yang menuntut kecerdasan, koordinasi tim, dan reaksi yang cepat dari para pemainnya. Dikembangkan oleh Ubisoft, permainan ini menempatkan pemain dalam peran sebagai anggota dari unit anti-teroristik elit yang dikenal sebagai Rainbow Six, di mana mereka akan berpartisipasi dalam operasi-operasi kritis di berbagai lokasi di seluruh dunia.\r\n\r\nSalah satu aspek yang paling mencolok dari Rainbow Six Siege adalah fokusnya pada taktik dan kerjasama tim. Pemain tidak hanya harus memiliki keterampilan tembak yang baik, tetapi juga harus mampu berpikir taktis, berkomunikasi dengan tim mereka, dan merencanakan strategi yang efektif untuk menghadapi musuh. Dengan berbagai peta yang dirancang dengan baik dan mekanika permainan yang realistis, setiap pertandingan menawarkan pengalaman yang unik dan menantang.\r\n\r\nSelain itu, Rainbow Six Siege juga menawarkan beragam mode permainan yang menarik. Pemain dapat memilih untuk bermain dalam mode PvP (Player versus Player) yang intens, di mana dua tim bersaing untuk mencapai tujuan mereka masing-masing, atau mode PvE (Player versus Environment) di mana pemain bekerja sama untuk mengalahkan musuh-musuh AI yang menantang. Dengan tambahan konten reguler dalam bentuk pembaruan dan ekspansi, permainan ini terus berkembang dan menawarkan pengalaman yang menyenangkan bagi para penggemar tembak-menembak taktis.\r\n\r\nDengan grafis yang realistis, mekanika permainan yang mendalam, dan fokus yang kuat pada kerjasama tim dan taktik, Tom Clancy\'s Rainbow Six Siege adalah pilihan yang sempurna bagi para pemain yang mencari pengalaman tembak-menembak yang realistis dan menantang. Dengan komunitas yang besar dan aktif, turnamen yang diadakan secara reguler, dan dukungan yang berkelanjutan dari pengembangnya, permainan ini terus menjadi salah satu judul yang paling populer dalam genre-nya.');

-- --------------------------------------------------------

--
-- Struktur dari tabel `review`
--

CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `tanggal` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `review`
--

INSERT INTO `review` (`id_review`, `id_produk`, `id_user`, `rating`, `review`, `tanggal`) VALUES
(1, 1, 3, 4, 'Sangat Bagus', '2024-04-25'),
(4, 1, 3, 2, 'Sangat Jelek', '2024-05-07');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `no_hp` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `nama`, `email`, `no_hp`, `password`) VALUES
(3, 'AfifPristantio', 'afifpristantio@gmail.com', '0823-5358-0750', '12345'),
(4, 'AzkaArdana', 'azka@gmail.com', '0823-5358-0750', '12345');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `detailgenre`
--
ALTER TABLE `detailgenre`
  ADD PRIMARY KEY (`id_detailgenre`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_genre` (`id_genre`);

--
-- Indeks untuk tabel `detailkategori`
--
ALTER TABLE `detailkategori`
  ADD PRIMARY KEY (`id_detailkategori`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id_genre`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indeks untuk tabel `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `detailgenre`
--
ALTER TABLE `detailgenre`
  MODIFY `id_detailgenre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `detailkategori`
--
ALTER TABLE `detailkategori`
  MODIFY `id_detailkategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT untuk tabel `genre`
--
ALTER TABLE `genre`
  MODIFY `id_genre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `order`
--
ALTER TABLE `order`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Ketidakleluasaan untuk tabel `detailgenre`
--
ALTER TABLE `detailgenre`
  ADD CONSTRAINT `detailgenre_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`),
  ADD CONSTRAINT `detailgenre_ibfk_2` FOREIGN KEY (`id_genre`) REFERENCES `genre` (`id_genre`);

--
-- Ketidakleluasaan untuk tabel `detailkategori`
--
ALTER TABLE `detailkategori`
  ADD CONSTRAINT `detailkategori_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`),
  ADD CONSTRAINT `detailkategori_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`);

--
-- Ketidakleluasaan untuk tabel `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Ketidakleluasaan untuk tabel `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

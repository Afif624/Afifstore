-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2025 at 11:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `afifstore`
--

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `random_datetime` () RETURNS DATETIME  BEGIN
    RETURN DATE_ADD(NOW(), INTERVAL RAND() * 30 DAY);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id_cart`, `id_user`, `id_produk`) VALUES
(244, 3, 1),
(245, 8, 1),
(246, 10, 1),
(247, 7, 2),
(248, 10, 2),
(249, 6, 3),
(250, 10, 3),
(251, 6, 4),
(252, 9, 4),
(253, 6, 6),
(254, 9, 6),
(255, 2, 7),
(256, 8, 7),
(257, 1, 8),
(258, 8, 8),
(259, 1, 9),
(260, 7, 9),
(261, 10, 9),
(262, 2, 10),
(263, 6, 10),
(264, 1, 11),
(265, 3, 11),
(266, 1, 12),
(267, 3, 12),
(268, 7, 13),
(269, 9, 13),
(270, 4, 14),
(271, 8, 14),
(272, 3, 15),
(273, 7, 15),
(274, 9, 15),
(275, 6, 16),
(276, 9, 16),
(277, 2, 17),
(278, 8, 17),
(279, 10, 17),
(280, 6, 18),
(281, 9, 18);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id_order` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `payment` varchar(50) DEFAULT NULL,
  `waktu` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id_order`, `id_user`, `id_produk`, `payment`, `waktu`) VALUES
(19, 1, 2, 'bank payment', '2024-07-01 12:00:00'),
(20, 1, 3, 'bank payment', '2024-07-01 12:00:00'),
(21, 1, 4, 'bank payment', '2024-07-01 12:00:00'),
(22, 1, 6, 'bank payment', '2024-07-01 12:00:00'),
(23, 2, 1, 'direct check', '2024-07-02 13:00:00'),
(24, 2, 3, 'direct check', '2024-07-02 13:00:00'),
(25, 2, 4, 'direct check', '2024-07-02 13:00:00'),
(26, 2, 6, 'direct check', '2024-07-02 13:00:00'),
(27, 3, 2, 'paypal', '2024-07-03 14:00:00'),
(28, 3, 3, 'paypal', '2024-07-03 14:00:00'),
(29, 3, 4, 'paypal', '2024-07-03 14:00:00'),
(30, 3, 6, 'paypal', '2024-07-03 14:00:00'),
(31, 4, 1, 'bank payment', '2024-07-04 15:00:00'),
(32, 4, 7, 'bank payment', '2024-07-04 15:00:00'),
(33, 4, 8, 'bank payment', '2024-07-04 15:00:00'),
(34, 4, 9, 'bank payment', '2024-07-04 15:00:00'),
(35, 5, 1, 'direct check', '2024-07-05 16:00:00'),
(36, 5, 7, 'direct check', '2024-07-05 16:00:00'),
(37, 5, 8, 'direct check', '2024-07-05 16:00:00'),
(38, 5, 9, 'direct check', '2024-07-05 16:00:00'),
(39, 6, 2, 'paypal', '2024-07-06 17:00:00'),
(40, 6, 7, 'paypal', '2024-07-06 17:00:00'),
(41, 6, 8, 'paypal', '2024-07-06 17:00:00'),
(42, 6, 9, 'paypal', '2024-07-06 17:00:00'),
(43, 7, 1, 'bank payment', '2024-07-07 18:00:00'),
(44, 7, 10, 'bank payment', '2024-07-07 18:00:00'),
(45, 7, 11, 'bank payment', '2024-07-07 18:00:00'),
(46, 7, 12, 'bank payment', '2024-07-07 18:00:00'),
(47, 8, 2, 'direct check', '2024-07-08 19:00:00'),
(48, 8, 10, 'direct check', '2024-07-08 19:00:00'),
(49, 8, 11, 'direct check', '2024-07-08 19:00:00'),
(50, 8, 12, 'direct check', '2024-07-08 19:00:00'),
(51, 9, 3, 'paypal', '2024-07-09 20:00:00'),
(52, 9, 10, 'paypal', '2024-07-09 20:00:00'),
(53, 9, 11, 'paypal', '2024-07-09 20:00:00'),
(54, 9, 12, 'paypal', '2024-07-09 20:00:00'),
(55, 10, 4, 'bank payment', '2024-07-10 21:00:00'),
(56, 10, 13, 'bank payment', '2024-07-10 21:00:00'),
(57, 10, 14, 'bank payment', '2024-07-10 21:00:00'),
(58, 10, 15, 'bank payment', '2024-07-10 21:00:00'),
(59, 1, 7, 'direct check', '2024-07-11 22:00:00'),
(60, 1, 13, 'direct check', '2024-07-11 22:00:00'),
(61, 1, 14, 'direct check', '2024-07-11 22:00:00'),
(62, 1, 15, 'direct check', '2024-07-11 22:00:00'),
(63, 2, 8, 'paypal', '2024-07-12 23:00:00'),
(64, 2, 13, 'paypal', '2024-07-12 23:00:00'),
(65, 2, 14, 'paypal', '2024-07-12 23:00:00'),
(66, 2, 15, 'paypal', '2024-07-12 23:00:00'),
(68, 3, 16, 'bank payment', '2024-07-13 00:00:00'),
(69, 3, 17, 'bank payment', '2024-07-13 00:00:00'),
(70, 3, 18, 'bank payment', '2024-07-13 00:00:00'),
(71, 4, 10, 'direct check', '2024-07-14 01:00:00'),
(72, 4, 16, 'direct check', '2024-07-14 01:00:00'),
(73, 4, 17, 'direct check', '2024-07-14 01:00:00'),
(74, 4, 18, 'direct check', '2024-07-14 01:00:00'),
(75, 5, 11, 'paypal', '2024-07-15 02:00:00'),
(76, 5, 16, 'paypal', '2024-07-15 02:00:00'),
(77, 5, 17, 'paypal', '2024-07-15 02:00:00'),
(78, 5, 18, 'paypal', '2024-07-15 02:00:00'),
(79, 6, 12, 'bank payment', '2024-07-16 03:00:00'),
(80, 6, 13, 'bank payment', '2024-07-16 03:00:00'),
(81, 6, 14, 'bank payment', '2024-07-16 03:00:00'),
(82, 6, 15, 'bank payment', '2024-07-16 03:00:00'),
(83, 7, 16, 'direct check', '2024-07-17 04:00:00'),
(84, 7, 17, 'direct check', '2024-07-17 04:00:00'),
(85, 7, 18, 'direct check', '2024-07-17 04:00:00'),
(88, 8, 3, 'paypal', '2024-07-18 05:00:00'),
(89, 8, 4, 'paypal', '2024-07-18 05:00:00'),
(90, 8, 6, 'paypal', '2024-07-18 05:00:00'),
(91, 9, 7, 'bank payment', '2024-07-19 06:00:00'),
(92, 9, 8, 'bank payment', '2024-07-19 06:00:00'),
(93, 9, 9, 'bank payment', '2024-07-19 06:00:00'),
(95, 10, 11, 'direct check', '2024-07-20 07:00:00'),
(96, 10, 12, 'direct check', '2024-07-20 07:00:00'),
(100, 1, 16, 'paypal', '2024-07-21 08:00:00'),
(101, 1, 17, 'paypal', '2024-07-21 08:00:00'),
(102, 1, 18, 'paypal', '2024-07-21 08:00:00'),
(104, 2, 2, 'bank payment', '2024-07-22 09:00:00'),
(108, 3, 7, 'direct check', '2024-07-23 10:00:00'),
(109, 3, 8, 'direct check', '2024-07-23 10:00:00'),
(110, 3, 9, 'direct check', '2024-07-23 10:00:00'),
(112, 4, 11, 'paypal', '2024-07-24 11:00:00'),
(113, 4, 12, 'paypal', '2024-07-24 11:00:00'),
(114, 4, 13, 'paypal', '2024-07-24 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga_produk`, `file_produk`, `dev_produk`, `publ_produk`, `tgl_produk`, `desk_produk`) VALUES
(1, 'Apex Legends', 0, 'Apex Legends.jpg', 'Respawn', 'Electronic Arts', '2020-11-05', 'Apex Legends is the award-winning, free-to-play Hero Shooter from Respawn Entertainment. Master an ever-growing roster of legendary characters with powerful abilities, and experience strategic squad play and innovative gameplay in the next evolution of Hero Shooter and Battle Royale.<br><br>\r\n\r\nConquer with character in Apex Legends, a free-to-play* Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.<br><br>\r\n\r\nMaster an ever-growing roster of diverse Legends, deep-tactical squad play, and bold, new innovations that go beyond the Battle Royale experience — all within a rugged world where anything goes. Welcome to the next evolution of Hero Shooter.'),
(2, 'Counter-Strike 2', 0, 'Counter-Strike 2.jpg', 'Valve', 'Valve', '2012-08-22', 'For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.<br><br>\r\n\r\nFor over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2.<br><br>\r\n\r\nA free upgrade to CS:GO, Counter-Strike 2 marks the largest technical leap in Counter-Strike’s history. Built on the Source 2 engine, Counter-Strike 2 is modernized with realistic physically-based rendering, state of the art networking, and upgraded Community Workshop tools.<br><br>\r\n\r\nIn addition to the classic objective-focused gameplay that Counter-Strike pioneered in 1999, Counter-Strike 2 features:<br><br>\r\n\r\n-All-new CS Ratings with the updated Premier mode<br>\r\n-Global and Regional leaderboards<br>\r\n-Upgraded and overhauled maps<br>\r\n-Game-changing dynamic smoke grenades<br>\r\n-Tick-rate-independent gameplay<br>\r\n-Redesigned visual effects and audio<br>\r\n-All items from CS:GO moving forward to CS2'),
(3, 'Destiny 2', 0, 'Destiny 2.jpg', 'Bungie', 'Bungie', '2019-10-01', 'Destiny 2 is an action MMO with a single evolving world that you and your friends can join anytime, anywhere, absolutely free.<br><br>\r\n\r\nDive into the world of Destiny 2 to explore the mysteries of the solar system and experience responsive first-person shooter combat. Unlock powerful elemental abilities and collect unique gear to customize your Guardian\'s look and playstyle. Enjoy Destiny 2’s cinematic story, challenging co-op missions, and a variety of PvP modes alone or with friends. Download for free today and write your legend in the stars.<br><br>\r\n\r\nAn Immersive Story:<br><br>\r\nYou are a Guardian, defender of the Last City of humanity in a solar system under siege by infamous villains. Look to the stars and stand against the darkness. Your legend begins now.<br><br>\r\n\r\nGuardian Classes:<br><br>\r\nChoose from the armored Titan, mystic Warlock, or swift Hunter.<br><br>\r\n\r\nTitan<br>\r\nDisciplined and proud, Titans are capable of both aggressive assaults and stalwart defenses. Set your hammer ablaze, crack the sky with lightning, and go toe-to-toe with any opponent. Your team will stand tall behind the strength of your shield.<br><br>\r\n\r\nWarlock<br>\r\nWarlocks weaponize the mysteries of the universe to sustain themselves and destroy their foes. Rain devastation on the battlefield and clear hordes of enemies in the blink of an eye. Those who stand with you will know the true power of the Light.<br><br>\r\n\r\nHunter<br>\r\nAgile and daring, Hunters are quick on their feet and quicker on the draw. Fan the hammer of your golden gun, flow through enemies like the wind, or strike from the darkness. Find the enemy, take aim, and end the fight before it starts.\r\nCooperative and Competitive Multiplayer\r\nPlay with or against your friends and other Guardians in various PvE and PvP game modes.<br><br>\r\n\r\nCooperative Multiplayer:<br><br>\r\nExciting co-op adventures teeming await with rare and powerful rewards. Dive into the story with missions, quests, and patrols. Put together a small fireteam and secure the chest at the end of a quick Strike. Or test your team\'s skill with countless hours of raid progression – the ultimate challenge for any fireteam. You decide where your legend begins.<br><br>\r\n\r\nCompetitive Multiplayer<br>\r\nFace off against other players in fast-paced free-for-all skirmishes, team arenas, and PvE/PvP hybrid competitions. Mark special competitions like Iron Banner on your calendar and collect limited-time rewards before they\'re gone.<br><br>\r\n\r\nExotic Weapons and Armor:<br><br>\r\nThousands of weapons, millions of options. Discover new gear combinations and define your own personal style. The hunt for the perfect arsenal begins.'),
(4, 'Dragon\'s Dogma 2', 1043999, 'Dragon\'s Dogma 2.jpg', 'Capcom', 'Capcom', '2024-03-22', 'Dragon’s Dogma 2 is a single player, narrative driven action-RPG that challenges the players to choose their own experience – from the appearance of their Arisen, their vocation, their party, how to approach different situations and more - in a truly immersive fantasy world.<br><br>\r\n\r\nSet forth on your grand adventure, Arisen!<br><br>\r\n\r\nDragon’s Dogma is a single player, narrative driven action-RPG series that challenges the players to choose their own experience – from the appearance of their Arisen, their vocation, their party, how to approach different situations and more. Now, in this long-awaited sequel, the deep, explorable fantasy world of Dragon’s Dogma 2 awaits.<br><br>\r\n\r\nOn your journey, you’ll be joined by Pawns, mysterious otherworldly beings, in an adventure so unique you will feel as if accompanied by other players while on your own adventure.<br><br>\r\n\r\nAll of these elements are elevated further through physics technology, artificial intelligence (AI) and the latest in graphics, to create a truly immersive fantasy world in Dragon’s Dogma 2.<br><br>\r\n\r\nAction that challenges your creativity<br>\r\n\r\nWield swords, bows, and chant magick.\r\nThe vocations in Dragon\'s Dogma 2 give you the ability to approach combat the way you want.<br><br>\r\n\r\nCompany in your single-player experience<br>\r\n\r\nPlayers can customize their own main Pawn, who will always accompany your Arisen, and enter a covenant with up to 2 additional Pawns from other players through the network.<br><br>\r\n\r\nFacing the monsters in this world<br>\r\n\r\nBeyond the town borders, you will encounter diverse monsters that inhabit the lands.\r\nYou will need to decide between engaging in battles or finding alternatives;\r\nso be aware of your party’s setup, the terrain around you, and the monsters you face.<br><br>\r\n\r\nInhabitants of this world<br>\r\n\r\nTravelers, merchants, soldiers and other folk go about their daily lives.\r\nPreoccupied by their own objectives and motives, they all exhibit different emotions.\r\nAt times, they may lead you to a quest by approaching you and asking for a favor.'),
(6, 'EA SPORTS FC™ 24', 759000, 'EA SPORTS FC™ 24.jpg', 'Electronic Arts', 'Electronic Arts', '2023-09-28', 'EA SPORTS FC™ 24 welcomes you to The World’s Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and an enhanced Frostbite™ Engine.\r\n'),
(7, 'HELLDIVERS', 579000, 'HELLDIVERS.jpg', 'Arrowhead Game Studios', 'PlayStation Publishing LLC', '2024-02-08', 'The Galaxy’s Last Line of Offence. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.<br><br>\r\n\r\nThe Galaxy’s Last Line of Offence.<br><br>\r\n\r\nEnlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.<br><br>\r\n\r\n\r\nURGENT BROADCAST – SUPER EARTH ARMED FORCES<br>\r\nFreedom. Peace. Democracy.\r\nYour Super Earth-born rights. The key pillars of our civilization.\r\nOf our very existence.\r\nBut the war rages on. And everything is once again under threat.\r\nJoin the greatest military force the galaxy has ever seen and make this a safe and free place to live.<br><br>\r\n\r\n\r\nBECOME A LEGEND<br>\r\nYou will be assembled into squads of up to four Helldivers and assigned strategic missions.\r\nWatch each other’s back – friendly fire is an unfortunate certainty of war, but victory without teamwork is impossible.<br><br>\r\n\r\n\r\nLOADOUTS<br>\r\nRain down freedom from above, sneak through enemy territory, or grit your teeth and charge head-first into the jaws of combat.\r\nHow you deliver liberty is your choice; you’ll have access to a wide array of explosive firepower, life-saving armor and battle-changing stratagems… the jewel in every Helldiver’s arsenal.<br><br>\r\n\r\n\r\nREQUISITION<br>\r\nSuper Earth recognises your hard work with valuable Requisition. Use it to access different rewards that benefit you, your squad, your destroyer ship and our overall war effort.<br><br>\r\n\r\n\r\n\r\nTHREATS<br>\r\nEverything on every planet wants you dead. That’s what we’re dealing with.\r\nEach enemy has distinct and unpredictable characteristics, tactics, and behavior – but they all fight ferociously and without fear or morality.<br><br>\r\n\r\n\r\nTHE GALACTIC WAR<br>\r\nCapturing enemy planets, defending against invasions, and completing missions will contribute to our overall effort.<br><br>\r\n\r\n\r\nThis war will be won or lost depending on the actions of everyone involved.<br><br>\r\n\r\nWe stand together, or we fall apart.'),
(8, 'Horizon Forbidden West', 879000, 'Horizon Forbidden West.jpg', 'Guerrilla Games', 'PlayStation Publishing LLC', '2024-03-21', 'Experience the epic Horizon Forbidden West™ in its entirety with bonus content and the Burning Shores expansion included. The Burning Shores add-on contains additional content for Aloy’s adventure, including new storylines, characters, and experiences in a stunning yet hazardous new area.<br><br>\r\n\r\nJoin Aloy as she braves a majestic but dangerous new frontier that holds mysterious new threats. This Complete Edition allows you to enjoy the critically acclaimed Horizon Forbidden West on PC in its entirety with bonus content, including the Burning Shores story expansion that picks up after the main game.<br><br>\r\n\r\nExplore distant lands, fight bigger and more awe-inspiring machines, and encounter astonishing new tribes as you return to the far-future, post-apocalyptic world of Horizon.<br><br>\r\n\r\nThe land is dying. Vicious storms and an unstoppable blight ravage the scattered remnants of humanity while fearsome new machines prowl their borders, and life on Earth is hurtling toward another extinction.<br><br>\r\n\r\nIt\'s up to Aloy to uncover the secrets behind these threats and restore order and balance to the world. Along the way, she must reunite with old friends, forge alliances with warring new factions and unravel the legacy of the ancient past.<br><br>\r\n\r\nSee every gameplay detail with Ultrawide 21:9 and Super Ultrawide 32:9 resolutions, as well as 48:9 triple monitor support.*<br><br>\r\nWitness the Forbidden West coming to life, with NVIDIA DLSS 3 upscaling and frame generation, image enhancing NVIDIA DLAA and latency reducing NVIDIA Reflex. AMD FSR and Intel XeSS are also supported.**<br><br>\r\nCustomize graphic settings to your preference, with the potential for unlocked frame rates.**<br><br>\r\nTake control with full support for the DualSense™ controller, including haptic feedback and adaptive trigger functionality.***'),
(9, 'Millenia', 428999, 'Millenia.jpg', 'C Prompt Games', 'Paradox Interactive', '2024-03-26', 'Create your own nation in Millennia, a historical turn-based 4X game that challenges your strategic prowess across 10,000 years of history, from the dawn of humanity to our possible futures.<br><br>\r\n\r\nCreate your own nation in Millennia, a historical turn-based 4X game that challenges your strategic prowess across 10,000 years of history, from the dawn of humanity to our possible futures. Set the course of history and experience different timelines in every playthrough as you write an epic story through your actions. Lead your people through times of crisis and ages of discovery, face great challenges and opportunities, and build a civilization that prospers through the ages.<br><br>\r\n\r\nDictate the course of history across ten ages, from the first cities to space travel. Accomplish certain objectives and you can move time into a Variant Age - an alternate history with new rules, new technologies, and new units. But beware Crisis Ages; following a path of chaos and disorder may plunge the world into a future filled with war, sickness or ignorance. Then again, a wise ruler can always turn a crisis into an opportunity.... Choose the path with care, as the ages you pass through will have a lasting impact on your people and the world.<br><br>\r\n\r\nCustomize your nation by adopting unique Nations Spirits over the course of your game. Will you be a nation of warriors or explorers? Are your people lead by a Great Khan or a builder of monuments? Are you known for defining pop culture or for dominating global finance? What parts of your culture will reverberate across history?<br><br>\r\n\r\nManage your economy with care and create a juggernaut of growth and construction. Start with basic resources to gain food, wealth, and production. As your advance, decide how to best convert these simple goods into more valuable products through research and improvements. Specialize your regions, turning iron into weapons or tools, wood into paper or lumber, gold into coin or jewelry. Ship surplus goods where they are needed, allowing the breadbasket of your empire to feed far-flung colonies or your industrial heartland to supply troops near your enemy.<br><br>\r\n\r\nPursue knowledge to research scientific and cultural advances, unlocking new units, buildings, and improvements to grow your cities or strengthen your armies. Research Defense to train the first archers, Smelting to master iron production, or Guilds for making wine. Variant and Crisis Ages feature unique alternatives, introducing everything from Cloud Estates in the Age of Aether to underwater cities in the Age of Utopia.<br><br>\r\n\r\nAchieve your ultimate success through a Victory Age. Toward the end of the game (or earlier if your strategy is sound), dominance allows a nation to dictate the winning conditions. The rest of the world must decide if they will struggle to achieve victory before the leader ... or oppose the leader\'s attempt. Risk everything to take victory in the Renaissance or carefully plan for triumph in the modern era.'),
(10, 'Outpost Infinity Siege', 206999, 'Outpost Infinity Siege.jpg', 'Team Ranger', 'Lightning Games', '2024-03-26', 'Command Mobile Outpost and take XEN Firearm to venture deep into the Signet surveillance off-limit area. Collect unique Weapon Units. Amp up the firepower of the Outpost that fights with you. This is an FTD game - FPS, Tower Defense, Base Building and much more all at the same time.<br><br>\r\n\r\nOutpost Building<br>\r\nExplore the world, gather resources, merge and upgrade outpost units to build your own outpost.<br><br>\r\n\r\nUnique Weapon<br>\r\nFully exploit the value of the unique XEN Firearm with different protoslag attributes, and utilize ammunition with diverse performance.<br><br>\r\n\r\nLoot & Farm<br>\r\nEnjoy the abundant difficulty levels, diverse gameplay features, and distinctive maps of the exploration mode. Venture deep into the brand new zones full of hazards and opportunities, and harvest powerful outpost units.<br><br>\r\n\r\nCo-op Feature<br>\r\nFight alongside friends on Recovery Day, or strive together to survive infinite waves of monsters in Endless mode till the last moment.'),
(11, 'PUBG Battlegrounds', 0, 'PUBG Battlegrounds.jpg', 'KRAFTON, Inc.', 'KRAFTON, Inc.', '2017-12-21', 'Play PUBG: BATTLEGROUNDS for free. Land on strategic locations, loot weapons and supplies, and survive to become the last team standing across various, diverse Battlegrounds. Squad up and join the Battlegrounds for the original Battle Royale experience that only PUBG: BATTLEGROUNDS can.<br><br>\r\n\r\nLAND, LOOT, SURVIVE!<br><br>\r\nPlay PUBG: BATTLEGROUNDS for free.\r\nLand on strategic locations, loot weapons and supplies, and survive to become the last team standing across various, diverse Battlegrounds.\r\nSquad up and join the Battlegrounds for the original Battle Royale experience that only PUBG: BATTLEGROUNDS can offer.<br><br>\r\n\r\nThis content download will also provide access to the BATTLEGROUNDS Test Server, which requires a separate download to play. \r\nOptional in-game purchases available.'),
(12, 'SOUTH PARK SNOW DAY!', 245999, 'SOUTH PARK SNOW DAY!.jpg', 'Question', 'THQ Nordic', '2024-03-26', 'Play as the New kid in South Park and join Cartman, Stan, Kyle, and Kenny, in three-dimensional glory, to celebrate the most magical day in any young child’s life - a snow day!<br><br>\r\n\r\nFrom South Park Digital Studios, the studio that brought you South Park: The Stick of Truth, South Park: The Fractured but Whole, and South Park: Phone Destroyer comes the next chapter in the journey of the New Kid.<br><br>\r\n\r\nJoin Cartman, Stan, Kyle, and Kenny, in three-dimensional glory, to celebrate the most magical day in any young child’s life - a snow day! A massive blizzard has thrown the town into chaos and, more importantly, canceled school.<br><br>\r\n\r\nPlay with up to three friends, use matchmaking, or solo the game with ally bots and battle through the snow-piled town of South Park. Engage in frenetic, action-packed combat against warring factions in an all-new story where you make the rules. Equip unique weapons and deploy devastating, upgradable special abilities on a new adventure to save the world and enjoy a day without school.<br><br>\r\n\r\nIt’s a snow day, dude!<br><br>\r\n\r\nBattle your way through the snow-covered town of South Park in this all-new 3D co-op game.<br><br>\r\nA blizzard of epic proportions has blanketed the town of South Park and it’s up to Cartman, Stan, Kenny, Kyle, and you, as the New Kid, to save the town from an endless winter.<br><br>\r\nExperience cooperative gameplay for the first time ever in a South Park game with up to three friends or ally bots - unleashing powerful, coordinated attacks on your foes.<br><br>\r\nEquip and upgrade devastating melee and ranged weapons. Deploy special abilities and powers that will bring hordes of enemies and epic bosses to their knees.<br><br>\r\nUse a wide range of iconic cosmetics and customize your New Kid with endless possible combinations from beanies to Cheesy Poof T-shirts to chin balls.'),
(13, 'Tom Clancy\'s Rainbow Six® Siege', 229000, 'Tom Clancy\'s Rainbow Six® Siege.jpg', 'Ubisoft Montreal', 'Ubisoft', '2015-12-02', 'Tom Clancy\'s Rainbow Six® Siege is an elite, tactical team-based shooter where superior planning and execution triumph.<br><br>\r\n\r\n“One of the best first-person shooters ever made. 10\\10” – GameSpot<br><br>\r\n\r\nTom Clancy\'s Rainbow Six® Siege is an elite, realistic, tactical team-based shooter where superior planning and execution triumph. It features 5v5 attack vs. defense gameplay and intense close-quarters combat in destructible environments.<br><br>\r\n\r\nEngage in a brand-new style of assault using an unrivaled level of destruction and gadgetry.\r\nOn defense, coordinate with your team to transform your environments into strongholds. Trap, fortify and create defensive systems to prevent being breached by the enemy.\r\nOn attack, lead your team through narrow corridors, barricaded doorways and reinforced walls. Combine tactical maps, observation drones, rappelling and more to plan, attack and defuse every situation.<br><br>\r\n\r\nChoose from dozens of highly trained, Special Forces operators from around the world. Deploy the latest technology to track enemy movement. Shatter walls to open new lines of fire. Breach ceilings and floors to create new access points. Employ every weapon and gadget from your deadly arsenal to locate, manipulate and destroy your enemies and the environment around them.<br><br>\r\n\r\nExperience new strategies and tactics as Rainbow Six Siege evolves over time. Change the rules of Siege with every update that includes new operators, weapons, gadgets and maps. Evolve alongside the ever-changing landscape with your friends and become the most experienced and dangerous operators out there.<br><br>\r\n\r\nCompete against others from around the world in ranked match play. Grab your best squad and join the competitive community in weekly tournaments or watch the best professional teams battle it out in the Rainbow Six Siege Pro League.'),
(14, 'Street Fighter™ 6', 415499, 'Street Fighter™ 6.png', 'CAPCOM Co., Ltd.', 'CAPCOM Co., Ltd.', '2023-06-01', 'Here comes Capcom’s newest challenger! Street Fighter™ 6 launches worldwide on June 2nd, 2023 and represents the next evolution of the Street Fighter™ series! Street Fighter 6 spans three distinct game modes, including World Tour, Fighting Ground and Battle Hub.<br><br>\r\n\r\nHere comes Capcom’s newest challenger! Street Fighter™ 6 launches worldwide on June 2nd, 2023 and represents the next evolution of the series.<br><br>\r\n\r\nPowered by Capcom’s proprietary RE ENGINE, the Street Fighter 6 experience spans across three distinct game modes featuring World Tour, Fighting Ground and Battle Hub.<br><br>\r\n\r\nDiverse Roster of 18 Fighters<br>\r\nPlay legendary masters and new fan favorites like Ryu, Chun-Li, Luke, Jamie, Kimberly and more in this latest edition with each character featuring striking new redesigns and exhilarating cinematic specials.<br><br>\r\n\r\nDominate the Fighting Ground<br>\r\nStreet Fighter 6 offers a highly evolved combat system with three control types - Classic, Modern and Dynamic - allowing you to quickly play to your skill level.\r\nThe new Real Time Commentary Feature adds all the hype of a competitive match as well as easy-to-understand explanations about your gameplay.\r\nThe Drive Gauge is a new system to manage your resources. Use it wisely in order to claim victory.<br><br>\r\n\r\nExplore the Streets in World Tour<br>\r\nDiscover the meaning of strength in World Tour, an immersive, single-player story mode. Take your avatar and explore Metro City and beyond. Meet Masters who will take you under their wing and teach you their style and techniques.<br><br>\r\n\r\nSeek Rivals in the Battle Hub<br>\r\nThe Battle Hub represents a core mode of Street Fighter 6 where players can gather and communicate, and become stronger together. Use the avatar you create in World Tour to check out cabinets on the Battle Hub floor and play against other players, or head over to the Game Center to enjoy some of Capcom\'s classic arcade games.<br><br>\r\n\r\nYour path to becoming a World Warrior starts here.<br><br>\r\n\r\nOnline Play<br>\r\nCapcom provides various online services for this game, including online-only content.<br>\r\n\r\n* Certain elements of this game cannot be accessed without an internet connection.<br>\r\n* A Capcom ID is required to use online-only content.<br>\r\n* For information on the services related to Capcom ID and how to use it, please visit the official Capcom ID website https://cid.capcom.com/. Please note that there may be cases wherein use of Capcom ID is age-restricted.<br>\r\n* Capcom may temporarily suspend online services in the event of unforeseen circumstances.'),
(15, 'TEKKEN 8', 699000, 'TEKKEN 8.jpg', 'Bandai Namco Studios Inc.', 'Bandai Namco Entertainment', '2024-01-26', 'GET READY FOR THE NEXT CHAPTER IN THE LEGENDARY FIGHTING GAME FRANCHISE, TEKKEN 8.<br><br>\r\n\r\n• 32 FIGHTERS FOR A NEW GENERATION<br>\r\nCompletely redesigned character visuals. Elaborate, highly-detailed models built from the ground and high-fidelity graphics break the limits of new-generation hardware by adding a new weight and atmosphere to TEKKEN’s signature battles. Vivid environments and destructible stages combine to create an overwhelming sense of immersion, creating the ultimate play experience.<br><br>\r\n\r\n• NEW GAME, NEW RIVALRY<br>\r\nFist Meets Fate in TEKKEN 8. Holding a record for the longest-running video game storyline, the TEKKEN series begins a new chapter as TEKKEN 8 continues the tragic saga of the Mishima and Kazama bloodlines, and their world-shaking father-and-son grudge matches starting from 6 months after the closure of the last match. The story of Jin Kazama\'s growth and determination marks a new chapter in the timeless saga.<br><br>\r\n\r\n• THRILLING OVER-THE-TOP BATTLES EMBODYING AGGRESSIVENESS & DESTRUCTION\r\n<br>The new battle system, Heat, dials up the aggressive nature of battles, while maintaining the play feel and tactics unique to the TEKKEN series. The intensity of battles is greatly enhanced by the destructable stages. Unleashing super move-like Rage Arts is sure to enthrall both players and spectators alike. All of these hard-hitting mechanics come together to make TEKKEN 8 the most exciting installment in the series to date!<br><br>\r\n\r\n• ENJOY YOUR TEKKEN LIFE!<br>\r\nIn the new single-player mode Arcade Quest, craft your own unique avatar and embark on your new TEKKEN life. Battle your way through a variety of rivals across multiple arcades as the story unfolds, all while mastering the basics and practical skills in TEKKEN 8. Unlock a variety of customization items for characters and avatars as you progress.'),
(16, 'Cuphead', 95199, 'Cuphead.jpg', 'Studio MDHR Entertainment Inc.', 'Studio MDHR Entertainment Inc.', '2017-09-29', 'Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era, i.e. traditional hand drawn cel animation, watercolor backgrounds, and original jazz recordings.<br><br>\r\n\r\nCuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era, i.e. traditional hand drawn cel animation, watercolor backgrounds, and original jazz recordings.<br><br>\r\n\r\nPlay as Cuphead or Mugman (in single player or local co-op) as you traverse strange worlds, acquire new weapons, learn powerful super moves, and discover hidden secrets while you try to pay your debt back to the devil!'),
(17, 'Mortal Kombat 1', 849000, 'Mortal Kombat 1.jpg', 'NetherRealm Studios', 'Warner Bros. Games', '2023-09-19', 'Discover a reborn Mortal Kombat™ Universe created by the Fire God Liu Kang. Mortal Kombat™ 1 ushers in a new era of the iconic franchise with a new fighting system, game modes, and fatalities!<br><br>\r\n\r\nIt’s In Our Blood!<br>\r\nDiscover a reborn Mortal Kombat™ Universe created by the Fire God Liu Kang.<br><br>\r\n\r\nNew Origins<br>\r\nReflecting Fire God Liu Kang’s vision of perfection, Mortal Kombat 1’s brand new universe is familiar, yet radically altered.<br><br>\r\n\r\nInvasions<br>\r\nInvasions is a dynamic single player campaign with a variety of distinct challenges. With built in progression and RPG mechanics, mixed with MK1’s incredible fighting action, Invasions provides deep, and engaging challenges, and a ton of rewards along the way.<br><br>\r\n\r\nKameos<br>\r\nKameos dramatically enhance every fight, assisting teammates with their own Special Moves, Throws and defensive Breakers.'),
(18, 'Enter the Gungeon', 130999, 'Enter the Gungeon.jpg', 'Dodge Roll', 'Devolver Digital', '2016-04-05', 'Enter the Gungeon is a bullet hell dungeon crawler following a band of misfits seeking to shoot, loot, dodge roll and table-flip their way to personal absolution by reaching the legendary Gungeon’s ultimate treasure: the gun that can kill the past.<br><br>\r\n\r\nEnter the Gungeon is a bullet hell dungeon crawler following a band of misfits seeking to shoot, loot, dodge roll and table-flip their way to personal absolution by reaching the legendary Gungeon’s ultimate treasure: the gun that can kill the past. Select a hero [or team up in co-op] and battle your way to the bottom of the Gungeon by surviving a challenging and evolving series of floors filled with the dangerously adorable Gundead and fearsome Gungeon bosses armed to the teeth. Gather precious loot, discover hidden secrets, and chat with opportunistic merchants and shopkeepers to purchase powerful items to gain an edge.<br><br>\r\n\r\nThe Gungeon: Enter the Gungeon – a constantly evolving bullet hell fortress that elegantly blends meticulously hand-designed rooms within a procedurally-generated labyrinth bent on destroying all that enter its walls. But beware – the Gungeon responds to even the most modest victory against its sentries and traps by raising the stakes and the challenges found within!<br><br>\r\n\r\nThe Cult of the Gundead: The Gungeon isn’t just traps and chasms – calm your nerves and steady your aim as you face down the gun-totting Cult of the Gundead. These disciples of the gun will stop at nothing to put down the heroes in their tracks and employ any tactics necessary to defend their temple.<br><br>\r\n\r\nThe Gungeoneers: Choose between one of several unlikely heroes, each burdened by a deep regret and in search of a way to change their past, no matter the cost. Filled with equal parts courage and desperation, these adventurers won’t hesitate to dive across flaming walls, roll through a wall of bullets, or take cover behind whatever is around to make it to their goal alive!<br><br>\r\n\r\nThe Guns: Discover and unlock scores of uniquely fantastic guns to annihilate all that oppose you in the Gungeon – each carrying their own unique tactics and ammunition. Unleash everything from the tried and true medley of missiles, lasers, and cannonballs to the bizarrely effective volley of rainbows, fish, foam darts, and bees! Yep, bees.<br><br>\r\n\r\nThe Enter the Gungeon: Collector\'s Edition includes the game, the soundtrack, the digital comic, and an instant unlock of the Microtransaction Gun. Owners of the base game can upgrade to the Collector\'s Edition for the difference in price.');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `tanggal` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id_review`, `id_produk`, `id_user`, `rating`, `review`, `tanggal`) VALUES
(193, 1, 1, 5, 'Excellent product, highly recommend!', '2024-07-01'),
(194, 2, 1, 4, 'Very good, but has some minor issues.', '2024-07-01'),
(195, 3, 1, 3, 'Average experience, could be improved.', '2024-07-01'),
(196, 4, 1, 2, 'Not what I expected, quite disappointed.', '2024-07-01'),
(197, 6, 1, 5, 'Perfect, exceeded my expectations!', '2024-07-01'),
(198, 7, 1, 1, 'Terrible, I would not recommend.', '2024-07-01'),
(199, 8, 1, 4, 'Good value for the price.', '2024-07-01'),
(200, 9, 1, 3, 'Decent, but not great.', '2024-07-01'),
(201, 10, 1, 2, 'Below average, expected better.', '2024-07-01'),
(202, 11, 1, 5, 'Fantastic quality, will buy again!', '2024-07-01'),
(203, 12, 1, 3, 'It’s okay, nothing special.', '2024-07-01'),
(204, 13, 1, 4, 'Very nice, but there is room for improvement.', '2024-07-01'),
(205, 14, 1, 1, 'Awful, I’m very unhappy with this.', '2024-07-01'),
(206, 15, 1, 5, 'Outstanding! Highly recommended.', '2024-07-01'),
(207, 16, 1, 2, 'Disappointing, will not purchase again.', '2024-07-02'),
(208, 17, 1, 4, 'Good, but could be better.', '2024-07-02'),
(209, 18, 1, 3, 'It’s alright, not amazing.', '2024-07-02'),
(210, 1, 2, 5, 'Excellent quality, worth every penny.', '2024-07-02'),
(211, 2, 2, 4, 'Very good, satisfied with the purchase.', '2024-07-02'),
(212, 3, 2, 3, 'It’s okay, but I expected more.', '2024-07-02'),
(213, 4, 2, 2, 'Not up to the mark, quite dissatisfied.', '2024-07-02'),
(214, 6, 2, 5, 'Superb product, I am thrilled!', '2024-07-02'),
(215, 7, 2, 1, 'Horrible experience, do not buy!', '2024-07-02'),
(216, 8, 2, 4, 'Good overall, with minor issues.', '2024-07-02'),
(217, 9, 2, 3, 'Mediocre, expected better quality.', '2024-07-02'),
(218, 10, 2, 2, 'Subpar product, not worth the money.', '2024-07-02'),
(219, 11, 2, 5, 'Amazing product, will buy again!', '2024-07-02'),
(220, 12, 2, 3, 'It’s fine, but not impressive.', '2024-07-02'),
(221, 13, 2, 4, 'Pretty good, some minor flaws.', '2024-07-02'),
(222, 14, 2, 1, 'Very bad, would not recommend.', '2024-07-02'),
(223, 15, 2, 5, 'Incredible product, highly recommend.', '2024-07-02'),
(224, 16, 2, 2, 'Unsatisfactory, I am not pleased.', '2024-07-02'),
(225, 17, 2, 4, 'Quite good, but there’s room for improvement.', '2024-07-02'),
(226, 18, 2, 3, 'Satisfactory, but could be better.', '2024-07-02'),
(227, 1, 3, 5, 'Perfect product, I’m very happy!', '2024-07-02'),
(228, 2, 3, 4, 'Very good quality, though not perfect.', '2024-07-02'),
(229, 3, 3, 3, 'It’s okay, but nothing extraordinary.', '2024-07-02'),
(230, 4, 3, 2, 'Disappointing product, needs improvement.', '2024-07-02'),
(231, 6, 3, 5, 'Outstanding, exceeded my expectations.', '2024-07-03'),
(232, 7, 3, 1, 'Very poor, wouldn’t recommend.', '2024-07-03'),
(233, 8, 3, 4, 'Good quality, some minor issues.', '2024-07-03'),
(234, 9, 3, 3, 'Decent, but expected better.', '2024-07-03'),
(235, 10, 3, 2, 'Not worth the price, quite bad.', '2024-07-03'),
(236, 11, 3, 5, 'Amazing quality, will purchase again.', '2024-07-03'),
(237, 12, 3, 3, 'It’s alright, not too impressive.', '2024-07-03'),
(238, 13, 3, 4, 'Nice product, but has some flaws.', '2024-07-03'),
(239, 14, 3, 1, 'Terrible, very disappointed.', '2024-07-03'),
(240, 15, 3, 5, 'Exceptional product, highly recommended!', '2024-07-03'),
(241, 16, 3, 2, 'Very bad, won’t buy again.', '2024-07-03'),
(242, 17, 3, 4, 'Good, but needs improvements.', '2024-07-03'),
(243, 18, 3, 3, 'Average product, not impressive.', '2024-07-03'),
(244, 1, 4, 5, 'Fantastic product, very happy with it.', '2024-07-03'),
(245, 2, 4, 4, 'Good quality, but not perfect.', '2024-07-03'),
(246, 3, 4, 3, 'Okay product, could be better.', '2024-07-03'),
(247, 4, 4, 2, 'Not great, quite disappointing.', '2024-07-03'),
(248, 6, 4, 5, 'Superb, exceeded all my expectations!', '2024-07-03'),
(249, 7, 4, 1, 'Very poor quality, do not buy.', '2024-07-03'),
(250, 8, 4, 4, 'Good value, with some issues.', '2024-07-03'),
(251, 9, 4, 3, 'Mediocre, expected better quality.', '2024-07-03'),
(252, 10, 4, 2, 'Subpar, not worth the cost.', '2024-07-03'),
(253, 11, 4, 5, 'Outstanding, highly recommended!', '2024-07-03'),
(254, 12, 4, 3, 'It’s okay, but not impressive.', '2024-07-03'),
(255, 13, 4, 4, 'Pretty good, but room for improvement.', '2024-07-04'),
(256, 14, 4, 1, 'Terrible, very unsatisfactory.', '2024-07-04'),
(257, 15, 4, 5, 'Exceptional quality, will purchase again!', '2024-07-04'),
(258, 16, 4, 2, 'Very disappointing, will not buy again.', '2024-07-04'),
(259, 17, 4, 4, 'Quite good, but needs some tweaks.', '2024-07-04'),
(260, 18, 4, 3, 'Average, not very impressive.', '2024-07-04'),
(261, 1, 5, 5, 'Excellent, will definitely recommend!', '2024-07-04'),
(262, 2, 5, 4, 'Very good, but not perfect.', '2024-07-04'),
(263, 3, 5, 3, 'It’s alright, but could be better.', '2024-07-04'),
(264, 4, 5, 2, 'Disappointing, needs improvement.', '2024-07-04'),
(265, 6, 5, 5, 'Fantastic quality, I’m thrilled!', '2024-07-04'),
(266, 7, 5, 1, 'Very poor, do not purchase.', '2024-07-04'),
(267, 8, 5, 4, 'Good quality, some minor flaws.', '2024-07-04'),
(268, 9, 5, 3, 'Mediocre, expected better quality.', '2024-07-04'),
(269, 10, 5, 2, 'Subpar, not worth the price.', '2024-07-04'),
(270, 11, 5, 5, 'Incredible quality, will buy again!', '2024-07-04'),
(271, 12, 5, 3, 'It’s okay, but not great.', '2024-07-04'),
(272, 13, 5, 4, 'Nice product, but has some issues.', '2024-07-04'),
(273, 14, 5, 1, 'Terrible experience, wouldn’t recommend.', '2024-07-04'),
(274, 15, 5, 5, 'Outstanding, highly recommend!', '2024-07-04'),
(275, 16, 5, 2, 'Very bad, won’t buy again.', '2024-07-04'),
(276, 17, 5, 4, 'Quite good, but could be better.', '2024-07-04'),
(277, 18, 5, 3, 'Satisfactory, but nothing extraordinary.', '2024-07-04'),
(278, 1, 6, 5, 'Excellent, very happy with this purchase!', '2024-07-04'),
(279, 2, 6, 4, 'Very good, though not perfect.', '2024-07-05'),
(280, 3, 6, 3, 'It’s okay, but could be better.', '2024-07-05'),
(281, 4, 6, 2, 'Disappointing product, needs work.', '2024-07-05'),
(282, 6, 6, 5, 'Superb, exceeded all expectations.', '2024-07-05'),
(283, 7, 6, 1, 'Horrible, do not buy this.', '2024-07-05'),
(284, 8, 6, 4, 'Good quality, some minor issues.', '2024-07-05'),
(285, 9, 6, 3, 'Mediocre, expected better quality.', '2024-07-05'),
(286, 10, 6, 2, 'Subpar product, not worth the cost.', '2024-07-05'),
(287, 11, 6, 5, 'Fantastic, will definitely buy again.', '2024-07-05'),
(288, 12, 6, 3, 'It’s alright, not very impressive.', '2024-07-05'),
(289, 13, 6, 4, 'Nice, but has some flaws.', '2024-07-05'),
(290, 14, 6, 1, 'Terrible, very disappointing.', '2024-07-05'),
(291, 15, 6, 5, 'Exceptional product, highly recommended!', '2024-07-05'),
(292, 16, 6, 2, 'Very bad experience, will not buy again.', '2024-07-05'),
(293, 17, 6, 4, 'Quite good, but needs some improvement.', '2024-07-05'),
(294, 18, 6, 3, 'Satisfactory, but not exceptional.', '2024-07-05'),
(295, 1, 7, 5, 'Excellent quality, very pleased.', '2024-07-05'),
(296, 2, 7, 4, 'Very good, but could be improved.', '2024-07-05'),
(297, 3, 7, 3, 'Okay product, expected more.', '2024-07-05'),
(298, 4, 7, 2, 'Disappointing, needs significant improvement.', '2024-07-05'),
(299, 6, 7, 5, 'Superb product, exceeded my expectations.', '2024-07-05'),
(300, 7, 7, 1, 'Very poor quality, do not buy.', '2024-07-05'),
(301, 8, 7, 4, 'Good value, with some issues.', '2024-07-05'),
(302, 9, 7, 3, 'Mediocre, could be better.', '2024-07-05'),
(303, 10, 7, 2, 'Not worth the price, very disappointing.', '2024-07-06'),
(304, 11, 7, 5, 'Amazing quality, will buy again!', '2024-07-06'),
(305, 12, 7, 3, 'It’s okay, but not very impressive.', '2024-07-06'),
(306, 13, 7, 4, 'Nice product, but has some flaws.', '2024-07-06'),
(307, 14, 7, 1, 'Terrible, do not recommend.', '2024-07-06'),
(308, 15, 7, 5, 'Outstanding product, highly recommended!', '2024-07-06'),
(309, 16, 7, 2, 'Very bad, won’t purchase again.', '2024-07-06'),
(310, 17, 7, 4, 'Quite good, but needs improvement.', '2024-07-06'),
(311, 18, 7, 3, 'Satisfactory, but nothing special.', '2024-07-06'),
(312, 1, 8, 5, 'Fantastic product, very satisfied.', '2024-07-06'),
(313, 2, 8, 4, 'Good quality, though not perfect.', '2024-07-06'),
(314, 3, 8, 3, 'Okay, but could be better.', '2024-07-06'),
(315, 4, 8, 2, 'Disappointing, needs work.', '2024-07-06'),
(316, 6, 8, 5, 'Superb, exceeded all expectations.', '2024-07-06'),
(317, 7, 8, 1, 'Very poor, do not buy this.', '2024-07-06'),
(318, 8, 8, 4, 'Good value, but with some issues.', '2024-07-06'),
(319, 9, 8, 3, 'Mediocre, expected better.', '2024-07-06'),
(320, 10, 8, 2, 'Subpar, not worth the cost.', '2024-07-06'),
(321, 11, 8, 5, 'Exceptional quality, will buy again!', '2024-07-06'),
(322, 12, 8, 3, 'It’s okay, but not exceptional.', '2024-07-06'),
(323, 13, 8, 4, 'Nice, but has some flaws.', '2024-07-06'),
(324, 14, 8, 1, 'Terrible, do not recommend.', '2024-07-06'),
(325, 15, 8, 5, 'Outstanding, highly recommended!', '2024-07-06'),
(326, 16, 8, 2, 'Very disappointing, will not buy again.', '2024-07-06'),
(327, 17, 8, 4, 'Quite good, but needs improvement.', '2024-07-07'),
(328, 18, 8, 3, 'Satisfactory, but not impressive.', '2024-07-07'),
(329, 1, 9, 5, 'Excellent product, very pleased.', '2024-07-07'),
(330, 2, 9, 4, 'Very good, but could be improved.', '2024-07-07'),
(331, 3, 9, 3, 'It’s okay, but nothing special.', '2024-07-07'),
(332, 4, 9, 2, 'Disappointing, needs significant improvement.', '2024-07-07'),
(333, 6, 9, 5, 'Superb quality, exceeded expectations.', '2024-07-07'),
(334, 7, 9, 1, 'Very poor, do not purchase.', '2024-07-07'),
(335, 8, 9, 4, 'Good value, with minor issues.', '2024-07-07'),
(336, 9, 9, 3, 'Mediocre, could be better.', '2024-07-07'),
(337, 10, 9, 2, 'Not worth the cost, very disappointing.', '2024-07-07'),
(338, 11, 9, 5, 'Incredible quality, will buy again!', '2024-07-07'),
(339, 12, 9, 3, 'It’s fine, but not very impressive.', '2024-07-07'),
(340, 13, 9, 4, 'Nice product, but has some flaws.', '2024-07-07'),
(341, 14, 9, 1, 'Terrible, would not recommend.', '2024-07-07'),
(342, 15, 9, 5, 'Exceptional product, highly recommended!', '2024-07-07'),
(343, 16, 9, 2, 'Very disappointing, won’t buy again.', '2024-07-07'),
(344, 17, 9, 4, 'Quite good, but could be better.', '2024-07-07'),
(345, 18, 9, 3, 'Satisfactory, but not exceptional.', '2024-07-07'),
(346, 1, 10, 5, 'Excellent, very happy with this purchase!', '2024-07-07'),
(347, 2, 10, 4, 'Very good, but could be improved.', '2024-07-07'),
(348, 3, 10, 3, 'Okay, but not great.', '2024-07-07'),
(349, 4, 10, 2, 'Disappointing, needs significant work.', '2024-07-07'),
(350, 6, 10, 5, 'Superb quality, exceeded my expectations.', '2024-07-07'),
(351, 7, 10, 1, 'Very poor, do not purchase this.', '2024-07-08'),
(352, 8, 10, 4, 'Good quality, some minor issues.', '2024-07-08'),
(353, 9, 10, 3, 'Mediocre, expected more.', '2024-07-08'),
(354, 10, 10, 2, 'Not worth the price, very disappointing.', '2024-07-08'),
(355, 11, 10, 5, 'Amazing, will definitely buy again!', '2024-07-08'),
(356, 12, 10, 3, 'It’s okay, but not impressive.', '2024-07-08'),
(357, 13, 10, 4, 'Nice, but has some flaws.', '2024-07-08'),
(358, 14, 10, 1, 'Terrible experience, do not buy.', '2024-07-08'),
(359, 15, 10, 5, 'Outstanding, highly recommended!', '2024-07-08'),
(360, 16, 10, 2, 'Very bad, won’t buy again.', '2024-07-08'),
(361, 17, 10, 4, 'Quite good, but could use some improvement.', '2024-07-08'),
(362, 18, 10, 3, 'Satisfactory, but nothing special.', '2024-07-08');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `nama`, `email`, `phone`, `password`) VALUES
(1, 'Aan', 'aan@gmail.com', '0823-5358-0750', '12345'),
(2, 'Abil', 'abil@gmail.com', '0823-5358-0750', '12345'),
(3, 'AfifPristantio', 'afifpristantio@gmail.com', '0823-5358-0750', '12345'),
(4, 'Azka', 'azka@gmail.com', '0823-5358-0750', '12345'),
(5, 'Aca', 'aca@gmail.com', '0823-5358-0750', '12345'),
(6, 'Adela', 'adela@gmail.com', '0823-5358-0750', '12345'),
(7, 'Aeka', 'aeka@gmail.com', '0823-5358-0750', '12345'),
(8, 'Agasa', 'agasa@gmail.com', '0823-5358-0750', '12345'),
(9, 'Ahmad', 'ahma@gmail.com', '0823-5358-0750', '12345'),
(10, 'Airin', 'airin@gmail.com', '0823-5358-0750', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id_wishlist` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_produk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id_wishlist`, `id_user`, `id_produk`) VALUES
(590, 1, 1),
(591, 6, 1),
(592, 9, 1),
(593, 4, 2),
(594, 9, 2),
(595, 4, 3),
(596, 7, 3),
(597, 4, 4),
(598, 7, 4),
(599, 4, 6),
(600, 7, 6),
(601, 10, 6),
(602, 7, 7),
(603, 10, 7),
(604, 7, 8),
(605, 10, 8),
(606, 2, 9),
(607, 8, 9),
(608, 1, 10),
(609, 3, 10),
(610, 10, 10),
(611, 2, 11),
(612, 6, 11),
(613, 2, 12),
(614, 3, 13),
(615, 8, 13),
(616, 3, 14),
(617, 7, 14),
(618, 9, 14),
(619, 4, 15),
(620, 8, 15),
(621, 2, 16),
(622, 8, 16),
(623, 10, 16),
(624, 6, 17),
(625, 9, 17),
(626, 2, 18),
(627, 8, 18),
(628, 10, 18);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id_wishlist`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produk` (`id_produk`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=282;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=363;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id_wishlist` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=629;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

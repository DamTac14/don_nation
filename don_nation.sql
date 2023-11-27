-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 27 nov. 2023 à 13:47
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `don_nation`
--

-- --------------------------------------------------------

--
-- Structure de la table `donations`
--

DROP TABLE IF EXISTS `donations`;
CREATE TABLE IF NOT EXISTS `donations` (
  `id_donation` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `file` varchar(700) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comment` varchar(500) NOT NULL,
  `post_date` date NOT NULL,
  `id_user` int NOT NULL,
  PRIMARY KEY (`id_donation`),
  KEY `DONS_USERS_FK` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `donations`
--

INSERT INTO `donations` (`id_donation`, `title`, `file`, `comment`, `post_date`, `id_user`) VALUES
(24, 'GameBoy', 'gameboy.jpg', 'Ancienne GameBoy, on dois changer les touches car elles ne s\'enfoncent plus et acheter des piles mais je l\'offre en l\'état actuelle, malgré ça elle tourne bien', '2023-05-04', 2),
(25, 'Assiettes quasi neuves', 'assiettes-organic-blanches-20cm-set-de-4-kare-design.jpg', 'Assiettes quasi neuves, artisanales mais de longue date', '2023-05-04', 1),
(26, 'Tondeuse à cheveux', '542900951_max.jpg', 'N\'ayant plus l\'occasion de me couper les cheveux car je suis devenu chauve, je me permets de donner cette tondeuse à cheveu, fonctionne très bien', '2023-05-04', 3),
(27, 'Spot light', 'istockphoto-669603762-612x612.jpg', 'Des lumières de soirée', '2023-05-06', 3),
(43, 'SkateBoard', 'jart-classic-7-375-complete-skateboard.jpeg', 'Skateboard inutilisé à donner', '2023-06-08', 3),
(51, 'Exemple', 'sdohgpodsgdsjghpdsfgh.png', '', '2023-06-16', 3),
(52, 'testttt', 'assiettes-organic-blanches-20cm-set-de-4-kare-design.jpg', '', '2023-06-16', 3),
(53, 'djfjsqmgn', 'gameboy.jpg', '', '2023-06-16', 3),
(54, 'sfgsfgszdffggsf', 'dsfhsjog.png', '', '2023-06-16', 3);

-- --------------------------------------------------------

--
-- Structure de la table `localisations`
--

DROP TABLE IF EXISTS `localisations`;
CREATE TABLE IF NOT EXISTS `localisations` (
  `id_localisation` int NOT NULL AUTO_INCREMENT,
  `country_localisation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `postal_code` int NOT NULL,
  PRIMARY KEY (`id_localisation`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `localisations`
--

INSERT INTO `localisations` (`id_localisation`, `country_localisation`, `postal_code`) VALUES
(1, 'LE HAVRE', 76600),
(5, 'BEC DE MORTAGNE', 76110),
(7, 'FÉCAMP', 76400),
(8, 'FÉCAMP', 76400);

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id_reservation` int NOT NULL AUTO_INCREMENT,
  `reservation_date` date NOT NULL,
  `id_user` int NOT NULL,
  `id_donation` int NOT NULL,
  PRIMARY KEY (`id_reservation`),
  KEY `RESERVATIONS_USERS_FK` (`id_user`),
  KEY `RESERVATIONS_DONS0_FK` (`id_donation`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id_reservation`, `reservation_date`, `id_user`, `id_donation`) VALUES
(4, '2023-05-04', 1, 24),
(5, '2023-05-04', 5, 25);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `id_localisation` int NOT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email` (`email`),
  KEY `USERS_LOCATIONS_FK` (`id_localisation`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_user`, `name`, `firstname`, `email`, `password`, `id_localisation`) VALUES
(1, 'Gervais', 'Lucas', 'lucas.gervais@gmail.com', 'gervaislulucas76', 1),
(2, 'Tetris', 'GameFreak', 'tetris@hotmail.fr', 'bbbbaaaa4', 1),
(3, 'TACITE', 'Damien', 'test@gmail.com', 'testons545', 5),
(5, 'FREEMAN', 'Morgan', 'freemanMorgan@gmail.com', 'FreemanMomo', 7);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `DONS_USERS_FK` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `RESERVATIONS_DONS0_FK` FOREIGN KEY (`id_donation`) REFERENCES `donations` (`id_donation`),
  ADD CONSTRAINT `RESERVATIONS_USERS_FK` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `USERS_LOCATIONS_FK` FOREIGN KEY (`id_localisation`) REFERENCES `localisations` (`id_localisation`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

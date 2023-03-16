-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 11 juin 2020 à 17:31
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `trocglisse`
--

-- --------------------------------------------------------

--
-- Structure de la table `basket`
--

DROP TABLE IF EXISTS `basket`;
CREATE TABLE IF NOT EXISTS `basket` (
  `user_id` int(11) NOT NULL,
  `products_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(10) NOT NULL,
  `category_name` varchar(64) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(0, 'shortboard'),
(1, 'not_expensive_surf_planks'),
(2, 'mossy_planks'),
(3, 'longboard'),
(4, 'stand_up_paddle'),
(5, 'mini_malibu'),
(6, 'fish'),
(7, 'hybride'),
(8, 'egg'),
(9, 'evolutive'),
(10, 'gun'),
(11, 'vintage'),
(12, 'retro'),
(13, 'child');

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object` varchar(128) NOT NULL,
  `message` varchar(512) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `e-mail lists`
--

DROP TABLE IF EXISTS `e-mail lists`;
CREATE TABLE IF NOT EXISTS `e-mail lists` (
  `mail` text NOT NULL,
  `Subscription_program_X` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE IF NOT EXISTS `favorites` (
  `user_id` int(11) NOT NULL,
  `products_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `Name` text NOT NULL,
  `description` text NOT NULL,
  `Teaser` text NOT NULL,
  `price` int(6) NOT NULL,
  `website_expiration` int(10) NOT NULL,
  `website_suppression` int(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_category` int(10) NOT NULL,
  `FileName1` text NOT NULL,
  `FileName2` text NOT NULL,
  `FileName3` text NOT NULL,
  `FileName4` text NOT NULL,
  `FileName5` text NOT NULL,
  `region` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=123456813 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `product_commentary`
--

DROP TABLE IF EXISTS `product_commentary`;
CREATE TABLE IF NOT EXISTS `product_commentary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `title` varchar(60) NOT NULL,
  `message` varchar(300) NOT NULL,
  `publication_time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `Name` text NOT NULL,
  `Surname` text NOT NULL,
  `Mail` text NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `MailList` tinyint(1) NOT NULL,
  `Address` text NOT NULL,
  `Avatar` varchar(64) NOT NULL,
  `password` varchar(128) DEFAULT NULL,
  `role` varchar(32) NOT NULL DEFAULT 'user',
  `validated` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=83 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `validate`
--

DROP TABLE IF EXISTS `validate`;
CREATE TABLE IF NOT EXISTS `validate` (
  `token` varchar(16) NOT NULL,
  `account_mail` varchar(64) NOT NULL,
  UNIQUE KEY `account_mail` (`account_mail`),
  UNIQUE KEY `token` (`token`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

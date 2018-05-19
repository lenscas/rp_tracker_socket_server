-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 19, 2018 at 01:41 PM
-- Server version: 10.1.26-MariaDB-0+deb9u1
-- PHP Version: 7.0.27-0+deb9u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pad`
--
CREATE DATABASE IF NOT EXISTS `pad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `pad`;

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
CREATE TABLE `alerts` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `typeId` int(11) NOT NULL,
  `isRead` tinyint(1) NOT NULL,
  `time` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `alert_types`
--

DROP TABLE IF EXISTS `alert_types`;
CREATE TABLE `alert_types` (
  `id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `alert_types`
--

TRUNCATE TABLE `alert_types`;
--
-- Dumping data for table `alert_types`
--

INSERT INTO `alert_types` (`id`, `message`, `name`) VALUES
(1, 'this is a test message made by {USERNAME}', 'test'),
(2, '{RP_NAME}: {USERNAME} has created {CHARACTER_NAME}', 'new_char'),
(3, '{RP_NAME}: {USERNAME} has joined', 'new_player'),
(4, '{RP_NAME}: {BATTLE_NAME}: {CHARACTER_NAME} has been added', 'joined_battle'),
(5, '{RP_NAME}: {BATTLE_NAME}: {CHARACTER_NAME} has spoken', 'battle_reply'),
(6, '{RP_NAME}: {BATTLE_NAME} has begun', 'new_battle'),
(7, '{RP_NAME} : {CHARACTER_NAME} has their stats updated.', 'mod_change'),
(8, '{RP_NAME}: {BATTLE_NAME}: A new turn has started', 'next_turn');

-- --------------------------------------------------------

--
-- Table structure for table `alert_vars`
--

DROP TABLE IF EXISTS `alert_vars`;
CREATE TABLE `alert_vars` (
  `id` int(11) NOT NULL,
  `alertId` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters` (
  `code` varchar(7) NOT NULL,
  `textColor` char(7) DEFAULT NULL,
  `rpCode` varchar(255) NOT NULL,
  `backgroundColor` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `charCode` varchar(255) NOT NULL,
  `battleId` int(11) NOT NULL,
  `text` longtext NOT NULL,
  `createDate` int(11) NOT NULL COMMENT 'Unix time stamp',
  `rpCode` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `server_sessions`
--

DROP TABLE IF EXISTS `server_sessions`;
CREATE TABLE `server_sessions` (
  `secret` char(20) NOT NULL,
  `beginTime` int(11) NOT NULL,
  `endTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `test` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alert_types`
--
ALTER TABLE `alert_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `alert_vars`
--
ALTER TABLE `alert_vars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alertId` (`alertId`);

--
-- Indexes for table `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `server_sessions`
--
ALTER TABLE `server_sessions`
  ADD PRIMARY KEY (`secret`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `alert_types`
--
ALTER TABLE `alert_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `alert_vars`
--
ALTER TABLE `alert_vars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `alert_vars`
--
ALTER TABLE `alert_vars`
  ADD CONSTRAINT `alert_vars_ibfk_1` FOREIGN KEY (`alertId`) REFERENCES `alerts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

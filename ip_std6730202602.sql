-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 03, 2026 at 12:34 PM
-- Server version: 8.0.46-0ubuntu0.24.04.4
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_std6730202602`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `stock` int DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sizes` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `productCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `stock`, `category`, `price`, `location`, `image`, `status`, `brand`, `sizes`, `productCode`, `orderName`, `lastUpdate`) VALUES
(10, 'หม้อไฟฟ้า กระทะไฟฟ้า 3L/4L/5L 1000W หม้อนึ่งไฟฟ้า หม้อไฟฟ้าอเนกประสงค์ ทอด/ผัด/นึ่ง/ต้ม/หม้อไฟ ทำความร้อนสม่ำเสมอ 360°', 'ฟังก์ชั่นผลิตภัณฑ์：ทอด/ผัด/นึ่ง/ต้ม/หม้อไฟ\n\nเคล็ดลับดีๆ：การวัดด้วยตัวเองอาจมีข้อผิดพลาดเล็กน้อย\n\nเตาช่วยให้มือของคุณปลอดภัยจากการไหม้ และยังคงประสบการณ์การทำอาหารที่สะดวกสบาย\n\nรายละเอียดสินค้า กระทะไฟฟ้า 28cm หม้อสุกี้ชาบู กะทะไฟฟ้า หม้ออเนกประสงค์ นึ่ง/ต้ม/ผัด/หม้อไฟ 5L 1000W กะทะไฟฟ้าเอนก หม้อนึ่ง\n\nวัสดุหม้อใน：ไม่ติดหม้อใน\n\nแรงดันไฟฟ้าที่กำหนด：220V~50Hz\n\nกำลังผลิตภัณฑ์：1000W\n\nข้อมูลจำเพาะของผลิตภัณฑ์：28cm\n\nความจุสินค้า：3/4/5L\n\nเส้นผ่าศูนย์กลางของหม้อ：28cm\n\nความลึกของหม้อ：8.5cm\n\nความสูงของตะแกรงนึ่ง: 7.5 cm\n\nจำนวนผู้ใช้งานที่เหมาะสม：4-5 คน\n\n\n\nTIS No. มอก. 60335 เล่ม 2(13)-2564\n\n\n\nเลขที่ใบอนุญาตมอก. น43529-25/60335213', 8, 'กระทะไฟฟ้าอเนกประสงค์', 248.00, '', 'https://down-th.img.susercontent.com/file/th-11134207-7ras8-m9jkmajvmteofc@resize_w900_nl.webp', 'Active', '', '', '1005', '', '2026-08-27 11:24:34'),
(15, 'Kashiwa หม้ออเนกประสงค์ กระทะไฟฟ้า หม้อสุกี้ หม้อต้ม รุ่น KW-219 (ครีม)', '', 7, 'หม้อหุงข้าวดิจิตอล', 315.00, '1', 'https://down-th.img.susercontent.com/file/th-11134207-81ztn-ml69us67kf0j0b.webp', 'Active', '', '', '147852', '', '2026-09-03 19:09:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `passwordHash`, `role`, `createdAt`) VALUES
(1, 'Charuesa', 'scrypt$0cb7b3096569c9536cf329d5ed404fb8$b983e61860f2b0499831b771d780df64949108040df4e384617216c5d0bf50e5f03b508b27452e725b85fb5e38cf9acc58700744e98d1b6585a7bdac2c0cab76', 'admin', '2026-08-27 11:31:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

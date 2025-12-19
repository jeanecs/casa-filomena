-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2025 at 04:09 PM
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
-- Database: `casa_filomena`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `checkIn` datetime(3) NOT NULL,
  `checkOut` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookingdate`
--

CREATE TABLE `bookingdate` (
  `id` int(11) NOT NULL,
  `villaId` int(11) NOT NULL,
  `date` datetime(3) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `price` int(11) NOT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookingdate`
--

INSERT INTO `bookingdate` (`id`, `villaId`, `date`, `available`, `price`, `isBlocked`) VALUES
(1, 1, '2025-12-21 00:00:00.000', 1, 1200, 0),
(2, 1, '2025-12-22 00:00:00.000', 1, 1200, 0),
(3, 1, '2025-12-23 00:00:00.000', 1, 1200, 0),
(4, 1, '2025-12-24 00:00:00.000', 1, 1200, 0),
(5, 1, '2025-12-25 00:00:00.000', 1, 1200, 0),
(6, 1, '2025-12-26 00:00:00.000', 1, 1200, 0),
(7, 1, '2025-12-27 00:00:00.000', 1, 1200, 0),
(8, 1, '2025-12-20 00:00:00.000', 1, 1000, 0),
(9, 1, '2025-12-31 00:00:00.000', 1, 1200, 0),
(10, 1, '2025-12-28 00:00:00.000', 1, 1200, 0),
(11, 1, '2025-12-29 00:00:00.000', 1, 1200, 0),
(12, 1, '2025-12-30 00:00:00.000', 1, 1200, 0),
(13, 1, '2026-01-01 00:00:00.000', 1, 1000, 0),
(14, 1, '2026-01-02 00:00:00.000', 1, 1000, 0),
(15, 1, '2026-01-03 00:00:00.000', 1, 1000, 0),
(16, 2, '2025-12-21 00:00:00.000', 1, 180, 0),
(17, 2, '2025-12-22 00:00:00.000', 1, 180, 0),
(18, 2, '2025-12-23 00:00:00.000', 1, 180, 0),
(19, 2, '2025-12-24 00:00:00.000', 1, 180, 0),
(20, 2, '2025-12-25 00:00:00.000', 1, 180, 0),
(21, 2, '2025-12-26 00:00:00.000', 1, 180, 0),
(22, 2, '2025-12-27 00:00:00.000', 1, 180, 0),
(23, 2, '2025-12-28 00:00:00.000', 1, 180, 0),
(24, 2, '2025-12-29 00:00:00.000', 1, 180, 0),
(25, 2, '2025-12-30 00:00:00.000', 1, 180, 0),
(26, 2, '2025-12-31 00:00:00.000', 1, 180, 0);

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` varchar(191) NOT NULL,
  `author` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `title`, `content`, `author`, `date`, `priority`) VALUES
(2, 'Beach Safety Guidelines', 'For your safety, please be aware of current ocean conditions. Life preservers are available at the beach house. Swimming is recommended during daylight hours only.', 'Safety Team', '2025-01-14 00:00:00.000', 'HIGH'),
(3, 'Daily Housekeeping Schedule', 'Housekeeping services are available daily between 10 AM and 3 PM. Please contact reception to schedule your preferred time.', 'Housekeeping', '2025-01-13 00:00:00.000', 'LOW');

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `createdAt`) VALUES
(1, 'Admin', 'admin@example.com', '$2b$10$lwGihgVWwT1FH.qjg0ujtu9TuDuwERsyjS0gvVPQlwpSBC7QeQhn.', '2025-10-04 05:09:17.286');

-- --------------------------------------------------------

--
-- Table structure for table `villa`
--

CREATE TABLE `villa` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `image` varchar(191) NOT NULL,
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `guests` int(11) NOT NULL,
  `amenities` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `villa`
--

INSERT INTO `villa` (`id`, `name`, `description`, `image`, `bedrooms`, `bathrooms`, `guests`, `amenities`) VALUES
(1, 'Casa 1', 'Oceanfront luxury with panoramic views and private beach access. This stunning villa features contemporary design and world-class amenities.', '/images/villas/1766123062575-a0k7gfa8k4q.jpg', 4, 3, 8, 'Private Beach, Infinity Pool, WiFi, Parking'),
(2, 'Casa 2', 'Sophisticated retreat with pool terrace and garden views. Experience ultimate relaxation in this elegantly appointed sanctuary.', '/images/villas/1766123127650-45msqb1u899.jpg', 3, 2, 6, 'Pool Terrace, Garden View, WiFi, Parking');

-- --------------------------------------------------------

--
-- Table structure for table `villabooking`
--

CREATE TABLE `villabooking` (
  `id` int(11) NOT NULL,
  `villaId` int(11) NOT NULL,
  `guestName` varchar(191) NOT NULL,
  `guestEmail` varchar(191) NOT NULL,
  `guestPhone` varchar(191) NOT NULL,
  `checkIn` datetime(3) NOT NULL,
  `checkOut` datetime(3) NOT NULL,
  `guests` int(11) NOT NULL,
  `totalPrice` int(11) NOT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `notes` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `villabooking`
--

INSERT INTO `villabooking` (`id`, `villaId`, `guestName`, `guestEmail`, `guestPhone`, `checkIn`, `checkOut`, `guests`, `totalPrice`, `status`, `createdAt`, `notes`) VALUES
(4, 2, 'Jeane Alt', 'cybersecureph@gmail.com', '23432432', '2025-09-27 00:00:00.000', '2025-10-01 00:00:00.000', 2, 2600, 'PENDING', '2025-09-25 14:41:16.517', NULL),
(5, 2, 'Jeane Alt', 'cybersecureph@gmail.com', '23432432', '2025-09-27 00:00:00.000', '2025-10-01 00:00:00.000', 2, 2600, 'PENDING', '2025-09-25 14:41:16.517', NULL),
(6, 1, 'Jeane Alt', 'cybersecureph@gmail.com', '234324234', '2025-09-27 00:00:00.000', '2025-10-01 00:00:00.000', 8, 3400, 'CANCELLED', '2025-09-25 23:02:27.062', NULL),
(7, 1, 'Jeane AltYYY', 'cybersecureph@gmail.com', '3243252534543', '2025-10-14 00:00:00.000', '2025-10-16 00:00:00.000', 2, 1700, 'CANCELLED', '2025-10-05 06:06:20.850', 'bday yay'),
(8, 1, 'Jeane Alt', 'cybersecureph@gmail.com', '574754654', '2025-10-17 00:00:00.000', '2025-10-30 00:00:00.000', 2, 11050, 'CONFIRMED', '2025-10-11 02:10:38.673', NULL),
(9, 1, 'Jeane Alt', 'cybersecureph@gmail.com', '32321312312', '2025-12-18 00:00:00.000', '2025-12-23 00:00:00.000', 2, 1000, 'PENDING', '2025-12-17 05:23:04.745', NULL),
(10, 1, 'Jeane Alt', 'cybersecureph@gmail.com', '32321312312', '2025-12-18 00:00:00.000', '2025-12-23 00:00:00.000', 2, 1000, 'CONFIRMED', '2025-12-17 05:23:04.784', NULL),
(11, 1, 'eane', 'jeane.eritch@gmail.com', '09693952560', '2025-12-23 00:00:00.000', '2025-12-30 00:00:00.000', 2, 1400, 'PENDING', '2025-12-17 14:35:13.653', NULL),
(12, 1, 'eane', 'jeane.eritch@gmail.com', '09693952560', '2025-12-23 00:00:00.000', '2025-12-30 00:00:00.000', 2, 1400, 'PENDING', '2025-12-17 14:35:13.865', NULL),
(13, 1, 'Jeane Alt', '24104316@usc.edu.ph', '23423423423423', '2025-12-23 00:00:00.000', '2025-12-24 00:00:00.000', 2, 200, 'PENDING', '2025-12-17 14:56:29.773', NULL),
(14, 1, 'Jeane Alt', '24104316@usc.edu.ph', '23423423423423', '2025-12-23 00:00:00.000', '2025-12-24 00:00:00.000', 2, 200, 'CONFIRMED', '2025-12-17 14:56:32.516', NULL),
(15, 2, 'ejane Dips', '24104316@usc.edu.ph', '34234234234', '2025-12-18 00:00:00.000', '2025-12-20 00:00:00.000', 2, 400, 'PENDING', '2025-12-17 15:06:26.034', NULL),
(16, 2, 'ejane Dips', '24104316@usc.edu.ph', '34234234234', '2025-12-18 00:00:00.000', '2025-12-20 00:00:00.000', 2, 400, 'PENDING', '2025-12-17 15:06:26.179', NULL),
(17, 1, 'jeane', '24104316@usc.edu.ph', '32432423', '2025-12-24 00:00:00.000', '2025-12-27 00:00:00.000', 2, 600, 'PENDING', '2025-12-17 15:10:56.044', NULL),
(18, 1, 'jeane', '24104316@usc.edu.ph', '32432423', '2025-12-24 00:00:00.000', '2025-12-27 00:00:00.000', 2, 600, 'PENDING', '2025-12-17 15:10:58.249', NULL),
(19, 1, 'jeane', '24104316@usc.edu.ph', '32432423', '2025-12-24 00:00:00.000', '2025-12-27 00:00:00.000', 2, 600, 'PENDING', '2025-12-17 15:10:58.408', NULL),
(20, 1, 'jeane', '24104316@usc.edu.ph', '32432423', '2025-12-24 00:00:00.000', '2025-12-27 00:00:00.000', 2, 600, 'CONFIRMED', '2025-12-17 15:11:00.606', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0fe13e5a-ef93-43aa-8239-5355d1f0c37a', '05ef3f063c7946eb43438bf157648bc8028b3bfb434b611ccd2fa7c9b0024bc4', '2025-09-25 13:53:39.375', '20250909135859_init_booking_system', NULL, NULL, '2025-09-25 13:53:39.357', 1),
('d83613ca-afae-41a7-8f52-6c1f356e8c55', 'ba5b4aba50b78eb723d06db73c382acebd39b3e0fdfd5116f4dbca087f37b9c6', '2025-09-25 13:53:39.401', '20250922124510_add_villa_models', NULL, NULL, '2025-09-25 13:53:39.376', 1),
('e8edc903-13ef-44e5-a5ed-86f573704aa1', 'ca8433e1c230ca776751ee43dae7690ffe427a7c0ea0ce560ba774f7f2c300c7', '2025-09-25 13:53:39.349', '20250909121423_add_user_model', NULL, NULL, '2025-09-25 13:53:39.336', 1),
('efe89922-58d9-4828-be6e-5244e479a5ae', 'd3d783dd60bf366cd456470bbea963daee8c5e56fbc8172c2c9e0a1a96461f17', '2025-09-25 13:54:02.255', '20250925135402_init', NULL, NULL, '2025-09-25 13:54:02.145', 1),
('fa678b08-ecf0-4b6b-aed2-0c12353d093d', '942bf5f5adb99a9d396ca04a21e325561cfea1d3f42e463370cac7189a4c64f4', '2025-09-25 13:53:39.356', '20250909121852_add_post_model', NULL, NULL, '2025-09-25 13:53:39.350', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Booking_userId_fkey` (`userId`),
  ADD KEY `Booking_roomId_fkey` (`roomId`);

--
-- Indexes for table `bookingdate`
--
ALTER TABLE `bookingdate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `BookingDate_villaId_fkey` (`villaId`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `villa`
--
ALTER TABLE `villa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `villabooking`
--
ALTER TABLE `villabooking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `VillaBooking_villaId_fkey` (`villaId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bookingdate`
--
ALTER TABLE `bookingdate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `villa`
--
ALTER TABLE `villa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `villabooking`
--
ALTER TABLE `villabooking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `bookingdate`
--
ALTER TABLE `bookingdate`
  ADD CONSTRAINT `BookingDate_villaId_fkey` FOREIGN KEY (`villaId`) REFERENCES `villa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `villabooking`
--
ALTER TABLE `villabooking`
  ADD CONSTRAINT `VillaBooking_villaId_fkey` FOREIGN KEY (`villaId`) REFERENCES `villa` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

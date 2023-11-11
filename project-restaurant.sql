-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Nov 2023 pada 17.24
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project-restaurant`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `invoice`
--

CREATE TABLE `invoice` (
  `idmenu` varchar(9) NOT NULL,
  `qty` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `menu`
--

CREATE TABLE `menu` (
  `id` varchar(9) NOT NULL,
  `namamenu` varchar(50) NOT NULL,
  `harga` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `gambar` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `menu`
--

INSERT INTO `menu` (`id`, `namamenu`, `harga`, `jumlah`, `gambar`, `updated_at`, `created_at`) VALUES
('B7JqJXXUb', 'Ayam Goreng Mentega', 30000, 23, '1699718910.jpg', '2023-11-11 09:08:30', '2023-11-11 09:08:30'),
('BfTfEyZA2', 'Ayam Goreng', 23000, 24, '1699718894.jpg', '2023-11-11 09:08:14', '2023-11-11 09:08:14'),
('BmRG8w7nG', 'Ayam Bakar', 25000, 25, '1699718871.jpg', '2023-11-11 09:07:51', '2023-11-11 09:07:51'),
('BO3OxNYeR', 'Ikan Lele Bakar', 30000, 20, '1699718966.jpg', '2023-11-11 09:09:26', '2023-11-11 09:07:22'),
('BpfhDXPWr', 'Ikan Bakar Gurame', 50000, 20, '1699718795.jpg', '2023-11-11 09:06:35', '2023-11-11 09:06:35'),
('BWg0igoSl', 'Ikan Mujair Goreng', 30000, 4, '1699718934.jpg', '2023-11-11 09:08:54', '2023-11-11 09:08:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `merubahstok`
--

CREATE TABLE `merubahstok` (
  `idmenu` varchar(9) NOT NULL,
  `qty` int(11) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Trigger `merubahstok`
--
DELIMITER $$
CREATE TRIGGER `ubahstok` AFTER INSERT ON `merubahstok` FOR EACH ROW BEGIN

UPDATE menu set jumlah = jumlah + NEW.Qty
WHERE id = NEW.idmenu;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `receipt`
--

CREATE TABLE `receipt` (
  `idreceipt` varchar(6) NOT NULL,
  `idmenu` varchar(9) NOT NULL,
  `qty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `receipt`
--

INSERT INTO `receipt` (`idreceipt`, `idmenu`, `qty`) VALUES
('#Dx4J3', 'BWg0igoSl', 1),
('#Dx4J3', 'B7JqJXXUb', 2),
('#Dx4J3', 'BfTfEyZA2', 1);

--
-- Trigger `receipt`
--
DELIMITER $$
CREATE TRIGGER `kurangstok` AFTER INSERT ON `receipt` FOR EACH ROW BEGIN

UPDATE menu set jumlah = jumlah - NEW.Qty
WHERE id = NEW.idmenu;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `idreceipt` varchar(6) NOT NULL,
  `uang` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL,
  `pajak` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `kembalian` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id`, `idreceipt`, `uang`, `subtotal`, `pajak`, `total`, `kembalian`) VALUES
(1, '#Dx4J3', 120000, 113000, 11, 113011, 6989);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `invoice`
--
ALTER TABLE `invoice`
  ADD KEY `idbarang` (`idmenu`);

--
-- Indeks untuk tabel `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `merubahstok`
--
ALTER TABLE `merubahstok`
  ADD KEY `idmenu` (`idmenu`);

--
-- Indeks untuk tabel `receipt`
--
ALTER TABLE `receipt`
  ADD KEY `idreceipt` (`idreceipt`),
  ADD KEY `idbarang` (`idmenu`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idreceipt` (`idreceipt`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`idmenu`) REFERENCES `menu` (`id`);

--
-- Ketidakleluasaan untuk tabel `merubahstok`
--
ALTER TABLE `merubahstok`
  ADD CONSTRAINT `merubahstok_ibfk_1` FOREIGN KEY (`idmenu`) REFERENCES `menu` (`id`);

--
-- Ketidakleluasaan untuk tabel `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `receipt_ibfk_1` FOREIGN KEY (`idmenu`) REFERENCES `menu` (`id`);

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`idreceipt`) REFERENCES `receipt` (`idreceipt`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 31/05/2024 às 21:21
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sistema_login`
--
CREATE DATABASE IF NOT EXISTS `sistema_login` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sistema_login`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `estoque_doacao`
--

CREATE TABLE `estoque_doacao` (
  `id` int(11) NOT NULL,
  `material` varchar(100) DEFAULT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `unidade` varchar(50) DEFAULT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estoque_doacao`
--

INSERT INTO `estoque_doacao` (`id`, `material`, `fabricante`, `referencia`, `quantidade`, `unidade`, `data`) VALUES
(2, 'Garrafa', 'Loja1', 'Balcão 1 ', 3, 'UN', '2024-05-31 18:42:15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `estoque_normal`
--

CREATE TABLE `estoque_normal` (
  `id` int(11) NOT NULL,
  `material` varchar(100) DEFAULT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `unidade` varchar(50) DEFAULT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estoque_normal`
--

INSERT INTO `estoque_normal` (`id`, `material`, `fabricante`, `referencia`, `quantidade`, `unidade`, `data`) VALUES
(6, 'Material B', 'Fabricante B', 'Ref B', 20, 'UN', '2024-05-31 16:52:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `todas_saidas`
--

CREATE TABLE `todas_saidas` (
  `id` int(11) NOT NULL,
  `data` date DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `referencia` varchar(255) DEFAULT NULL,
  `fabricante` varchar(255) DEFAULT NULL,
  `tipo_estoque` enum('normal','doacao') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`) VALUES
(1, 'teste', '$2b$10$/zTVtdOzLXe31ZIJ81HoreJrcimEiyS4DjK1/6k8PAFBHEKtnricy');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `estoque_doacao`
--
ALTER TABLE `estoque_doacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `estoque_normal`
--
ALTER TABLE `estoque_normal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `todas_saidas`
--
ALTER TABLE `todas_saidas`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `estoque_doacao`
--
ALTER TABLE `estoque_doacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `estoque_normal`
--
ALTER TABLE `estoque_normal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `todas_saidas`
--
ALTER TABLE `todas_saidas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 05-06-2020 a las 11:47:22
-- Versión del servidor: 5.7.30-0ubuntu0.18.04.1
-- Versión de PHP: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `amorometro`
--

-- CREATE DATABASE IF NOT EXISTS `amorometro` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historic`
--

CREATE TABLE IF NOT EXISTS `historic` (
  `id` int(11) NOT NULL,
  `number_tweets` int(5) NOT NULL,
  `hated_user` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hated_user_example_tweet_text` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `hated_user_example_tweet_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hated_user_example_tweet_user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hateful_user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hateful_user_tweet_text` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `hateful_user_tweet_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retweets`
--

CREATE TABLE IF NOT EXISTS `retweets` (
  `id` int(11) NOT NULL,
  `retweeted_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `retweeted_user` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `retweeted_text` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `json` mediumtext COLLATE utf8mb4_unicode_ci,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `retweets_store`
--

CREATE TABLE IF NOT EXISTS `retweets_store` (
  `id` int(11) NOT NULL,
  `id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_screen_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `retweeted_status_id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tweets`
--

CREATE TABLE IF NOT EXISTS `tweets` (
  `id` int(11) NOT NULL,
  `tweet` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `screen_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `json` mediumtext COLLATE utf8mb4_unicode_ci,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tweets_store`
--

CREATE TABLE IF NOT EXISTS `tweets_store` (
  `id` int(11) NOT NULL,
  `id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `words` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `in_reply_to_status_id_str` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `in_reply_to_user_id_str` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `in_reply_to_user_screen_name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoted_status_id_str` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoted_status_user_id_str` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoted_status_user_screen_name` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id_str` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_screen_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_followers_count` int(11) NOT NULL,
  `user_friends_count` int(11) NOT NULL,
  `user_statuses_count` int(11) NOT NULL,
  `user_profile_image_url_https` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` varchar(48) COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `user` varchar(32) COLLATE utf8_bin NOT NULL,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_images`
--

CREATE TABLE IF NOT EXISTS `user_images` (
  `id` int(11) NOT NULL,
  `screen_name` varchar(32) NOT NULL,
  `image_url` varchar(256) NOT NULL,
  `published` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `historic`
--
ALTER TABLE `historic`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `retweets`
--
ALTER TABLE `retweets`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `retweets_store`
--
ALTER TABLE `retweets_store`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tweets`
--
ALTER TABLE `tweets`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tweets_store`
--
ALTER TABLE `tweets_store`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_images`
--
ALTER TABLE `user_images`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `historic`
--
ALTER TABLE `historic`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10548;
--
-- AUTO_INCREMENT de la tabla `retweets`
--
ALTER TABLE `retweets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114671;
--
-- AUTO_INCREMENT de la tabla `retweets_store`
--
ALTER TABLE `retweets_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28848;
--
-- AUTO_INCREMENT de la tabla `tweets`
--
ALTER TABLE `tweets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70485;
--
-- AUTO_INCREMENT de la tabla `tweets_store`
--
ALTER TABLE `tweets_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23882;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83046;
--
-- AUTO_INCREMENT de la tabla `user_images`
--
ALTER TABLE `user_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2577;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

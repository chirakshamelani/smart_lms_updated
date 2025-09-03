-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2025 at 08:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_predictions`
--

CREATE TABLE `ai_predictions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `predicted_grade` float(8,2) DEFAULT NULL,
  `confidence_score` float(8,2) DEFAULT NULL,
  `performance_level` enum('excellent','good','average','at_risk','critical') DEFAULT NULL,
  `prediction_factors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`prediction_factors`)),
  `prediction_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ai_predictions`
--

INSERT INTO `ai_predictions` (`id`, `user_id`, `course_id`, `predicted_grade`, `confidence_score`, `performance_level`, `prediction_factors`, `prediction_date`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 70.00, 0.94, 'average', '{\"quiz_average\":94,\"assignment_average\":74,\"course_progress\":82,\"quiz_count\":3,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 3, 2, 71.00, 0.74, 'average', '{\"quiz_average\":76,\"assignment_average\":95,\"course_progress\":91,\"quiz_count\":1,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 3, 3, 82.00, 0.80, 'good', '{\"quiz_average\":78,\"assignment_average\":72,\"course_progress\":58,\"quiz_count\":2,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 4, 1, 96.00, 0.80, 'excellent', '{\"quiz_average\":71,\"assignment_average\":90,\"course_progress\":45,\"quiz_count\":1,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 4, 2, 66.00, 0.80, 'at_risk', '{\"quiz_average\":76,\"assignment_average\":94,\"course_progress\":85,\"quiz_count\":3,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 4, 3, 85.00, 0.93, 'good', '{\"quiz_average\":82,\"assignment_average\":66,\"course_progress\":96,\"quiz_count\":1,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 5, 1, 68.00, 0.80, 'at_risk', '{\"quiz_average\":85,\"assignment_average\":99,\"course_progress\":42,\"quiz_count\":3,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 5, 2, 95.00, 0.70, 'excellent', '{\"quiz_average\":80,\"assignment_average\":91,\"course_progress\":97,\"quiz_count\":2,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 5, 3, 95.00, 0.95, 'excellent', '{\"quiz_average\":94,\"assignment_average\":76,\"course_progress\":90,\"quiz_count\":2,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 7, 1, 65.00, 0.88, 'at_risk', '{\"quiz_average\":95,\"assignment_average\":69,\"course_progress\":61,\"quiz_count\":1,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 7, 2, 64.00, 0.87, 'at_risk', '{\"quiz_average\":98,\"assignment_average\":77,\"course_progress\":59,\"quiz_count\":2,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 9, 1, 78.00, 0.67, 'average', '{\"quiz_average\":73,\"assignment_average\":79,\"course_progress\":45,\"quiz_count\":3,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 9, 2, 66.00, 0.90, 'at_risk', '{\"quiz_average\":87,\"assignment_average\":76,\"course_progress\":53,\"quiz_count\":1,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 9, 3, 97.00, 0.62, 'excellent', '{\"quiz_average\":71,\"assignment_average\":78,\"course_progress\":93,\"quiz_count\":2,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 11, 1, 76.00, 0.90, 'average', '{\"quiz_average\":93,\"assignment_average\":76,\"course_progress\":69,\"quiz_count\":2,\"assignment_count\":1}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 11, 2, 88.00, 0.86, 'good', '{\"quiz_average\":92,\"assignment_average\":89,\"course_progress\":42,\"quiz_count\":1,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(17, 11, 3, 76.00, 0.90, 'average', '{\"quiz_average\":70,\"assignment_average\":84,\"course_progress\":66,\"quiz_count\":1,\"assignment_count\":2}', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(18, 3, 2, 79.20, 0.70, 'average', '{\"quiz_average\":85,\"assignment_average\":70.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:38', '2025-08-28 13:21:38', '2025-08-28 13:21:38'),
(19, 4, 2, 69.80, 0.50, 'at_risk', '{\"quiz_average\":60,\"assignment_average\":84.5,\"course_progress\":33.33333333333333,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:38', '2025-08-28 13:21:38', '2025-08-28 13:21:38'),
(20, 5, 2, 79.80, 0.50, 'average', '{\"quiz_average\":70,\"assignment_average\":94.5,\"course_progress\":0,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:38', '2025-08-28 13:21:38', '2025-08-28 13:21:38'),
(21, 7, 2, 83.60, 0.70, 'good', '{\"quiz_average\":93,\"assignment_average\":69.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:38', '2025-08-28 13:21:38', '2025-08-28 13:21:38'),
(22, 3, 2, 79.20, 0.70, 'average', '{\"quiz_average\":85,\"assignment_average\":70.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:41', '2025-08-28 13:21:41', '2025-08-28 13:21:41'),
(23, 4, 2, 69.80, 0.50, 'at_risk', '{\"quiz_average\":60,\"assignment_average\":84.5,\"course_progress\":33.33333333333333,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:41', '2025-08-28 13:21:41', '2025-08-28 13:21:41'),
(24, 5, 2, 79.80, 0.50, 'average', '{\"quiz_average\":70,\"assignment_average\":94.5,\"course_progress\":0,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:41', '2025-08-28 13:21:41', '2025-08-28 13:21:41'),
(25, 7, 2, 83.60, 0.70, 'good', '{\"quiz_average\":93,\"assignment_average\":69.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:41', '2025-08-28 13:21:41', '2025-08-28 13:21:41'),
(26, 3, 2, 79.20, 0.70, 'average', '{\"quiz_average\":85,\"assignment_average\":70.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:42', '2025-08-28 13:21:42', '2025-08-28 13:21:42'),
(27, 4, 2, 69.80, 0.50, 'at_risk', '{\"quiz_average\":60,\"assignment_average\":84.5,\"course_progress\":33.33333333333333,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:42', '2025-08-28 13:21:42', '2025-08-28 13:21:42'),
(28, 5, 2, 79.80, 0.50, 'average', '{\"quiz_average\":70,\"assignment_average\":94.5,\"course_progress\":0,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:42', '2025-08-28 13:21:42', '2025-08-28 13:21:42'),
(29, 7, 2, 83.60, 0.70, 'good', '{\"quiz_average\":93,\"assignment_average\":69.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:42', '2025-08-28 13:21:42', '2025-08-28 13:21:42'),
(30, 3, 2, 79.20, 0.70, 'average', '{\"quiz_average\":85,\"assignment_average\":70.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:43', '2025-08-28 13:21:43', '2025-08-28 13:21:43'),
(31, 4, 2, 69.80, 0.50, 'at_risk', '{\"quiz_average\":60,\"assignment_average\":84.5,\"course_progress\":33.33333333333333,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:43', '2025-08-28 13:21:43', '2025-08-28 13:21:43'),
(32, 5, 2, 79.80, 0.50, 'average', '{\"quiz_average\":70,\"assignment_average\":94.5,\"course_progress\":0,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:43', '2025-08-28 13:21:43', '2025-08-28 13:21:43'),
(33, 7, 2, 83.60, 0.70, 'good', '{\"quiz_average\":93,\"assignment_average\":69.5,\"course_progress\":66.66666666666666,\"quiz_count\":1,\"assignment_count\":2}', '2025-08-28 13:21:43', '2025-08-28 13:21:43', '2025-08-28 13:21:43');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_important` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `course_id`, `user_id`, `title`, `content`, `is_important`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Welcome to Introduction to Programming!!', 'Welcome to our programming course! We will be covering fundamental programming concepts using JavaScript. Please make sure you have a code editor installed and are ready to start coding.', 1, '2023-09-01 00:00:00', '2025-08-29 17:03:11'),
(2, 1, 2, 'First Quiz Scheduled', 'Our first quiz on programming basics is scheduled for next week. Please review the first three lessons and practice the coding exercises.', 0, '2023-09-10 00:00:00', '2025-08-23 09:54:57'),
(3, 1, 2, 'Office Hours Updatee', 'My office hours have been updated to Tuesdays and Thursdays from 2-4 PM. Feel free to drop by if you need help with any programming concepts.', 0, '2023-09-15 00:00:00', '2025-08-27 20:01:18'),
(4, 2, 2, 'Course Resources Available', 'All course materials including HTML/CSS templates and JavaScript examples are now available in the course resources section.', 1, '2023-09-02 00:00:00', '2025-08-23 09:54:57'),
(5, 2, 2, 'Portfolio Project Guidelines', 'Detailed guidelines for the portfolio project have been posted. Please review the requirements and start planning your website structure.', 0, '2023-09-12 00:00:00', '2025-08-23 09:54:57'),
(6, 3, 12, 'Lab Safety Reminder', 'Please remember to follow all lab safety protocols during our upcoming lab sessions. Safety goggles and lab coats are mandatory.', 1, '2023-09-03 00:00:00', '2025-08-23 09:54:57'),
(7, 3, 12, 'Field Trip Announcement', 'We have scheduled a field trip to the local natural history museum for next month. Permission slips will be distributed next week.', 0, '2023-09-18 00:00:00', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `points` int(11) DEFAULT 100,
  `due_date` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `course_id`, `title`, `description`, `points`, `due_date`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'Hello World Program', 'Create your first program that displays \"Hello, World!\" to the console. Include comments explaining each line of code.', 60, '2023-09-29 18:30:00', 1, '2025-08-23 09:54:57', '2025-08-27 19:22:03'),
(2, 1, 'Calculator Project', 'Build a simple calculator that can perform basic arithmetic operations (addition, subtraction, multiplication, division).', 100, '2023-10-15 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 1, 'Array Manipulation', 'Write functions to sort, search, and manipulate arrays. Include at least 5 different array operations.', 75, '2023-11-01 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 2, 'Personal Portfolio Website', 'Create a responsive personal portfolio website using HTML, CSS, and JavaScript. Include at least 3 pages: Home, About, and Contact.', 150, '2023-10-20 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 2, 'Interactive Form', 'Build an interactive contact form with validation using JavaScript. Include fields for name, email, phone, and message.', 100, '2023-11-10 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 3, 'Cell Structure Diagram', 'Create a detailed diagram of a plant and animal cell, labeling all major organelles and their functions.', 80, '2023-10-05 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 3, 'Genetics Problem Set', 'Solve 10 genetics problems involving Punnett squares, inheritance patterns, and probability calculations.', 120, '2023-10-25 00:00:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submissions`
--

CREATE TABLE `assignment_submissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `assignment_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `submission_text` text DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `graded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('submitted','graded','late') DEFAULT 'submitted'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `assignment_submissions`
--

INSERT INTO `assignment_submissions` (`id`, `assignment_id`, `user_id`, `submission_text`, `attachment_url`, `grade`, `feedback`, `submitted_at`, `graded_at`, `created_at`, `updated_at`, `status`) VALUES
(1, 1, 3, 'This is my submission for Hello World Program. I have completed all the requirements as specified in the assignment description.', NULL, 96, 'Excellent work! You exceeded expectations.', '2023-09-30 00:00:00', '2023-10-02 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(2, 1, 4, 'This is my submission for Hello World Program. I have completed all the requirements as specified in the assignment description.', NULL, 93, 'Excellent work! You exceeded expectations.', '2023-09-29 00:00:00', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(3, 1, 5, 'This is my submission for Hello World Program. I have completed all the requirements as specified in the assignment description.', NULL, 81, 'Good job! Well done on meeting the requirements.', '2023-09-29 00:00:00', '2023-10-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(4, 1, 7, 'This is my submission for Hello World Program. I have completed all the requirements as specified in the assignment description.', NULL, 93, 'Excellent work! You exceeded expectations.', '2023-09-30 00:00:00', '2023-10-02 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(5, 2, 3, 'This is my submission for Calculator Project. I have completed all the requirements as specified in the assignment description.', NULL, 70, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-15 00:00:00', '2023-10-17 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(6, 2, 4, 'This is my submission for Calculator Project. I have completed all the requirements as specified in the assignment description.', NULL, 64, 'Needs improvement. Please see detailed feedback and consider resubmission.', '2023-10-11 00:00:00', '2023-10-13 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(7, 2, 5, 'This is my submission for Calculator Project. I have completed all the requirements as specified in the assignment description.', NULL, 70, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-13 00:00:00', '2023-10-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(8, 2, 7, 'This is my submission for Calculator Project. I have completed all the requirements as specified in the assignment description.', NULL, 66, 'Needs improvement. Please see detailed feedback and consider resubmission.', '2023-10-14 00:00:00', '2023-10-16 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(9, 3, 3, 'This is my submission for Array Manipulation. I have completed all the requirements as specified in the assignment description.', NULL, 78, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-29 00:00:00', '2023-10-31 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(10, 3, 4, 'This is my submission for Array Manipulation. I have completed all the requirements as specified in the assignment description.', NULL, 77, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-11-01 00:00:00', '2023-11-03 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(11, 3, 5, 'This is my submission for Array Manipulation. I have completed all the requirements as specified in the assignment description.', NULL, 72, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-29 00:00:00', '2023-10-31 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(12, 3, 7, 'This is my submission for Array Manipulation. I have completed all the requirements as specified in the assignment description.', NULL, 98, 'Excellent work! You exceeded expectations.', '2023-10-28 00:00:00', '2023-10-30 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(13, 4, 3, 'This is my submission for Personal Portfolio Website. I have completed all the requirements as specified in the assignment description.', NULL, 61, 'Needs improvement. Please see detailed feedback and consider resubmission.', '2023-10-18 00:00:00', '2023-10-20 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(14, 4, 4, 'This is my submission for Personal Portfolio Website. I have completed all the requirements as specified in the assignment description.', NULL, 94, 'Excellent work! You exceeded expectations.', '2023-10-16 00:00:00', '2023-10-18 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(15, 4, 5, 'This is my submission for Personal Portfolio Website. I have completed all the requirements as specified in the assignment description.', NULL, 93, 'Excellent work! You exceeded expectations.', '2023-10-17 00:00:00', '2023-10-19 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(16, 4, 7, 'This is my submission for Personal Portfolio Website. I have completed all the requirements as specified in the assignment description.', NULL, 63, 'Needs improvement. Please see detailed feedback and consider resubmission.', '2023-10-17 00:00:00', '2023-10-19 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(17, 5, 3, 'This is my submission for Interactive Form. I have completed all the requirements as specified in the assignment description.', NULL, 80, 'Good job! Well done on meeting the requirements.', '2023-11-10 00:00:00', '2023-11-12 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(18, 5, 4, 'This is my submission for Interactive Form. I have completed all the requirements as specified in the assignment description.', NULL, 75, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-11-09 00:00:00', '2023-11-11 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(19, 5, 5, 'This is my submission for Interactive Form. I have completed all the requirements as specified in the assignment description.', NULL, 96, 'Excellent work! You exceeded expectations.', '2023-11-09 00:00:00', '2023-11-11 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(20, 5, 7, 'This is my submission for Interactive Form. I have completed all the requirements as specified in the assignment description.', NULL, 76, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-11-06 00:00:00', '2023-11-08 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(21, 6, 3, 'This is my submission for Cell Structure Diagram. I have completed all the requirements as specified in the assignment description.', NULL, 84, 'Good job! Well done on meeting the requirements.', '2023-10-03 00:00:00', '2023-10-05 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(22, 6, 4, 'This is my submission for Cell Structure Diagram. I have completed all the requirements as specified in the assignment description.', NULL, 78, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-05 00:00:00', '2023-10-07 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(23, 6, 5, 'This is my submission for Cell Structure Diagram. I have completed all the requirements as specified in the assignment description.', NULL, 82, 'Good job! Well done on meeting the requirements.', '2023-10-01 00:00:00', '2023-10-03 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(24, 7, 3, 'This is my submission for Genetics Problem Set. I have completed all the requirements as specified in the assignment description.', NULL, 68, 'Needs improvement. Please see detailed feedback and consider resubmission.', '2023-10-23 00:00:00', '2023-10-25 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(25, 7, 4, 'This is my submission for Genetics Problem Set. I have completed all the requirements as specified in the assignment description.', NULL, 70, 'Satisfactory work. Consider reviewing the feedback for improvement.', '2023-10-21 00:00:00', '2023-10-23 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted'),
(26, 7, 5, 'This is my submission for Genetics Problem Set. I have completed all the requirements as specified in the assignment description.', NULL, 96, 'Excellent work! You exceeded expectations.', '2023-10-24 00:00:00', '2023-10-26 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'submitted');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `type` enum('assignment','quiz','meeting','deadline','event') NOT NULL,
  `course_id` int(10) UNSIGNED DEFAULT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `is_all_day` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `title`, `description`, `event_date`, `event_time`, `type`, `course_id`, `user_id`, `is_all_day`, `created_at`, `updated_at`) VALUES
(1, 'Math Assignment Due', 'Complete Chapter 5 exercises', '2024-01-15', '23:59:00', 'assignment', 1, 3, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 'Physics Quiz', 'Mid-term quiz on mechanics', '2024-01-18', '14:00:00', 'quiz', 2, 3, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 'Study Group Meeting', 'Review for upcoming exam', '2024-01-20', '16:00:00', 'meeting', NULL, 3, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 'Course Planning Session', 'Plan next semester curriculum', '2024-01-22', '10:00:00', 'meeting', NULL, 2, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 'Biology Lab Deadline', 'Submit lab report for cell structure experiment', '2024-01-25', '23:59:00', 'deadline', 3, 3, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 'bryhbyt', 'nrhntnt', '2025-08-26', '23:55:00', 'assignment', 3, 3, 0, '2025-08-26 04:10:18', '2025-08-26 04:10:18'),
(7, 'maths', 'bdrbbbb', '2025-08-30', '05:05:00', 'quiz', 2, 3, 0, '2025-08-26 04:17:35', '2025-08-26 04:17:35');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_conversations`
--

CREATE TABLE `chatbot_conversations` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `chatbot_conversations`
--

INSERT INTO `chatbot_conversations` (`id`, `user_id`, `course_id`, `session_id`, `started_at`, `ended_at`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'session_1755942897875_s3qhe0l2l1', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 4, 2, 'session_1755942897875_aa86c7n81f', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 5, 3, 'session_1755942897875_dyzpin6qm2v', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 7, 4, 'session_1755942897875_1ger7wx93cj', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 9, 5, 'session_1755942897875_wggcpxpwb4o', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 11, 1, 'session_1755942897875_mmjm8o5ftu', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 11, NULL, 'session_1755942897875_gwvnoy30t8', '2023-10-01 00:00:00', NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 4, NULL, 'session_1756046198141_uaqvqemkcc', '2025-08-24 14:36:38', NULL, '2025-08-24 14:36:38', '2025-08-24 14:36:38'),
(12, 3, NULL, 'session_1756182474338_xdydl0qi69n', '2025-08-26 04:27:54', NULL, '2025-08-26 04:27:54', '2025-08-26 04:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `sender_type` enum('user','bot') NOT NULL,
  `message` text DEFAULT NULL,
  `message_metadata` longtext DEFAULT NULL CHECK (json_valid(`message_metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chatbot_messages`
--

INSERT INTO `chatbot_messages` (`id`, `conversation_id`, `sender_type`, `message`, `message_metadata`, `created_at`, `updated_at`) VALUES
(1, 1, 'bot', 'Hello! I\'m your course assistant for Introduction to Programming. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(2, 1, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(3, 1, 'bot', 'The next quiz for Introduction to Programming will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(4, 1, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(5, 1, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(6, 2, 'bot', 'Hello! I\'m your course assistant for Web Development Fundamentals. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(7, 2, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(8, 2, 'bot', 'The next quiz for Web Development Fundamentals will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(9, 2, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(10, 2, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(11, 3, 'bot', 'Hello! I\'m your course assistant for Introduction to Biology. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(12, 3, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(13, 3, 'bot', 'The next quiz for Introduction to Biology will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(14, 3, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(15, 3, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(16, 4, 'bot', 'Hello! I\'m your course assistant for English Literature. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(17, 4, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(18, 4, 'bot', 'The next quiz for English Literature will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(19, 4, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(20, 4, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(21, 5, 'bot', 'Hello! I\'m your course assistant for General Chemistry. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(22, 5, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(23, 5, 'bot', 'The next quiz for General Chemistry will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(24, 5, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(25, 5, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(26, 6, 'bot', 'Hello! I\'m your course assistant for Introduction to Programming. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(27, 6, 'user', 'When is the next quiz due?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(28, 6, 'bot', 'The next quiz for Introduction to Programming will be available soon. Make sure you\'ve completed all the required readings and practice exercises.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(29, 6, 'user', 'What topics should I focus on for studying?', NULL, '2023-10-01 00:10:00', '2025-08-23 09:54:57'),
(30, 6, 'bot', 'For the upcoming assessment, focus on the concepts covered in the recent lessons. Review the practice exercises and make sure you understand the key principles. If you need help with specific topics, feel free to ask!', NULL, '2023-10-01 00:11:00', '2025-08-23 09:54:57'),
(31, 7, 'bot', 'Hello! I\'m the Smart LMS assistant. How can I help you today?', NULL, '2023-10-01 00:00:00', '2025-08-23 09:54:57'),
(32, 7, 'user', 'How do I enroll in a new course?', NULL, '2023-10-01 00:05:00', '2025-08-23 09:54:57'),
(33, 7, 'bot', 'To enroll in a course, go to the Courses page, find the course you\'re interested in, and click the Enroll button. Let me know if you need help finding a specific course.', NULL, '2023-10-01 00:06:00', '2025-08-23 09:54:57'),
(34, 8, 'bot', 'Hello! I\'m the Smart LMS assistant. How can I help you today?', NULL, '2025-08-24 14:36:38', '2025-08-24 14:36:38'),
(35, 2, 'user', 'hii', NULL, '2025-08-24 16:11:06', '2025-08-24 16:11:06'),
(36, 2, 'bot', 'Visit the Profile page and select \'Change Password\' to reset your password.', '{\"intent\":\"reset_password\"}', '2025-08-24 16:11:06', '2025-08-24 16:11:06'),
(37, 8, 'user', 'password', NULL, '2025-08-24 16:11:47', '2025-08-24 16:11:47'),
(38, 8, 'bot', 'Visit the Profile page and select \'Change Password\' to reset your password.', '{\"intent\":\"reset_password\"}', '2025-08-24 16:11:47', '2025-08-24 16:11:47'),
(39, 8, 'user', 'quiz', NULL, '2025-08-24 16:12:11', '2025-08-24 16:12:11'),
(40, 8, 'bot', 'Let me check the course schedule for the next quiz. Please provide the course name or ID if you\'re in a specific course.', '{\"intent\":\"next_quiz\"}', '2025-08-24 16:12:11', '2025-08-24 16:12:11'),
(42, 1, 'user', 'how to get mentoring', NULL, '2025-08-25 13:06:36', '2025-08-25 13:06:36'),
(43, 1, 'bot', 'To reset your password, go to the Profile settings and click \'Change Password\'. Follow the instructions there.', '{\"intent\":\"reset_password\"}', '2025-08-25 13:06:36', '2025-08-25 13:06:36'),
(44, 1, 'user', 'how to get mentoring', NULL, '2025-08-25 13:07:06', '2025-08-25 13:07:06'),
(45, 1, 'bot', 'Visit the Profile page and select \'Change Password\' to reset your password.', '{\"intent\":\"reset_password\"}', '2025-08-25 13:07:06', '2025-08-25 13:07:06'),
(46, 1, 'user', 'grades', NULL, '2025-08-25 13:17:18', '2025-08-25 13:17:18'),
(47, 1, 'bot', 'Visit the Profile page and select \'Change Password\' to reset your password.', '{\"intent\":\"reset_password\"}', '2025-08-25 13:17:18', '2025-08-25 13:17:18'),
(48, 1, 'user', 'how to use dashboard', NULL, '2025-08-25 13:20:26', '2025-08-25 13:20:26'),
(49, 1, 'bot', 'After logging in, select \'Dashboard\' from the navigation menu to view your enrolled courses, recent activities, and quick links.', '{\"intent\":\"navigate_dashboard\"}', '2025-08-25 13:20:26', '2025-08-25 13:20:26'),
(50, 1, 'user', 'mentor requests for user 3', NULL, '2025-08-25 13:20:42', '2025-08-25 13:20:42'),
(51, 1, 'bot', 'Fetching mentor request status for the specified user.', '{\"intent\":\"mentor_requests\"}', '2025-08-25 13:20:42', '2025-08-25 13:20:42'),
(52, 1, 'user', 'list_courses', NULL, '2025-08-25 13:21:43', '2025-08-25 13:21:43'),
(53, 1, 'bot', 'Here are the courses currently available in the system.', '{\"intent\":\"list_courses\"}', '2025-08-25 13:21:43', '2025-08-25 13:21:43'),
(54, 1, 'user', 'list', NULL, '2025-08-25 13:52:55', '2025-08-25 13:52:55'),
(55, 1, 'bot', 'Let me fetch the list of available courses for you.', '{\"intent\":\"list_courses\"}', '2025-08-25 13:52:55', '2025-08-25 13:52:55'),
(56, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 13:52:55', '2025-08-25 13:52:55'),
(57, 1, 'user', 'grades for user 3', NULL, '2025-08-25 13:53:52', '2025-08-25 13:53:52'),
(58, 1, 'user', 'grades for user 3', NULL, '2025-08-25 13:59:33', '2025-08-25 13:59:33'),
(59, 1, 'bot', 'Here are the grades for the user you mentioned.', '{\"intent\":\"user_grades\"}', '2025-08-25 13:59:33', '2025-08-25 13:59:33'),
(60, 1, 'bot', 'Grades for user 3: Course 1, Assignment \"Hello World Program\": 96 (Submitted: 30/09/2023); Course 1, Assignment \"Calculator Project\": 70 (Submitted: 15/10/2023); Course 1, Assignment \"Array Manipulation\": 78 (Submitted: 29/10/2023); Course 2, Assignment \"Personal Portfolio Website\": 61 (Submitted: 18/10/2023); Course 2, Assignment \"Interactive Form\": 80 (Submitted: 10/11/2023); Course 3, Assignment \"Cell Structure Diagram\": 84 (Submitted: 03/10/2023); Course 3, Assignment \"Genetics Problem Set\": 68 (Submitted: 23/10/2023); Course 1, Quiz \"Programming Basics Quiz\": 88 (Completed: 25/09/2023); Course 1, Quiz \"Variables and Functions Quiz\": 66 (Completed: 29/09/2023); Course 2, Quiz \"HTML & CSS Quiz\": 85 (Completed: 27/09/2023); Course 3, Quiz \"Cell Biology Quiz\": 70 (Completed: 20/09/2023)', '{\"intent\":\"user_grades\"}', '2025-08-25 13:59:33', '2025-08-25 13:59:33'),
(61, 1, 'user', 'grades for user 4', NULL, '2025-08-25 14:10:06', '2025-08-25 14:10:06'),
(62, 1, 'bot', 'Fetching grades for the specified user.', '{\"intent\":\"user_grades\"}', '2025-08-25 14:10:06', '2025-08-25 14:10:06'),
(63, 1, 'bot', 'Grades for user 4: Course 1, Assignment \"Hello World Program\": 93 (Submitted: 29/09/2023); Course 1, Assignment \"Calculator Project\": 64 (Submitted: 11/10/2023); Course 1, Assignment \"Array Manipulation\": 77 (Submitted: 01/11/2023); Course 2, Assignment \"Personal Portfolio Website\": 94 (Submitted: 16/10/2023); Course 2, Assignment \"Interactive Form\": 75 (Submitted: 09/11/2023); Course 3, Assignment \"Cell Structure Diagram\": 78 (Submitted: 05/10/2023); Course 3, Assignment \"Genetics Problem Set\": 70 (Submitted: 21/10/2023); Course 1, Quiz \"Programming Basics Quiz\": 86 (Completed: 26/09/2023); Course 1, Quiz \"Variables and Functions Quiz\": 67 (Completed: 24/09/2023); Course 2, Quiz \"HTML & CSS Quiz\": 60 (Completed: 26/09/2023); Course 3, Quiz \"Cell Biology Quiz\": 71 (Completed: 20/09/2023)', '{\"intent\":\"user_grades\"}', '2025-08-25 14:10:06', '2025-08-25 14:10:06'),
(64, 1, 'user', 'quiz', NULL, '2025-08-25 14:10:58', '2025-08-25 14:10:58'),
(65, 1, 'bot', 'Let me check the course schedule for the next quiz. Please provide the course name or ID if you\'re in a specific course.', '{\"intent\":\"next_quiz\"}', '2025-08-25 14:10:58', '2025-08-25 14:10:58'),
(66, 1, 'bot', 'Let me check the course schedule for the next quiz. Please provide the course name or ID if you\'re in a specific course.', '{\"intent\":\"next_quiz\"}', '2025-08-25 14:10:58', '2025-08-25 14:10:58'),
(67, 1, 'user', 'hey', NULL, '2025-08-25 14:11:19', '2025-08-25 14:11:19'),
(68, 1, 'bot', 'Here are the courses currently available in the system.', '{\"intent\":\"list_courses\"}', '2025-08-25 14:11:19', '2025-08-25 14:11:19'),
(69, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 14:11:19', '2025-08-25 14:11:19'),
(70, 1, 'user', 'Available Courses', NULL, '2025-08-25 14:11:39', '2025-08-25 14:11:39'),
(71, 1, 'bot', 'Let me fetch the list of available courses for you.', '{\"intent\":\"list_courses\"}', '2025-08-25 14:11:39', '2025-08-25 14:11:39'),
(72, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 14:11:39', '2025-08-25 14:11:39'),
(73, 1, 'user', 'hey', NULL, '2025-08-25 14:15:14', '2025-08-25 14:15:14'),
(74, 1, 'bot', 'Let me fetch the list of available courses for you.', '{\"intent\":\"list_courses\"}', '2025-08-25 14:15:14', '2025-08-25 14:15:14'),
(75, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 14:15:14', '2025-08-25 14:15:14'),
(76, 1, 'user', 'hi', NULL, '2025-08-25 14:42:56', '2025-08-25 14:42:56'),
(77, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 14:42:56', '2025-08-25 14:42:56'),
(78, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 14:42:56', '2025-08-25 14:42:56'),
(79, 1, 'user', 'hi', NULL, '2025-08-25 14:43:31', '2025-08-25 14:43:31'),
(80, 1, 'bot', 'Hey hey! How are you?', '{\"intent\":\"greeting_1\"}', '2025-08-25 14:43:31', '2025-08-25 14:43:31'),
(81, 1, 'bot', 'Hey hey! How are you?', '{\"intent\":\"greeting_1\"}', '2025-08-25 14:43:31', '2025-08-25 14:43:31'),
(82, 1, 'user', 'hey', NULL, '2025-08-25 14:57:48', '2025-08-25 14:57:48'),
(83, 1, 'user', 'hey', NULL, '2025-08-25 14:57:54', '2025-08-25 14:57:54'),
(84, 1, 'user', 'hii', NULL, '2025-08-25 15:08:29', '2025-08-25 15:08:29'),
(85, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 15:08:29', '2025-08-25 15:08:29'),
(86, 1, 'user', 'hey', NULL, '2025-08-25 15:08:58', '2025-08-25 15:08:58'),
(87, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 15:08:58', '2025-08-25 15:08:58'),
(88, 1, 'user', 'list_course', NULL, '2025-08-25 15:09:52', '2025-08-25 15:09:52'),
(89, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 15:09:52', '2025-08-25 15:09:52'),
(90, 1, 'user', 'list_courses', NULL, '2025-08-25 15:10:00', '2025-08-25 15:10:00'),
(91, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 15:10:00', '2025-08-25 15:10:00'),
(92, 1, 'user', 'hello', NULL, '2025-08-25 17:14:10', '2025-08-25 17:14:10'),
(93, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 17:14:10', '2025-08-25 17:14:10'),
(94, 1, 'user', 'hi', NULL, '2025-08-25 17:15:00', '2025-08-25 17:15:00'),
(95, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 17:15:00', '2025-08-25 17:15:00'),
(96, 1, 'user', 'list_courses', NULL, '2025-08-25 17:15:15', '2025-08-25 17:15:15'),
(97, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:15:15', '2025-08-25 17:15:15'),
(98, 1, 'user', 'list_courses', NULL, '2025-08-25 17:20:28', '2025-08-25 17:20:28'),
(99, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:20:28', '2025-08-25 17:20:28'),
(100, 1, 'user', 'list_courses', NULL, '2025-08-25 17:20:54', '2025-08-25 17:20:54'),
(101, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:20:54', '2025-08-25 17:20:54'),
(102, 1, 'user', 'grades for user 4', NULL, '2025-08-25 17:22:55', '2025-08-25 17:22:55'),
(103, 1, 'bot', 'Grades for user 4: Course 1, Assignment \"Hello World Program\": 93 (Submitted: 29/09/2023); Course 1, Assignment \"Calculator Project\": 64 (Submitted: 11/10/2023); Course 1, Assignment \"Array Manipulation\": 77 (Submitted: 01/11/2023); Course 2, Assignment \"Personal Portfolio Website\": 94 (Submitted: 16/10/2023); Course 2, Assignment \"Interactive Form\": 75 (Submitted: 09/11/2023); Course 3, Assignment \"Cell Structure Diagram\": 78 (Submitted: 05/10/2023); Course 3, Assignment \"Genetics Problem Set\": 70 (Submitted: 21/10/2023); Course 1, Quiz \"Programming Basics Quiz\": 86 (Completed: 26/09/2023); Course 1, Quiz \"Variables and Functions Quiz\": 67 (Completed: 24/09/2023); Course 2, Quiz \"HTML & CSS Quiz\": 60 (Completed: 26/09/2023); Course 3, Quiz \"Cell Biology Quiz\": 71 (Completed: 20/09/2023)', '{\"intent\":\"user_grades\"}', '2025-08-25 17:22:55', '2025-08-25 17:22:55'),
(104, 1, 'user', 'user 4 name', NULL, '2025-08-25 17:23:17', '2025-08-25 17:23:17'),
(105, 1, 'bot', 'Grades for user 4: Course 1, Assignment \"Hello World Program\": 93 (Submitted: 29/09/2023); Course 1, Assignment \"Calculator Project\": 64 (Submitted: 11/10/2023); Course 1, Assignment \"Array Manipulation\": 77 (Submitted: 01/11/2023); Course 2, Assignment \"Personal Portfolio Website\": 94 (Submitted: 16/10/2023); Course 2, Assignment \"Interactive Form\": 75 (Submitted: 09/11/2023); Course 3, Assignment \"Cell Structure Diagram\": 78 (Submitted: 05/10/2023); Course 3, Assignment \"Genetics Problem Set\": 70 (Submitted: 21/10/2023); Course 1, Quiz \"Programming Basics Quiz\": 86 (Completed: 26/09/2023); Course 1, Quiz \"Variables and Functions Quiz\": 67 (Completed: 24/09/2023); Course 2, Quiz \"HTML & CSS Quiz\": 60 (Completed: 26/09/2023); Course 3, Quiz \"Cell Biology Quiz\": 71 (Completed: 20/09/2023)', '{\"intent\":\"user_grades\"}', '2025-08-25 17:23:17', '2025-08-25 17:23:17'),
(106, 1, 'user', 'courses', NULL, '2025-08-25 17:32:18', '2025-08-25 17:32:18'),
(107, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:32:18', '2025-08-25 17:32:18'),
(108, 1, 'user', 'courses', NULL, '2025-08-25 17:40:54', '2025-08-25 17:40:54'),
(109, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:40:54', '2025-08-25 17:40:54'),
(110, 1, 'user', 'courses', NULL, '2025-08-25 17:45:50', '2025-08-25 17:45:50'),
(111, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 17:45:50', '2025-08-25 17:45:50'),
(112, 1, 'user', 's', NULL, '2025-08-25 18:01:41', '2025-08-25 18:01:41'),
(113, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 18:01:41', '2025-08-25 18:01:41'),
(114, 1, 'user', 'sit', NULL, '2025-08-25 18:01:48', '2025-08-25 18:01:48'),
(115, 1, 'bot', 'Yo! What\'s up?', '{\"intent\":\"greeting_1\"}', '2025-08-25 18:01:48', '2025-08-25 18:01:48'),
(116, 1, 'user', 'help', NULL, '2025-08-25 18:02:20', '2025-08-25 18:02:20'),
(117, 1, 'bot', 'Go to the Help page via the navigation menu after logging in to find support resources and frequently asked questions.', '{\"intent\":\"access_help_page\"}', '2025-08-25 18:02:20', '2025-08-25 18:02:20'),
(118, 1, 'user', 'course 1', NULL, '2025-08-25 18:06:28', '2025-08-25 18:06:28'),
(119, 1, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-25 18:06:28', '2025-08-25 18:06:28'),
(120, 1, 'user', 'teachers name', NULL, '2025-08-25 18:06:53', '2025-08-25 18:06:53'),
(121, 1, 'bot', 'Teachers can create and manage assignments on the Assignments page, accessible via the navigation menu with teacher privileges.', '{\"intent\":\"teacher_assignments\"}', '2025-08-25 18:06:53', '2025-08-25 18:06:53'),
(123, 1, 'user', 'programming?', NULL, '2025-08-25 18:16:20', '2025-08-25 18:16:20'),
(124, 1, 'bot', 'Programming means telling the computer what to do using a language it understands.', '{\"intent\":\"what_is_programming_1\"}', '2025-08-25 18:16:20', '2025-08-25 18:16:20'),
(125, 12, 'bot', 'Hello! I\'m the Smart LMS assistant. How can I help you today?', NULL, '2025-08-26 04:27:54', '2025-08-26 04:27:54'),
(126, 12, 'user', 'help', NULL, '2025-08-26 04:28:16', '2025-08-26 04:28:16'),
(127, 12, 'bot', 'Go to the Help page via the navigation menu after logging in to find support resources and frequently asked questions.', '{\"intent\":\"access_help_page\"}', '2025-08-26 04:28:16', '2025-08-26 04:28:16'),
(128, 12, 'user', 'list_courses', NULL, '2025-08-26 04:28:27', '2025-08-26 04:28:27'),
(129, 12, 'bot', 'Available courses: 1: Introduction to Programming - Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.; 2: Web Development Fundamentals - Master HTML, CSS, and JavaScript to build modern and responsive websites.; 3: Introduction to Biology - Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.; 4: English Literature - Study classic and modern literature, focusing on essay writing and literary analysis.; 5: General Chemistry - Learn the principles of chemistry, including lab techniques and theoretical concepts.; 6: Introduction to AI - No description', '{\"intent\":\"list_courses\"}', '2025-08-26 04:28:27', '2025-08-26 04:28:27');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `created_by` int(10) UNSIGNED NOT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `cover_image`, `created_by`, `status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 'Introduction to Programming', 'Learn the basics of programming with JavaScript. This course covers variables, data types, functions, and basic algorithms.', '', 2, 'archived', '2023-08-29 18:30:00', '2023-12-12 18:30:00', '2025-08-23 09:54:57', '2025-08-29 03:08:09'),
(2, 'Web Development Fundamentals', 'Master HTML, CSS, and JavaScript to build modern and responsive websites.', NULL, 2, 'published', '2023-09-01 00:00:00', '2023-12-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 'Introduction to Biology', 'Explore the fundamentals of biology, including cell structure, genetics, evolution, and ecology.', NULL, 12, 'published', '2023-09-01 00:00:00', '2023-12-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 'English Literature', 'Study classic and modern literature, focusing on essay writing and literary analysis.', NULL, 8, 'published', '2023-09-01 00:00:00', '2023-12-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 'General Chemistry', 'Learn the principles of chemistry, including lab techniques and theoretical concepts.', NULL, 10, 'published', '2023-09-01 00:00:00', '2023-12-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 'Introduction to AI', NULL, NULL, 1, 'draft', NULL, NULL, '2025-08-23 10:40:48', '2025-08-23 10:40:48');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `enrollment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','dropped') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `enrollment_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 3, 2, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 3, 3, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 4, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 4, 2, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 4, 3, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 5, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 5, 2, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 5, 3, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 7, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 7, 2, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 9, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 9, 2, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 9, 3, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 11, 1, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(17, 11, 3, '2023-09-01 00:00:00', 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(18, 3, 4, '2025-08-25 19:37:16', 'active', '2025-08-25 19:37:16', '2025-08-25 19:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `assignment_id` int(10) UNSIGNED DEFAULT NULL,
  `quiz_id` int(10) UNSIGNED DEFAULT NULL,
  `type` enum('assignment','quiz','exam','project') NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `max_score` decimal(5,2) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `letter_grade` varchar(3) NOT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `user_id`, `course_id`, `assignment_id`, `quiz_id`, `type`, `score`, `max_score`, `percentage`, `letter_grade`, `feedback`, `submitted_at`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, NULL, 'assignment', 45.00, 50.00, 90.00, 'A-', 'Excellent work! Great understanding of basic programming concepts.', '2024-01-15 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 3, 1, NULL, 1, 'quiz', 21.00, 25.00, 84.00, 'B', 'Good work, but watch out for syntax errors.', '2024-01-10 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 3, 2, 4, NULL, 'project', 135.00, 150.00, 90.00, 'A-', 'Outstanding portfolio with excellent design and functionality.', '2024-01-12 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 3, 2, NULL, 3, 'quiz', 28.00, 30.00, 93.33, 'A', 'Excellent understanding of HTML and CSS concepts.', '2024-01-08 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 4, 3, 6, NULL, 'assignment', 72.00, 80.00, 90.00, 'A-', 'Strong work on cell structure analysis.', '2024-01-14 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 4, 3, NULL, 4, 'quiz', 26.00, 30.00, 86.67, 'B+', 'Good understanding of cell biology fundamentals.', '2024-01-06 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `help_articles`
--

CREATE TABLE `help_articles` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `help_articles`
--

INSERT INTO `help_articles` (`id`, `title`, `content`, `category`, `tags`, `view_count`, `is_published`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'How to Submit an Assignment', 'To submit an assignment in Smart LMS:\n\n1. Navigate to your course dashboard\n2. Click on the \"Assignments\" tab\n3. Find the assignment you want to submit\n4. Click \"Submit Assignment\"\n5. Upload your file (PDF, Word, or other supported formats)\n6. Add any additional comments if needed\n7. Click \"Submit\"\n\nYour submission will be automatically saved and sent to your instructor for grading.', 'Assignments', 'submission, upload, course', 156, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 'Understanding Your Grades', 'Your grades in Smart LMS are calculated as follows:\n\n- Assignments: 40% of total grade\n- Quizzes: 30% of total grade\n- Final Exam: 30% of total grade\n\nLetter grades are assigned as:\n- A: 90-100%\n- B: 80-89%\n- C: 70-79%\n- D: 60-69%\n- F: Below 60%\n\nYou can view your grades in the \"Grades\" section of your dashboard.', 'Grades', 'grading, calculation, performance', 203, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 'Using the Calendar Feature', 'The calendar feature helps you stay organized:\n\n1. View all upcoming deadlines and events\n2. Add personal events and reminders\n3. Filter by course or event type\n4. Set notifications for important dates\n5. Export calendar to external applications\n\nTo add an event:\n- Click the \"+\" button\n- Fill in event details\n- Choose date and time\n- Select event type\n- Save your event\n\nThe calendar automatically syncs with your course assignments and quizzes.', 'Calendar', 'events, deadlines, organization', 89, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 'Messaging Other Users', 'You can message other users in the system:\n\n1. Go to the \"Messages\" section\n2. Click \"New Message\"\n3. Select the recipient from the dropdown\n4. Type your message\n5. Click \"Send\"\n\nFeatures:\n- Real-time messaging\n- Read receipts\n- File attachments\n- Message history\n- Search conversations\n\nTeachers can message students and other teachers. Students can message teachers and other students.', 'Communication', 'messaging, chat, communication', 134, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 'Customizing Your Settings', 'Personalize your Smart LMS experience:\n\nNotification Settings:\n- Email notifications\n- Push notifications\n- SMS alerts\n- Custom notification times\n\nDisplay Preferences:\n- Dark/Light mode\n- Dashboard layout\n- Language selection\n- Timezone settings\n\nPrivacy Settings:\n- Profile visibility\n- Contact information\n- Activity sharing\n\nAll settings can be changed at any time from your profile page.', 'Settings', 'preferences, customization, notifications', 67, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 'Troubleshooting Common Issues', 'Common issues and solutions:\n\nCan\'t log in?\n- Check your username and password\n- Clear browser cache and cookies\n- Try a different browser\n- Contact support if issues persist\n\nAssignment not submitting?\n- Check file size (max 50MB)\n- Ensure file format is supported\n- Verify internet connection\n- Try refreshing the page\n\nGrades not showing?\n- Wait 24-48 hours for grading\n- Check if assignment was submitted\n- Contact your instructor\n- Verify course enrollment\n\nFor additional help, contact our support team.', 'Troubleshooting', 'help, support, issues, problems', 312, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(80, '20231020000000_create_users_table.js', 1, '2025-08-23 09:54:41'),
(81, '20231020000001_create_courses_table.js', 1, '2025-08-23 09:54:41'),
(82, '20231020000002_create_enrollments_table.js', 1, '2025-08-23 09:54:41'),
(83, '20231020000003_create_lessons_table.js', 1, '2025-08-23 09:54:41'),
(84, '20231020000004_create_quizzes_table.js', 1, '2025-08-23 09:54:41'),
(85, '20231020000005_create_quiz_questions_table.js', 1, '2025-08-23 09:54:41'),
(86, '20231020000006_create_quiz_answers_table.js', 1, '2025-08-23 09:54:42'),
(87, '20231020000007_create_assignments_table.js', 1, '2025-08-23 09:54:42'),
(88, '20231020000008_create_assignment_submissions_table.js', 1, '2025-08-23 09:54:42'),
(89, '20231020000009_create_announcements_table.js', 1, '2025-08-23 09:54:42'),
(90, '20231020000010_create_user_progress_table.js', 1, '2025-08-23 09:54:42'),
(91, '20231020000011_create_quiz_attempts_table.js', 1, '2025-08-23 09:54:42'),
(92, '20231020000012_create_quiz_responses_table.js', 1, '2025-08-23 09:54:43'),
(93, '20231020000013_create_mentoring_table.js', 1, '2025-08-23 09:54:43'),
(94, '20231020000014_create_mentoring_messages_table.js', 1, '2025-08-23 09:54:43'),
(95, '20231020000015_create_ai_predictions_table.js', 1, '2025-08-23 09:54:43'),
(96, '20231020000016_create_chatbot_conversations_table.js', 1, '2025-08-23 09:54:43'),
(97, '20231020000017_create_chatbot_messages_table.js', 1, '2025-08-23 09:54:44'),
(98, '20231020000018_create_calendar_events_table.js', 1, '2025-08-23 09:54:44'),
(99, '20231020000019_create_grades_table.js', 1, '2025-08-23 09:54:44'),
(100, '20231020000020_create_messages_table.js', 1, '2025-08-23 09:54:45'),
(101, '20231020000021_create_user_settings_table.js', 1, '2025-08-23 09:54:45'),
(102, '20231020000022_create_help_articles_table.js', 1, '2025-08-23 09:54:45'),
(103, '20231020000023_create_mentorships_table.js', 1, '2025-08-23 09:54:45'),
(104, '20231020000025_create_mentor_requests_table.js', 1, '2025-08-23 09:54:46'),
(105, '20250823171531_add_file_fields_to_messages.js', 2, '2025-08-23 17:23:34'),
(106, '20250824130421_add_feedback_columns_to_mentorships.js', 3, '2025-08-24 13:08:33'),
(107, '20250825150329_alter_chatbot_messages_utf8mb4.js.js', 4, '2025-08-25 15:07:56'),
(108, '20250828191618_add_created_by_to_quizzes.js', 5, '2025-08-28 19:24:09'),
(109, '20250829061234_add_status_to_assignment_submissions.js', 6, '2025-08-29 06:14:48');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `order` int(11) NOT NULL,
  `type` varchar(500) DEFAULT 'text',
  `attachment_url` varchar(255) DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `course_id`, `title`, `content`, `order`, `type`, `attachment_url`, `duration_minutes`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 1, 'What is Programming?', 'An introduction to programming concepts, algorithms, and problem-solving techniques.', 1, 'text', NULL, 45, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 1, 'Variables and Data Types', 'Learn about different data types in JavaScript including strings, numbers, booleans, and objects.', 2, 'video', 'https://example.com/video1.mp4', 60, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 1, 'Control Structures', 'Understanding if statements, loops, and conditional logic in programming.', 3, 'interactive', NULL, 75, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 1, 'Functions and Methods', 'Creating reusable code with functions, parameters, and return values.', 4, 'text', NULL, 50, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 2, 'HTML Basics', 'Introduction to HTML structure, tags, and semantic markup.', 1, 'text', NULL, 40, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 2, 'CSS Styling', 'Learn how to style web pages with CSS, including selectors, properties, and layouts.', 2, 'video', 'https://example.com/css-video.mp4', 65, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 2, 'JavaScript DOM Manipulation', 'Interactive web pages using JavaScript to manipulate the Document Object Model.', 3, 'interactive', NULL, 80, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 3, 'Cell Structure and Function', 'Explore the basic unit of life - the cell, its organelles and their functions.', 1, 'text', NULL, 50, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 3, 'Genetics and Heredity', 'Understanding DNA, genes, and how traits are passed from parents to offspring.', 2, 'video', 'https://example.com/genetics-video.mp4', 70, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 3, 'Evolution and Natural Selection', 'The theory of evolution and how species change over time through natural selection.', 3, 'presentation', 'https://example.com/evolution-slides.pdf', 55, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 1, 'Python Basics', 'hnjymyjmyjmymf', 5, 'lecture', '', 50, 0, '2025-08-27 14:47:15', '2025-08-27 14:47:15');

-- --------------------------------------------------------

--
-- Table structure for table `mentoring`
--

CREATE TABLE `mentoring` (
  `id` int(10) UNSIGNED NOT NULL,
  `mentor_id` int(10) UNSIGNED NOT NULL,
  `mentee_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NULL DEFAULT NULL,
  `status` enum('active','completed','paused') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `mentoring`
--

INSERT INTO `mentoring` (`id`, `mentor_id`, `mentee_id`, `course_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 5, 1, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 9, 7, 1, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 5, 9, 2, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 11, 7, 2, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 9, 3, 3, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 5, 11, 3, '2023-10-05 00:00:00', NULL, 'active', '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `mentoring_messages`
--

CREATE TABLE `mentoring_messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `sender_id` int(10) UNSIGNED NOT NULL,
  `mentorship_id` int(10) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `message_type` varchar(20) DEFAULT 'text',
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `mentoring_messages`
--

INSERT INTO `mentoring_messages` (`id`, `sender_id`, `mentorship_id`, `message`, `is_read`, `read_at`, `message_type`, `file_url`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Hi Michael! Let\'s continue with calculus. Are you ready?', 1, '2025-01-16 04:30:00', 'text', NULL, '2025-01-16 04:25:00', '2025-08-23 09:54:57'),
(2, 3, 1, 'Yes, I\'m ready! I\'ve been practicing the chain rule.', 1, '2025-01-16 04:35:00', 'text', NULL, '2025-01-16 04:30:00', '2025-08-23 09:54:57'),
(3, 12, 2, 'Hi David, how are the physics problems coming along?', 1, '2025-01-21 08:30:00', 'text', NULL, '2025-01-21 08:25:00', '2025-08-23 09:54:57'),
(4, 5, 2, 'Much better! Your explanation of free body diagrams was very helpful.', 1, '2025-01-21 08:35:00', 'text', NULL, '2025-01-21 08:30:00', '2025-08-23 09:54:57'),
(5, 6, 3, 'Hi Lisa, were you able to resolve the syntax error?', 1, '2025-01-26 10:30:00', 'text', NULL, '2025-01-26 10:25:00', '2025-08-23 09:54:57'),
(6, 7, 3, 'Yes, it was a missing semicolon! Thanks for your help.', 1, '2025-01-26 10:35:00', 'text', NULL, '2025-01-26 10:30:00', '2025-08-23 09:54:57'),
(7, 8, 4, 'Hi Robert, how is the essay planning going?', 1, '2025-01-11 05:30:00', 'text', NULL, '2025-01-11 05:25:00', '2025-08-23 09:54:57'),
(8, 9, 4, 'I\'ve drafted a thesis statement. Could you take a look?', 1, '2025-01-11 05:35:00', 'text', NULL, '2025-01-11 05:30:00', '2025-08-23 09:54:57'),
(9, 12, 6, 'Hi Emily, welcome to the AI mentorship program!', 1, '2025-08-24 04:30:00', 'text', NULL, '2025-08-24 04:25:00', '2025-08-23 09:54:57'),
(10, 4, 6, 'Thanks, Jane! I\'m excited to learn about machine learning.', 1, '2025-08-24 04:35:00', 'text', NULL, '2025-08-24 04:30:00', '2025-08-23 09:54:57'),
(11, 6, 8, 'Hi Michael, let\'s discuss cell division today.', 1, '2025-02-02 05:30:00', 'text', NULL, '2025-02-02 05:25:00', '2025-08-23 09:54:57'),
(12, 3, 8, 'Sounds good! I have some questions about mitosis.', 1, '2025-02-02 05:35:00', 'text', NULL, '2025-02-02 05:30:00', '2025-08-23 09:54:57'),
(13, 8, 9, 'Hi Lisa, how are you finding Hamlet?', 1, '2025-03-02 06:30:00', 'text', NULL, '2025-03-02 06:25:00', '2025-08-23 09:54:57'),
(14, 7, 9, 'It\'s challenging, but I\'m enjoying the complexity of the characters.', 1, '2025-03-02 06:35:00', 'text', NULL, '2025-03-02 06:30:00', '2025-08-23 09:54:57'),
(15, 10, 10, 'Hi Robert, are you ready to resume our chemistry sessions?', 0, NULL, 'text', NULL, '2025-03-01 03:30:00', '2025-08-23 09:54:57'),
(16, 4, 21, 'hii', 0, NULL, 'text', NULL, '2025-08-23 10:46:12', '2025-08-23 10:46:12'),
(17, 4, 16, 'hi', 0, NULL, 'text', NULL, '2025-08-24 06:59:51', '2025-08-24 06:59:51'),
(18, 4, 21, 'hi', 0, NULL, 'text', NULL, '2025-08-24 07:43:56', '2025-08-24 07:43:56'),
(19, 4, 21, 'hey', 0, NULL, 'text', NULL, '2025-08-24 07:47:08', '2025-08-24 07:47:08'),
(20, 4, 21, 'lovely', 0, NULL, 'text', NULL, '2025-08-24 07:50:30', '2025-08-24 07:50:30'),
(21, 4, 21, 'lovely', 0, NULL, 'text', NULL, '2025-08-24 07:50:33', '2025-08-24 07:50:33'),
(22, 4, 21, 'what', 0, NULL, 'text', NULL, '2025-08-24 07:52:31', '2025-08-24 07:52:31'),
(23, 4, 21, 'hey', 0, NULL, 'text', NULL, '2025-08-24 07:53:11', '2025-08-24 07:53:11'),
(24, 4, 21, 'hey', 0, NULL, 'text', NULL, '2025-08-24 07:57:18', '2025-08-24 07:57:18'),
(25, 4, 21, 'hey', 0, NULL, 'text', NULL, '2025-08-24 07:57:28', '2025-08-24 07:57:28'),
(26, 4, 21, 'dude', 0, NULL, 'text', NULL, '2025-08-24 08:01:55', '2025-08-24 08:01:55'),
(27, 4, 21, 'r u there', 0, NULL, 'text', NULL, '2025-08-24 08:03:35', '2025-08-24 08:03:35'),
(28, 4, 21, 'check', 0, NULL, 'text', NULL, '2025-08-24 08:09:12', '2025-08-24 08:09:12'),
(29, 3, 11, 'hi', 0, NULL, 'text', NULL, '2025-08-24 12:50:27', '2025-08-24 12:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `mentorships`
--

CREATE TABLE `mentorships` (
  `id` int(10) UNSIGNED NOT NULL,
  `mentor_id` int(10) UNSIGNED NOT NULL,
  `mentee_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `status` enum('active','paused','completed') DEFAULT 'active',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `mentor_rating` decimal(3,2) DEFAULT NULL,
  `mentee_rating` decimal(3,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `mentee_feedback` text DEFAULT NULL,
  `mentor_feedback` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `mentorships`
--

INSERT INTO `mentorships` (`id`, `mentor_id`, `mentee_id`, `course_id`, `status`, `start_date`, `end_date`, `notes`, `mentor_rating`, `mentee_rating`, `feedback`, `created_at`, `updated_at`, `mentee_feedback`, `mentor_feedback`) VALUES
(11, 4, 3, 1, 'active', '2025-01-15', NULL, 'Weekly math tutoring sessions', 4.80, 4.00, 'Great progress in calculus concepts', '2025-08-23 10:40:48', '2025-08-24 13:11:51', 'gud', NULL),
(12, 12, 5, 2, 'active', '2025-01-20', NULL, 'Physics problem-solving assistance', 4.90, 4.70, 'Excellent improvement in mechanics', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(13, 6, 7, 3, 'active', '2025-01-25', NULL, 'Programming fundamentals and debugging help', 4.60, 4.80, 'Great debugging skills development', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(14, 8, 9, 4, 'paused', '2025-01-10', '2025-02-15', 'Essay writing and analysis help', 4.70, 4.40, 'Paused due to exam period', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(15, 10, 11, 5, 'completed', '2024-09-01', '2024-12-15', 'Chemistry lab and theory support', 4.90, 4.80, 'Successfully completed with A grade', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(16, 12, 4, 6, 'active', '2025-08-23', NULL, 'AI concepts and machine learning basics', 4.70, 4.60, 'Strong start in neural networks', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(17, 4, 5, 1, 'completed', '2024-10-01', '2024-11-30', 'Advanced JavaScript concepts', 4.90, 4.80, 'Excellent grasp of asynchronous programming', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(18, 6, 3, 3, 'active', '2025-02-01', NULL, 'Genetics and cell biology', 4.70, 4.60, 'Making steady progress', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(19, 8, 7, 4, 'active', '2025-03-01', NULL, 'Shakespearean literature analysis', 4.80, 4.70, 'Insightful analysis of Hamlet', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(20, 10, 9, 5, 'paused', '2025-02-15', NULL, 'Organic chemistry nomenclature', 4.60, 4.50, 'Paused for midterm exams', '2025-08-23 10:40:48', '2025-08-23 10:40:48', NULL, NULL),
(21, 4, 7, 3, 'completed', '2025-08-23', '2025-08-24', 'Created from mentor request: I\'m working on a project that involves arrays and loops, but I keep getting index out of bounds errors. Need help debugging and understanding array manipulation.', NULL, NULL, NULL, '2025-08-23 10:46:07', '2025-08-24 14:24:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mentor_requests`
--

CREATE TABLE `mentor_requests` (
  `id` int(10) UNSIGNED NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `help_description` text NOT NULL,
  `status` enum('pending','accepted','rejected','completed') DEFAULT 'pending',
  `assigned_mentor_id` int(10) UNSIGNED DEFAULT NULL,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `mentor_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `mentor_requests`
--

INSERT INTO `mentor_requests` (`id`, `student_id`, `course_id`, `help_description`, `status`, `assigned_mentor_id`, `accepted_at`, `completed_at`, `mentor_notes`, `created_at`, `updated_at`) VALUES
(6, 3, 1, 'I\'m struggling with integration techniques, especially u-substitution and integration by parts. I need help understanding when to use each method.', 'pending', NULL, NULL, NULL, NULL, '2024-01-30 03:30:00', '2025-08-23 10:44:57'),
(7, 5, 2, 'I need help with understanding electric fields and Gauss\'s law. The concepts are abstract and I\'m having trouble visualizing them.', 'accepted', 4, '2024-01-28 08:30:00', NULL, 'Will start with basic concepts and build up to Gauss\'s law', '2024-01-25 04:30:00', '2025-08-23 10:44:57'),
(8, 7, 3, 'I\'m working on a project that involves arrays and loops, but I keep getting index out of bounds errors. Need help debugging and understanding array manipulation.', 'accepted', 4, '2025-08-23 10:46:07', NULL, NULL, '2024-01-29 10:30:00', '2025-08-23 10:46:07'),
(9, 9, 4, 'I have to write a comparative essay on two novels, but I\'m not sure how to structure it. Need help with thesis development and organization.', 'accepted', 8, '2024-01-27 05:30:00', NULL, 'Will help with essay structure and thesis development', '2024-01-24 07:30:00', '2025-08-23 10:44:57'),
(10, 11, 5, 'I\'m confused about molecular geometry and VSEPR theory. The shapes don\'t make sense to me.', 'completed', 10, '2024-01-20 09:30:00', '2024-01-25 09:30:00', 'Successfully helped with molecular geometry concepts', '2024-01-18 06:30:00', '2025-08-23 10:44:57');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `sender_id` int(10) UNSIGNED NOT NULL,
  `receiver_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `message_type` enum('text','file','image') NOT NULL DEFAULT 'text',
  `file_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `is_read`, `read_at`, `created_at`, `updated_at`, `message_type`, `file_url`) VALUES
(1, 2, 3, 'Hi Michael! Great work on your programming assignment. I was impressed with your code structure and comments. Keep up the excellent work!', 1, '2024-01-15 05:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(2, 3, 2, 'Thank you, Professor Smith! I really enjoyed working on that assignment. I have a question about the next topic - when will we start learning about object-oriented programming?', 1, '2024-01-15 08:45:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(3, 2, 3, 'Great question! We\'ll start OOP next week. I\'ll send you some reading materials to prepare. Looking forward to seeing your projects!', 1, '2025-08-24 03:38:06', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(4, 4, 3, 'Hey Michael! Are you going to the study group meeting on Saturday? I could use some help with the biology assignment.', 1, '2024-01-16 03:30:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(5, 3, 4, 'Yes, I\'ll be there! I\'m actually pretty good with cell structure, so I can definitely help you out. What time are you thinking?', 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(6, 12, 4, 'Emily, your genetics problem set was excellent! I particularly liked your approach to the Punnett square problems. You have a real talent for this subject.', 1, '2024-01-14 11:15:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(7, 4, 12, 'Thank you so much, Professor Johnson! I really enjoy genetics. Do you have any recommendations for additional reading materials?', 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(8, 2, 12, 'Sarah, I was thinking we could collaborate on a cross-disciplinary project combining programming and biology. Maybe something with data analysis for genetics research?', 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 'text', NULL),
(9, 4, 12, 'hey', 0, NULL, '2025-08-23 16:07:11', '2025-08-23 16:07:11', 'text', NULL),
(10, 4, 6, 'hii', 0, NULL, '2025-08-23 16:07:51', '2025-08-23 16:07:51', 'text', NULL),
(11, 4, 12, 'Thank you so much, Professor Johnson! I really enjoy genetics. Do you have any recommendations for additional reading materials?', 0, NULL, '2025-08-23 16:08:19', '2025-08-23 16:08:19', 'text', NULL),
(12, 3, 2, 'hi', 1, '2025-08-28 08:13:49', '2025-08-24 04:07:38', '2025-08-24 04:07:38', 'text', NULL),
(13, 3, 2, 'hey', 1, '2025-08-28 08:13:49', '2025-08-24 04:07:50', '2025-08-24 04:07:50', 'image', '/Uploads/file-1756008470701-578955199.png'),
(14, 3, 2, 'File attachment', 1, '2025-08-28 08:13:49', '2025-08-24 04:56:20', '2025-08-24 04:56:20', 'image', '/Uploads/file-1756011380750-248569452.png'),
(15, 2, 4, 'hi', 0, NULL, '2025-08-28 08:14:27', '2025-08-28 08:14:27', 'text', NULL),
(16, 1, 3, 'hey mic', 0, NULL, '2025-08-29 14:16:00', '2025-08-29 14:16:00', 'text', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(10) UNSIGNED NOT NULL,
  `course_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit_minutes` int(11) DEFAULT NULL,
  `pass_percentage` int(11) DEFAULT 70,
  `available_from` timestamp NULL DEFAULT NULL,
  `available_until` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `max_attempts` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `course_id`, `title`, `description`, `time_limit_minutes`, `pass_percentage`, `available_from`, `available_until`, `is_published`, `max_attempts`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 1, 'Programming Basics Quiz', 'Test your understanding of basic programming concepts.', 30, 70, '2023-09-15 00:00:00', '2023-12-15 00:00:00', 1, 3, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 2),
(2, 1, 'Variables and Functions Quiz', 'Assessment on variables, data types, and functions.', 45, 75, '2023-10-01 00:00:00', '2023-12-15 00:00:00', 1, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 2),
(3, 2, 'HTML & CSS Quiz', 'Test your knowledge of HTML structure and CSS styling.', 40, 70, '2023-09-20 00:00:00', '2023-12-15 00:00:00', 1, 3, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 1),
(4, 3, 'Cell Biology Quiz', 'Assessment on cell structure and function.', 35, 75, '2023-09-25 00:00:00', '2023-12-15 00:00:00', 1, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57', 1),
(5, 1, 'kvkvk', 'vjhkkh', 50, 10, NULL, NULL, 0, 15, '2025-08-29 18:18:26', '2025-08-29 18:18:26', 2);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answers`
--

CREATE TABLE `quiz_answers` (
  `id` int(10) UNSIGNED NOT NULL,
  `question_id` int(10) UNSIGNED NOT NULL,
  `answer_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `quiz_answers`
--

INSERT INTO `quiz_answers` (`id`, `question_id`, `answer_text`, `is_correct`, `feedback`, `created_at`, `updated_at`) VALUES
(9, 4, 'To write reusable blocks of code', 1, 'Correct! Functions promote code reusability and organization.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 4, 'To store data', 0, 'Incorrect. Variables store data, functions execute code.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 4, 'To style web pages', 0, 'Incorrect. CSS is used for styling, not functions.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 4, 'To create databases', 0, 'Incorrect. Database management systems create databases.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 6, 'HyperText Markup Language', 1, 'Correct! HTML stands for HyperText Markup Language.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 6, 'High Tech Modern Language', 0, 'Incorrect. This is not what HTML stands for.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 6, 'Home Tool Markup Language', 0, 'Incorrect. This is not the correct expansion.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 6, 'Hyperlink and Text Markup Language', 0, 'Incorrect. Close, but not the correct expansion.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(17, 8, 'Mitochondria', 1, 'Correct! Mitochondria produce ATP, the energy currency of cells.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(18, 8, 'Nucleus', 0, 'Incorrect. The nucleus controls cell activities but doesn\'t produce energy.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(19, 8, 'Ribosome', 0, 'Incorrect. Ribosomes synthesize proteins, not energy.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(20, 8, 'Chloroplast', 0, 'Incorrect. Chloroplasts are found in plant cells for photosynthesis.', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(33, 16, 'mn mj ', 1, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(34, 16, ' mj j', 0, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(35, 16, ' j jm', 0, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(36, 16, ' jm j', 0, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(37, 17, 'True', 1, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(38, 17, 'False', 0, '', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(39, 18, 'ygikuooojl', 1, 'bfsb', '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(40, 19, 'True', 1, '', '2025-08-29 18:18:26', '2025-08-29 18:18:26'),
(41, 19, 'False', 0, '', '2025-08-29 18:18:26', '2025-08-29 18:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `id` int(10) UNSIGNED NOT NULL,
  `quiz_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `score` int(11) DEFAULT NULL,
  `max_score` int(11) DEFAULT NULL,
  `percentage` float(8,2) DEFAULT NULL,
  `passed` tinyint(1) DEFAULT 0,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `attempt_number` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `quiz_attempts`
--

INSERT INTO `quiz_attempts` (`id`, `quiz_id`, `user_id`, `score`, `max_score`, `percentage`, `passed`, `started_at`, `completed_at`, `attempt_number`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 88, 100, 88.00, 1, '2023-09-25 00:00:00', '2023-09-25 00:30:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 1, 4, 86, 100, 86.00, 1, '2023-09-26 00:00:00', '2023-09-26 00:30:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 1, 5, 93, 100, 93.00, 1, '2023-09-22 00:00:00', '2023-09-22 00:30:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 1, 7, 74, 100, 74.00, 1, '2023-09-28 00:00:00', '2023-09-28 00:30:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 2, 3, 66, 100, 66.00, 0, '2023-09-29 00:00:00', '2023-09-29 00:45:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 2, 4, 67, 100, 67.00, 0, '2023-09-24 00:00:00', '2023-09-24 00:45:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 2, 5, 77, 100, 77.00, 1, '2023-09-23 00:00:00', '2023-09-23 00:45:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 2, 7, 89, 100, 89.00, 1, '2023-09-24 00:00:00', '2023-09-24 00:45:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 3, 3, 85, 100, 85.00, 1, '2023-09-27 00:00:00', '2023-09-27 00:40:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 3, 4, 60, 100, 60.00, 0, '2023-09-26 00:00:00', '2023-09-26 00:40:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 3, 5, 70, 100, 70.00, 1, '2023-09-20 00:00:00', '2023-09-20 00:40:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 3, 7, 93, 100, 93.00, 1, '2023-09-27 00:00:00', '2023-09-27 00:40:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 4, 3, 70, 100, 70.00, 0, '2023-09-20 00:00:00', '2023-09-20 00:35:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 4, 4, 71, 100, 71.00, 0, '2023-09-20 00:00:00', '2023-09-20 00:35:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 4, 5, 96, 100, 96.00, 1, '2023-09-21 00:00:00', '2023-09-21 00:35:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 4, 9, 77, 100, 77.00, 1, '2023-09-29 00:00:00', '2023-09-29 00:35:00', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(10) UNSIGNED NOT NULL,
  `quiz_id` int(10) UNSIGNED NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','true_false','short_answer','essay') NOT NULL,
  `points` int(11) DEFAULT 1,
  `feedback` text DEFAULT NULL,
  `order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `question_type`, `points`, `feedback`, `order`, `created_at`, `updated_at`) VALUES
(4, 2, 'What is the purpose of a function in programming?', 'multiple_choice', 3, 'Functions allow you to write reusable blocks of code.', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 2, 'Explain the difference between let and const in JavaScript.', 'short_answer', 4, 'let allows reassignment, const does not.', 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 3, 'What does HTML stand for?', 'multiple_choice', 1, 'HTML stands for HyperText Markup Language.', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 3, 'CSS is used for styling web pages. True or False?', 'true_false', 1, 'CSS (Cascading Style Sheets) is indeed used for styling.', 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 4, 'What is the powerhouse of the cell?', 'multiple_choice', 2, 'The mitochondria is known as the powerhouse of the cell.', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 4, 'All living things are made up of cells. True or False?', 'true_false', 1, 'This is the cell theory - all living things are composed of cells.', 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 1, 'njn  ', 'multiple_choice', 1, ' mn mn  ', 1, '2025-08-29 18:17:16', '2025-08-29 18:17:16'),
(17, 1, 'yugyugg', 'true_false', 1, 'ghgjjh', 2, '2025-08-29 18:17:16', '2025-08-29 18:17:16'),
(18, 1, 'vsfsbfsdb', 'short_answer', 1, 'bfsb', 3, '2025-08-29 18:17:17', '2025-08-29 18:17:17'),
(19, 5, 'vkvbkvbkl', 'true_false', 1, '', 1, '2025-08-29 18:18:26', '2025-08-29 18:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_responses`
--

CREATE TABLE `quiz_responses` (
  `id` int(10) UNSIGNED NOT NULL,
  `attempt_id` int(10) UNSIGNED NOT NULL,
  `question_id` int(10) UNSIGNED NOT NULL,
  `user_answer` text DEFAULT NULL,
  `selected_answer_id` int(10) UNSIGNED DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `points_earned` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `quiz_responses`
--

INSERT INTO `quiz_responses` (`id`, `attempt_id`, `question_id`, `user_answer`, `selected_answer_id`, `is_correct`, `points_earned`, `created_at`, `updated_at`) VALUES
(13, 5, 4, NULL, 9, 1, 3, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 5, 5, 'let allows reassignment while const does not', NULL, 1, 4, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 6, 4, NULL, 9, 1, 3, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 6, 5, 'let allows reassignment while const does not', NULL, 1, 4, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(17, 7, 4, NULL, 10, 0, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(18, 7, 5, 'let allows reassignment while const does not', NULL, 1, 4, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(19, 8, 4, NULL, 10, 0, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(20, 8, 5, 'let allows reassignment while const does not', NULL, 0, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(21, 9, 6, NULL, 13, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(22, 9, 7, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(23, 10, 6, NULL, 14, 0, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(24, 10, 7, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(25, 11, 6, NULL, 13, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(26, 11, 7, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(27, 12, 6, NULL, 13, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(28, 12, 7, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(29, 13, 8, NULL, 17, 1, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(30, 13, 9, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(31, 14, 8, NULL, 18, 0, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(32, 14, 9, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(33, 15, 8, NULL, 17, 1, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(34, 15, 9, 'False', NULL, 0, 0, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(35, 16, 8, NULL, 17, 1, 2, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(36, 16, 9, 'True', NULL, 1, 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student',
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `first_name`, `last_name`, `profile_picture`, `bio`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'admin', 'Admin', 'User', NULL, 'System administrator', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 'teacher1', 'teacher1@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'teacher', 'Sarah', 'Johnson', NULL, 'Math and Computer Science Teacher', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 'student1', 'student1@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'Michael', 'Brownnn', '/Uploads/1756403793833-143559158.png', 'Computer Science Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 'student2', 'student2@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'Emily', 'Davis', NULL, 'Biology Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 'student3', 'student3@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'David', 'Wilson', NULL, 'Physics Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 'teacher3', 'teacher3@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'teacher', 'James', 'Miller', NULL, 'Programming Instructor', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 'student4', 'student4@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'Lisa', 'Anderson', NULL, 'Programming Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 'teacher4', 'teacher4@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'teacher', 'Maria', 'Garcia', NULL, 'Literature Instructor', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 'student5', 'student5@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'Robert', 'Taylor', NULL, 'Literature Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 'teacher5', 'teacher5@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'teacher', 'John', 'Lee', NULL, 'Chemistry Instructor', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 'student6', 'student6@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'student', 'Amanda', 'White', NULL, 'Chemistry Student', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 'teacher2', 'teacher2@smartlms.com', '$2b$10$KDIVqCY6GBYlHy9etx7Np.Jbd5AORz3.rhZz02ZiCH1BY2Fj4qWbK', 'teacher', 'Jane', 'Doe', NULL, 'Science and Biology Teacher', 1, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 'vdsbsbfdbdb', 'test@gmail.com', '$2b$10$ZQFNBlYoHyh6xcKHmJXtJeQo8USjCnmgK/dChKvqHJm.AgCIuTdBu', 'student', 'test', 'bbdsss', NULL, 'fbdfbdbbdfbfdbb', 0, '2025-08-29 10:47:11', '2025-08-29 10:47:11'),
(14, 'testitest', 'test2@gmail.com', '$2b$10$KsdK.1xkrDxuxCd/Qxg1h.iaK/pX8bBzKdOgkaw98jPUduhnj4kvy', 'student', 'test', 'testi', NULL, NULL, 1, '2025-08-29 14:24:19', '2025-08-29 14:24:19');

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `lesson_id` int(10) UNSIGNED NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `lesson_id`, `completed`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 3, 2, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 3, 3, 1, '2023-09-07 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 3, 4, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 3, 5, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(6, 3, 6, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(7, 3, 7, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(8, 3, 8, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(9, 3, 9, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(10, 4, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(11, 4, 2, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(12, 4, 3, 1, '2023-09-07 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(13, 4, 4, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(14, 4, 5, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(15, 4, 6, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(16, 4, 8, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(17, 4, 9, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(18, 5, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(19, 5, 2, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(20, 5, 5, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(21, 5, 8, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(22, 7, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(23, 7, 2, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(24, 7, 5, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(25, 7, 6, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(26, 7, 7, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(27, 9, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(28, 9, 2, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(29, 9, 3, 1, '2023-09-07 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(30, 9, 4, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(31, 9, 5, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(32, 9, 6, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(33, 9, 8, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(34, 11, 1, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(35, 11, 2, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(36, 11, 5, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(37, 11, 6, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(38, 11, 8, 1, '2023-09-01 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(39, 11, 9, 1, '2023-09-04 00:00:00', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(40, 11, 10, 0, NULL, '2025-08-23 09:54:57', '2025-08-23 09:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `email_notifications` tinyint(1) DEFAULT 1,
  `push_notifications` tinyint(1) DEFAULT 1,
  `sms_notifications` tinyint(1) DEFAULT 0,
  `timezone` varchar(50) DEFAULT 'UTC',
  `language` varchar(10) DEFAULT 'en',
  `dark_mode` tinyint(1) DEFAULT 0,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `email_notifications`, `push_notifications`, `sms_notifications`, `timezone`, `language`, `dark_mode`, `preferences`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 0, 'UTC', 'en', 1, '{\"dashboard_layout\":\"grid\",\"default_view\":\"overview\",\"notification_sound\":true}', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(2, 2, 1, 1, 0, 'America/New_York', 'en', 0, '{\"dashboard_layout\":\"list\",\"default_view\":\"courses\",\"notification_sound\":false,\"grading_preferences\":{\"auto_save\":true,\"show_rubric\":true}}', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(3, 12, 1, 0, 0, 'America/Chicago', 'en', 1, '{\"dashboard_layout\":\"grid\",\"default_view\":\"students\",\"notification_sound\":true,\"grading_preferences\":{\"auto_save\":false,\"show_rubric\":false}}', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(4, 3, 1, 1, 1, 'America/Los_Angeles', 'en', 0, '{\"dashboard_layout\":\"grid\",\"default_view\":\"courses\",\"notification_sound\":true,\"study_preferences\":{\"reminder_time\":\"09:00\",\"study_duration\":45}}', '2025-08-23 09:54:57', '2025-08-23 09:54:57'),
(5, 4, 1, 1, 0, 'America/Denver', 'en', 1, '{\"dashboard_layout\":\"list\",\"default_view\":\"grades\",\"notification_sound\":false,\"study_preferences\":{\"reminder_time\":\"10:00\",\"study_duration\":60}}', '2025-08-23 09:54:57', '2025-08-23 09:54:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_predictions`
--
ALTER TABLE `ai_predictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_predictions_course_id_foreign` (`course_id`),
  ADD KEY `ai_predictions_user_id_course_id_prediction_date_index` (`user_id`,`course_id`,`prediction_date`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcements_course_id_foreign` (`course_id`),
  ADD KEY `announcements_user_id_foreign` (`user_id`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignments_course_id_foreign` (`course_id`);

--
-- Indexes for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `assignment_submissions_assignment_id_user_id_unique` (`assignment_id`,`user_id`),
  ADD KEY `assignment_submissions_user_id_foreign` (`user_id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar_events_course_id_foreign` (`course_id`),
  ADD KEY `calendar_events_user_id_foreign` (`user_id`);

--
-- Indexes for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatbot_conversations_user_id_foreign` (`user_id`),
  ADD KEY `chatbot_conversations_course_id_foreign` (`course_id`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatbot_messages_conversation_id_foreign` (`conversation_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courses_created_by_foreign` (`created_by`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `enrollments_user_id_course_id_unique` (`user_id`,`course_id`),
  ADD KEY `enrollments_course_id_foreign` (`course_id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grades_user_id_foreign` (`user_id`),
  ADD KEY `grades_course_id_foreign` (`course_id`),
  ADD KEY `grades_assignment_id_foreign` (`assignment_id`),
  ADD KEY `grades_quiz_id_foreign` (`quiz_id`);

--
-- Indexes for table `help_articles`
--
ALTER TABLE `help_articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `help_articles_created_by_foreign` (`created_by`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lessons_course_id_foreign` (`course_id`);

--
-- Indexes for table `mentoring`
--
ALTER TABLE `mentoring`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mentoring_mentor_id_mentee_id_course_id_unique` (`mentor_id`,`mentee_id`,`course_id`),
  ADD KEY `mentoring_mentee_id_foreign` (`mentee_id`),
  ADD KEY `mentoring_course_id_foreign` (`course_id`);

--
-- Indexes for table `mentoring_messages`
--
ALTER TABLE `mentoring_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentoring_messages_sender_id_foreign` (`sender_id`),
  ADD KEY `mentoring_messages_created_at_index` (`created_at`);

--
-- Indexes for table `mentorships`
--
ALTER TABLE `mentorships`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mentorships_mentor_id_mentee_id_course_id_unique` (`mentor_id`,`mentee_id`,`course_id`),
  ADD KEY `mentorships_mentee_id_foreign` (`mentee_id`),
  ADD KEY `mentorships_course_id_foreign` (`course_id`);

--
-- Indexes for table `mentor_requests`
--
ALTER TABLE `mentor_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentor_requests_assigned_mentor_id_foreign` (`assigned_mentor_id`),
  ADD KEY `mentor_requests_student_id_status_index` (`student_id`,`status`),
  ADD KEY `mentor_requests_course_id_status_index` (`course_id`,`status`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quizzes_course_id_foreign` (`course_id`),
  ADD KEY `quizzes_created_by_foreign` (`created_by`);

--
-- Indexes for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_answers_question_id_foreign` (`question_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_attempts_quiz_id_foreign` (`quiz_id`),
  ADD KEY `quiz_attempts_user_id_foreign` (`user_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_questions_quiz_id_foreign` (`quiz_id`);

--
-- Indexes for table `quiz_responses`
--
ALTER TABLE `quiz_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_responses_attempt_id_foreign` (`attempt_id`),
  ADD KEY `quiz_responses_question_id_foreign` (`question_id`),
  ADD KEY `quiz_responses_selected_answer_id_foreign` (`selected_answer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_progress_user_id_lesson_id_unique` (`user_id`,`lesson_id`),
  ADD KEY `user_progress_lesson_id_foreign` (`lesson_id`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_settings_user_id_unique` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_predictions`
--
ALTER TABLE `ai_predictions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `help_articles`
--
ALTER TABLE `help_articles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `mentoring`
--
ALTER TABLE `mentoring`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mentoring_messages`
--
ALTER TABLE `mentoring_messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `mentorships`
--
ALTER TABLE `mentorships`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `mentor_requests`
--
ALTER TABLE `mentor_requests`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `quiz_responses`
--
ALTER TABLE `quiz_responses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_predictions`
--
ALTER TABLE `ai_predictions`
  ADD CONSTRAINT `ai_predictions_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ai_predictions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcements_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignment_submissions`
--
ALTER TABLE `assignment_submissions`
  ADD CONSTRAINT `assignment_submissions_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignment_submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `calendar_events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD CONSTRAINT `chatbot_conversations_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chatbot_conversations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_assignment_id_foreign` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `help_articles`
--
ALTER TABLE `help_articles`
  ADD CONSTRAINT `help_articles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mentoring`
--
ALTER TABLE `mentoring`
  ADD CONSTRAINT `mentoring_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentoring_mentee_id_foreign` FOREIGN KEY (`mentee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentoring_mentor_id_foreign` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mentoring_messages`
--
ALTER TABLE `mentoring_messages`
  ADD CONSTRAINT `mentoring_messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mentorships`
--
ALTER TABLE `mentorships`
  ADD CONSTRAINT `mentorships_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentorships_mentee_id_foreign` FOREIGN KEY (`mentee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentorships_mentor_id_foreign` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mentor_requests`
--
ALTER TABLE `mentor_requests`
  ADD CONSTRAINT `mentor_requests_assigned_mentor_id_foreign` FOREIGN KEY (`assigned_mentor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `mentor_requests_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mentor_requests_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizzes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD CONSTRAINT `quiz_answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_responses`
--
ALTER TABLE `quiz_responses`
  ADD CONSTRAINT `quiz_responses_attempt_id_foreign` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_responses_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_responses_selected_answer_id_foreign` FOREIGN KEY (`selected_answer_id`) REFERENCES `quiz_answers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100421 (10.4.21-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : sunstorage

 Target Server Type    : MySQL
 Target Server Version : 100421 (10.4.21-MariaDB)
 File Encoding         : 65001

 Date: 13/08/2024 18:02:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('ADMIN_Full','ADMIN') NOT NULL DEFAULT 'ADMIN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admin_users
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of departments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for deviceassignments
-- ----------------------------
DROP TABLE IF EXISTS `deviceassignments`;
CREATE TABLE `deviceassignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `assign_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `deviceassignments_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`),
  CONSTRAINT `deviceassignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of deviceassignments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for devicelogs
-- ----------------------------
DROP TABLE IF EXISTS `devicelogs`;
CREATE TABLE `devicelogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `log_type` varchar(255) NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `event_datetime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `devicelogs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicelogs
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_type_id` int(11) DEFAULT NULL,
  `sn` varchar(255) NOT NULL,
  `qr_code_string` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `device_type_id` (`device_type_id`),
  CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devices
-- ----------------------------
BEGIN;
INSERT INTO `devices` (`id`, `device_type_id`, `sn`, `qr_code_string`) VALUES (49, 1, '12345678910', 'CIAO_QR_CAZZ_992096');
COMMIT;

-- ----------------------------
-- Table structure for devicespecifics
-- ----------------------------
DROP TABLE IF EXISTS `devicespecifics`;
CREATE TABLE `devicespecifics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devicespecifics_ibfk_1` (`device_id`),
  CONSTRAINT `devicespecifics_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecifics
-- ----------------------------
BEGIN;
INSERT INTO `devicespecifics` (`id`, `device_id`, `name`, `value`) VALUES (79, 49, 'MODEL', 'MODEL 4');
INSERT INTO `devicespecifics` (`id`, `device_id`, `name`, `value`) VALUES (80, 49, 'DISK_TYPE', 'SSD');
INSERT INTO `devicespecifics` (`id`, `device_id`, `name`, `value`) VALUES (81, 49, 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` (`id`, `device_id`, `name`, `value`) VALUES (82, 49, 'RAM_SIZE', '16');
INSERT INTO `devicespecifics` (`id`, `device_id`, `name`, `value`) VALUES (83, 49, 'PROCESSOR_TYPE', 'i5');
COMMIT;

-- ----------------------------
-- Table structure for devicespecificsinputs
-- ----------------------------
DROP TABLE IF EXISTS `devicespecificsinputs`;
CREATE TABLE `devicespecificsinputs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_type_id` int(11) NOT NULL,
  `input_name` varchar(255) NOT NULL,
  `input_label` varchar(255) NOT NULL,
  `input_type` enum('text','select') NOT NULL DEFAULT 'text',
  `input_values` varchar(255) DEFAULT NULL,
  `input_placeholder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `device_type_id` (`device_type_id`),
  CONSTRAINT `devicespecificsinputs_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecificsinputs
-- ----------------------------
BEGIN;
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (1, 1, 'DISK_TYPE', 'Disk type', 'select', '[\"SSD\",\"HDD\"]', NULL);
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (2, 1, 'DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"500\"]', NULL);
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (3, 1, 'RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', NULL);
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (4, 1, 'PROCESSOR_TYPE', 'Processor Type', 'text', NULL, 'Processor type');
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (5, 1, 'MODEL', 'Modello', 'text', NULL, 'Model');
INSERT INTO `devicespecificsinputs` (`id`, `device_type_id`, `input_name`, `input_label`, `input_type`, `input_values`, `input_placeholder`) VALUES (6, 2, 'COLOR', 'Colore', 'text', NULL, 'Colore');
COMMIT;

-- ----------------------------
-- Table structure for devicetypes
-- ----------------------------
DROP TABLE IF EXISTS `devicetypes`;
CREATE TABLE `devicetypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicetypes
-- ----------------------------
BEGIN;
INSERT INTO `devicetypes` (`id`, `name`) VALUES (1, 'PC');
INSERT INTO `devicetypes` (`id`, `name`) VALUES (2, 'Telefoni');
COMMIT;

-- ----------------------------
-- Table structure for devicewarranties
-- ----------------------------
DROP TABLE IF EXISTS `devicewarranties`;
CREATE TABLE `devicewarranties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devicewarranties_ibfk_1` (`device_id`),
  CONSTRAINT `devicewarranties_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicewarranties
-- ----------------------------
BEGIN;
INSERT INTO `devicewarranties` (`id`, `device_id`, `start_date`, `end_date`) VALUES (30, 49, '2024-08-09', '2024-08-24');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : sunstorage

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-10-21 00:11:19
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('ADMIN_FULL','ADMIN') NOT NULL DEFAULT 'ADMIN',
  `password` varchar(512) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admin_users
-- ----------------------------
INSERT INTO `admin_users` VALUES ('24', 'marawan', 'ciao', 'marawan@clubdelsole.com', 'ADMIN_FULL', '$2a$10$bAa4OkubBBZkKA0f2DkOi.6Ad7S3GxCNMM9JqlD2RXfwo.BsLpJHO');
INSERT INTO `admin_users` VALUES ('38', 'massimo', 'marion', 'massimo.marion@clubdelsole.com', 'ADMIN', '$2a$10$QgNudhBbk/lkvnEog0R88ecQWCOQyETYLtiv1g1hHmN4vmaxTXlQ.');

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('1', 'IT');
INSERT INTO `departments` VALUES ('2', 'Marketing');
INSERT INTO `departments` VALUES ('3', 'Amministrazione');

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
  CONSTRAINT `deviceassignments_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `deviceassignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of deviceassignments
-- ----------------------------

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
  CONSTRAINT `devicelogs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicelogs
-- ----------------------------
INSERT INTO `devicelogs` VALUES ('145', '153', 'DEVICE_CREATION', 'Device creato', '2024-10-21 00:10:25');

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_type_id` int(11) DEFAULT NULL,
  `sn` varchar(255) NOT NULL,
  `qr_code_string` varchar(255) NOT NULL,
  `status` enum('free','assigned','under repair','dismissed') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`id`),
  KEY `device_type_id` (`device_type_id`),
  CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES ('153', '2', 'caioej1114141221141', 'SunStorage_DeviceNumber750681', 'free');

-- ----------------------------
-- Table structure for devicespecifics
-- ----------------------------
DROP TABLE IF EXISTS `devicespecifics`;
CREATE TABLE `devicespecifics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `devicespecific_input_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `devicespecifics_ibfk_1` (`device_id`),
  KEY `devicespecific_input_id` (`devicespecific_input_id`),
  CONSTRAINT `devicespecific_input_id` FOREIGN KEY (`devicespecific_input_id`) REFERENCES `devicespecificsinputs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `devicespecifics_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=412 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecifics
-- ----------------------------
INSERT INTO `devicespecifics` VALUES ('410', '153', 'Samsung', '69');
INSERT INTO `devicespecifics` VALUES ('411', '153', '128', '70');

-- ----------------------------
-- Table structure for devicespecificsinputs
-- ----------------------------
DROP TABLE IF EXISTS `devicespecificsinputs`;
CREATE TABLE `devicespecificsinputs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_type_id` int(11) NOT NULL,
  `input_name` varchar(255) NOT NULL,
  `input_label` varchar(255) NOT NULL,
  `input_type` enum('text','number','select') NOT NULL DEFAULT 'text',
  `input_values` varchar(255) DEFAULT NULL,
  `input_placeholder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `device_type_id` (`device_type_id`),
  CONSTRAINT `devicespecificsinputs_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecificsinputs
-- ----------------------------
INSERT INTO `devicespecificsinputs` VALUES ('8', '3', 'FISSO_DISK_TYPE', 'Disk Type', 'select', '[\"SSD\",\"HDD\"]', '');
INSERT INTO `devicespecificsinputs` VALUES ('9', '3', 'FISSO_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\", \"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('10', '3', 'FISSO_RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('11', '3', 'FISSO_PROCESSOR_TYPE', 'Processor Type', 'text', null, 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('12', '3', 'FISSO_MODEL', 'Modello', 'select', '[\"Hp\", \"Dell\"]', 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('64', '1', 'LAPTOP_DISK_TYPE', 'Disk type', 'select', '[\"SSD\",\"HDD\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('65', '1', 'LAPTOP_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\",\"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('66', '1', 'LAPTOP_RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('67', '1', 'LAPTOP_PROCESSOR_TYPE', 'Processor Type', 'text', 'null', 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('68', '1', 'LAPTOP_MODEL', 'Modello', 'select', '[\"Hp\",\"Dell\",\"Asus\",\"Samsung\"]', 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('69', '2', 'TELEFONI_MODELLO', 'Modello', 'select', '[\"Iphone\",\"Samsung\",\"Huawei\"]', 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('70', '2', 'TELEFONI_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"64\",\"128\",\"256\"]', null);

-- ----------------------------
-- Table structure for devicetypes
-- ----------------------------
DROP TABLE IF EXISTS `devicetypes`;
CREATE TABLE `devicetypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicetypes
-- ----------------------------
INSERT INTO `devicetypes` VALUES ('1', 'Laptop');
INSERT INTO `devicetypes` VALUES ('2', 'Telefoni');
INSERT INTO `devicetypes` VALUES ('3', 'Fisso');

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
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicewarranties
-- ----------------------------
INSERT INTO `devicewarranties` VALUES ('139', '153', null, null);

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
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '1', 'Max', 'Marion', 'max@marion');
INSERT INTO `users` VALUES ('2', '1', 'Luca', 'Baccarin', 'luca@baccarin');
INSERT INTO `users` VALUES ('3', '2', 'Michela', 'Marz', 'michela@marz');
INSERT INTO `users` VALUES ('4', '2', 'Valentino', 'MEO', 'valentino@meo');
INSERT INTO `users` VALUES ('5', '3', 'Gian', 'covino', 'gian@covino');
INSERT INTO `users` VALUES ('6', '3', 'caca', 'cafs', 'flad@faa');
INSERT INTO `users` VALUES ('7', '2', 'ciao', 'caio', 'afdaf@fa');
INSERT INTO `users` VALUES ('8', '1', 'Cla', 'valentino', 'valentino@cla');
INSERT INTO `users` VALUES ('9', '2', 'caioa', 'vale', 'vale@caio');
INSERT INTO `users` VALUES ('15', '1', 'Marawan', 'emad', 'marawa@emad');
INSERT INTO `users` VALUES ('16', '3', 'mafa', 'raga', 'mafa@raga');
INSERT INTO `users` VALUES ('24', '1', 'ciao', 'ciao', 'ciao@ciao.com');
INSERT INTO `users` VALUES ('25', '1', 'marawan', 'emad', 'marawan@emad.com');

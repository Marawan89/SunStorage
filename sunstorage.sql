/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : sunstorage

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-09-17 15:02:00
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
INSERT INTO `deviceassignments` VALUES ('59', '110', '24', '2024-09-10 09:43:00');

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
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicelogs
-- ----------------------------
INSERT INTO `devicelogs` VALUES ('92', '109', 'DEVICE_CREATION', 'Device creato', '2024-09-10 09:41:15');
INSERT INTO `devicelogs` VALUES ('93', '110', 'DEVICE_CREATION', 'Device creato', '2024-09-10 09:42:34');
INSERT INTO `devicelogs` VALUES ('94', '110', 'DEVICE_ASSIGNMENT', 'Assegnato a ciao del dipartimento IT', '2024-09-10 09:43:00');
INSERT INTO `devicelogs` VALUES ('96', '109', 'DEVICE_STATUS', 'Passato in status: dismissed', '2024-09-10 09:43:13');
INSERT INTO `devicelogs` VALUES ('100', '114', 'DEVICE_CREATION', 'Device creato', '2024-09-10 10:11:56');
INSERT INTO `devicelogs` VALUES ('101', '115', 'DEVICE_CREATION', 'Device creato', '2024-09-10 10:12:53');
INSERT INTO `devicelogs` VALUES ('102', '116', 'DEVICE_CREATION', 'Device creato', '2024-09-10 10:15:11');
INSERT INTO `devicelogs` VALUES ('105', '109', 'DEVICE_STATUS', 'Passato in status: free', '2024-09-10 10:19:53');
INSERT INTO `devicelogs` VALUES ('106', '109', 'DEVICE_ASSIGNMENT', 'Assegnato a prova del dipartimento Prova', '2024-09-10 10:20:28');
INSERT INTO `devicelogs` VALUES ('108', '116', 'DEVICE_STATUS', 'Passato in status: under repair', '2024-09-11 15:09:33');
INSERT INTO `devicelogs` VALUES ('109', '114', 'DEVICE_STATUS', 'Passato in status: dismissed', '2024-09-11 18:17:01');
INSERT INTO `devicelogs` VALUES ('111', '119', 'DEVICE_CREATION', 'Device creato', '2024-09-16 23:58:21');
INSERT INTO `devicelogs` VALUES ('112', '120', 'DEVICE_CREATION', 'Device creato', '2024-09-17 00:10:23');
INSERT INTO `devicelogs` VALUES ('113', '121', 'DEVICE_CREATION', 'Device creato', '2024-09-17 00:16:48');

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
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES ('109', '3', '56784567896578EDITEDCUIA', 'SunStorage_DeviceNumber233393', 'free');
INSERT INTO `devices` VALUES ('110', '2', '3275907395025EDITED', 'SunStorage_DeviceNumber727539', 'assigned');
INSERT INTO `devices` VALUES ('114', '2', '5728573205723523', 'SunStorage_DeviceNumber850784', 'dismissed');
INSERT INTO `devices` VALUES ('115', '1', 'y8592y95y0', 'SunStorage_DeviceNumber307025', 'free');
INSERT INTO `devices` VALUES ('116', '2', '23456789876543', 'SunStorage_DeviceNumber785092', 'under repair');
INSERT INTO `devices` VALUES ('119', '2', '1412411244', 'SunStorage_DeviceNumber217322', 'free');
INSERT INTO `devices` VALUES ('120', '2', 'mpovmwpvmwvw', 'SunStorage_DeviceNumber288550', 'free');
INSERT INTO `devices` VALUES ('121', '2', 'fhoihfiefengegqg', 'SunStorage_DeviceNumber271648', 'free');

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
) ENGINE=InnoDB AUTO_INCREMENT=293 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecifics
-- ----------------------------
INSERT INTO `devicespecifics` VALUES ('232', '109', 'HDD', '8');
INSERT INTO `devicespecifics` VALUES ('233', '109', '256', '9');
INSERT INTO `devicespecifics` VALUES ('234', '109', '8', '10');
INSERT INTO `devicespecifics` VALUES ('235', '109', 'I7EDITEDCiao', '11');
INSERT INTO `devicespecifics` VALUES ('236', '109', 'ModEDITED', '12');
INSERT INTO `devicespecifics` VALUES ('237', '109', '25', '13');
INSERT INTO `devicespecifics` VALUES ('243', '110', 'EDITED', '6');
INSERT INTO `devicespecifics` VALUES ('244', '110', '', '7');
INSERT INTO `devicespecifics` VALUES ('268', '114', 'MOde', '6');
INSERT INTO `devicespecifics` VALUES ('269', '114', '256', '7');
INSERT INTO `devicespecifics` VALUES ('270', '115', 'SSD', '1');
INSERT INTO `devicespecifics` VALUES ('271', '115', '128', '2');
INSERT INTO `devicespecifics` VALUES ('272', '115', '4', '3');
INSERT INTO `devicespecifics` VALUES ('273', '115', 'Ciao', '4');
INSERT INTO `devicespecifics` VALUES ('274', '115', 'prova', '5');
INSERT INTO `devicespecifics` VALUES ('275', '116', 'iphone', '6');
INSERT INTO `devicespecifics` VALUES ('276', '116', '64', '7');
INSERT INTO `devicespecifics` VALUES ('287', '119', 'gw', '6');
INSERT INTO `devicespecifics` VALUES ('288', '119', '128', '7');
INSERT INTO `devicespecifics` VALUES ('289', '120', 'veq', '6');
INSERT INTO `devicespecifics` VALUES ('290', '120', '64', '7');
INSERT INTO `devicespecifics` VALUES ('291', '121', 'gwe', '6');
INSERT INTO `devicespecifics` VALUES ('292', '121', '128', '7');

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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecificsinputs
-- ----------------------------
INSERT INTO `devicespecificsinputs` VALUES ('1', '1', 'LAPTOP_DISK_TYPE', 'Disk type', 'select', '[\"SSD\",\"HDD\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('2', '1', 'LAPTOP_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\", \"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('3', '1', 'LAPTOP_RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('4', '1', 'LAPTOP_PROCESSOR_TYPE', 'Processor Type', 'text', null, 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('5', '1', 'LAPTOP_MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('6', '2', 'PHONE_MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('7', '2', 'PHONE_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"64\",\"128\",\"256\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('8', '3', 'DESKTOP_DISK_TYPE', 'Disk Type', 'select', '[\"SSD\",\"HDD\"]', '');
INSERT INTO `devicespecificsinputs` VALUES ('9', '3', 'DESKTOP_DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\", \"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('10', '3', 'DESKTOP_RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('11', '3', 'DESKTOP_PROCESSOR_TYPE', 'Processor Type', 'text', null, 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('12', '3', 'DESKTOP_MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('13', '3', 'DESKTOP_MONITOR_INCHES', 'Monitor inches', 'number', '', 'Monitor inches');

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
INSERT INTO `devicetypes` VALUES ('3', 'Desktop-PC');

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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicewarranties
-- ----------------------------
INSERT INTO `devicewarranties` VALUES ('93', '109', '2021-05-31', '2024-09-30');
INSERT INTO `devicewarranties` VALUES ('94', '110', null, null);
INSERT INTO `devicewarranties` VALUES ('100', '114', '2024-08-31', '2024-09-10');
INSERT INTO `devicewarranties` VALUES ('101', '115', null, null);
INSERT INTO `devicewarranties` VALUES ('102', '116', '2021-05-11', '2022-09-21');
INSERT INTO `devicewarranties` VALUES ('105', '119', null, null);
INSERT INTO `devicewarranties` VALUES ('106', '120', null, null);
INSERT INTO `devicewarranties` VALUES ('107', '121', null, null);

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

/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : sunstorage

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2024-08-19 15:30:49
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
  `role` enum('ADMIN_Full','ADMIN') NOT NULL DEFAULT 'ADMIN',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of admin_users
-- ----------------------------

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('1', 'IT');
INSERT INTO `departments` VALUES ('2', 'Marketing');
INSERT INTO `departments` VALUES ('3', 'Amministrazione');
INSERT INTO `departments` VALUES ('36', 'Customer care');

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of deviceassignments
-- ----------------------------
INSERT INTO `deviceassignments` VALUES ('4', '59', '9', '2024-08-16 18:22:00');
INSERT INTO `deviceassignments` VALUES ('5', '62', '10', '2024-08-18 17:55:34');
INSERT INTO `deviceassignments` VALUES ('11', '60', '1', '2024-08-18 18:02:18');
INSERT INTO `deviceassignments` VALUES ('12', '63', '2', '2024-08-18 18:03:55');

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
  CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES ('59', '1', '3489087654890fggay', 'SunStorage_Device119990', 'assigned');
INSERT INTO `devices` VALUES ('60', '3', 'kojfiunaa1341431', 'SunStorage_Device589344', 'assigned');
INSERT INTO `devices` VALUES ('62', '1', '23456787rfymicaciao', 'SunStorage_DeviceNumber595732', 'assigned');
INSERT INTO `devices` VALUES ('63', '1', 'acadasffaffafaf', 'SunStorage_DeviceNumber799757', 'assigned');
INSERT INTO `devices` VALUES ('64', '3', 'qr3ekwmfwmgmw', 'SunStorage_DeviceNumber436329', 'free');
INSERT INTO `devices` VALUES ('65', '2', 'ndsbgiwnopfognwofl', 'SunStorage_DeviceNumber537575', 'free');

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
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecifics
-- ----------------------------
INSERT INTO `devicespecifics` VALUES ('106', '59', 'MODEL', 'phoemdv');
INSERT INTO `devicespecifics` VALUES ('107', '59', 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` VALUES ('108', '60', 'DISK_TYPE', 'SSD');
INSERT INTO `devicespecifics` VALUES ('109', '60', 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` VALUES ('110', '60', 'RAM_SIZE', '8');
INSERT INTO `devicespecifics` VALUES ('111', '60', 'PROCESSOR_TYPE', 'A5');
INSERT INTO `devicespecifics` VALUES ('112', '60', 'MODEL', 'Gay');
INSERT INTO `devicespecifics` VALUES ('113', '60', 'MONITOR_INCHES', '25');
INSERT INTO `devicespecifics` VALUES ('119', '59', 'DISK_TYPE', 'SSD');
INSERT INTO `devicespecifics` VALUES ('120', '59', 'RAM_SIZE', '8');
INSERT INTO `devicespecifics` VALUES ('121', '59', 'PROCESSOR_TYPE', 'dasv');
INSERT INTO `devicespecifics` VALUES ('123', '62', 'DISK_TYPE', 'SSD');
INSERT INTO `devicespecifics` VALUES ('124', '62', 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` VALUES ('125', '62', 'RAM_SIZE', '16');
INSERT INTO `devicespecifics` VALUES ('126', '62', 'PROCESSOR_TYPE', 'I5caio');
INSERT INTO `devicespecifics` VALUES ('127', '62', 'MODEL', 'Probookciao');
INSERT INTO `devicespecifics` VALUES ('128', '63', 'DISK_TYPE', 'SSD');
INSERT INTO `devicespecifics` VALUES ('129', '63', 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` VALUES ('130', '63', 'RAM_SIZE', '16');
INSERT INTO `devicespecifics` VALUES ('131', '63', 'PROCESSOR_TYPE', 'fsafa');
INSERT INTO `devicespecifics` VALUES ('132', '63', 'MODEL', 'fasfafa');
INSERT INTO `devicespecifics` VALUES ('133', '64', 'DISK_TYPE', 'HDD');
INSERT INTO `devicespecifics` VALUES ('134', '64', 'DISK_SIZE', '256');
INSERT INTO `devicespecifics` VALUES ('135', '64', 'RAM_SIZE', '8');
INSERT INTO `devicespecifics` VALUES ('136', '64', 'PROCESSOR_TYPE', 'feqwfq');
INSERT INTO `devicespecifics` VALUES ('137', '64', 'MODEL', 'fefqwe');
INSERT INTO `devicespecifics` VALUES ('138', '64', 'MONITOR_INCHES', '21');
INSERT INTO `devicespecifics` VALUES ('139', '65', 'MODEL', 'GaranziaTest');
INSERT INTO `devicespecifics` VALUES ('140', '65', 'DISK_SIZE', '128');

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
  CONSTRAINT `devicespecificsinputs_ibfk_1` FOREIGN KEY (`device_type_id`) REFERENCES `devicetypes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicespecificsinputs
-- ----------------------------
INSERT INTO `devicespecificsinputs` VALUES ('1', '1', 'DISK_TYPE', 'Disk type', 'select', '[\"SSD\",\"HDD\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('2', '1', 'DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\", \"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('3', '1', 'RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('4', '1', 'PROCESSOR_TYPE', 'Processor Type', 'text', null, 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('5', '1', 'MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('6', '2', 'MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('7', '2', 'DISK_SIZE', 'Disk Size (GB)', 'select', '[\"64\",\"128\",\"256\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('8', '3', 'DISK_TYPE', 'Disk Type', 'select', '[\"SSD\",\"HDD\"]', '');
INSERT INTO `devicespecificsinputs` VALUES ('9', '3', 'DISK_SIZE', 'Disk Size (GB)', 'select', '[\"128\",\"256\",\"512\", \"1T\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('10', '3', 'RAM_SIZE', 'Ram Size (GB)', 'select', '[\"4\",\"8\",\"16\",\"32\",\"64\"]', null);
INSERT INTO `devicespecificsinputs` VALUES ('11', '3', 'PROCESSOR_TYPE', 'Processor Type', 'text', null, 'Processor type');
INSERT INTO `devicespecificsinputs` VALUES ('12', '3', 'MODEL', 'Modello', 'text', null, 'Model');
INSERT INTO `devicespecificsinputs` VALUES ('13', '3', 'MONITOR_INCHES', 'Monitor inches', 'number', '', null);

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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of devicewarranties
-- ----------------------------
INSERT INTO `devicewarranties` VALUES ('41', '60', '2024-08-06', '2028-08-06');
INSERT INTO `devicewarranties` VALUES ('44', '59', '2024-08-24', '2024-09-06');
INSERT INTO `devicewarranties` VALUES ('46', '63', null, null);
INSERT INTO `devicewarranties` VALUES ('47', '64', null, null);
INSERT INTO `devicewarranties` VALUES ('48', '65', '2021-01-09', '2023-02-08');

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

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
INSERT INTO `users` VALUES ('10', '36', 'Sofia', 'Pipicella', 'sofia@pipicella');
INSERT INTO `users` VALUES ('11', '36', 'Sofia', 'Pipicella', 'sofia@pipicella');
INSERT INTO `users` VALUES ('12', '36', 'Sofia', 'Pipicella', 'sofia@pipicella');
INSERT INTO `users` VALUES ('13', '36', 'Sofia', 'Pipicella', 'sofia@pipicella');
INSERT INTO `users` VALUES ('14', '36', 'Sofia', 'Pipicella', 'sofia@pipicella');

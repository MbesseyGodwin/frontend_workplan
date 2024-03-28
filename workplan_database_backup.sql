-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: CWMS
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Approval`
--

DROP TABLE IF EXISTS `Approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Approval` (
  `approval_id` int NOT NULL AUTO_INCREMENT,
  `workplan_id` int DEFAULT NULL,
  `approver_id` int DEFAULT NULL,
  `approval_status` varchar(50) NOT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `workplan_id` (`workplan_id`),
  KEY `approver_id` (`approver_id`),
  CONSTRAINT `Approval_ibfk_1` FOREIGN KEY (`workplan_id`) REFERENCES `Workplan` (`workplan_id`),
  CONSTRAINT `Approval_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Approval`
--

LOCK TABLES `Approval` WRITE;
/*!40000 ALTER TABLE `Approval` DISABLE KEYS */;
/*!40000 ALTER TABLE `Approval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'prevention'),(2,'clinical'),(3,'pharmacy');
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Report`
--

DROP TABLE IF EXISTS `Report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Report` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `report_text` text,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Report`
--

LOCK TABLES `Report` WRITE;
/*!40000 ALTER TABLE `Report` DISABLE KEYS */;
/*!40000 ALTER TABLE `Report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Report_tracker`
--

DROP TABLE IF EXISTS `Report_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Report_tracker` (
  `report_track_id` int NOT NULL AUTO_INCREMENT,
  `workplan_id` int DEFAULT NULL,
  `report_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `report_id` int DEFAULT NULL,
  PRIMARY KEY (`report_track_id`),
  KEY `workplan_id` (`workplan_id`),
  KEY `report_id` (`report_id`),
  CONSTRAINT `Report_tracker_ibfk_1` FOREIGN KEY (`workplan_id`) REFERENCES `Workplan` (`workplan_id`),
  CONSTRAINT `Report_tracker_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `Report` (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Report_tracker`
--

LOCK TABLES `Report_tracker` WRITE;
/*!40000 ALTER TABLE `Report_tracker` DISABLE KEYS */;
/*!40000 ALTER TABLE `Report_tracker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES (1,'Admin'),(2,'Manager'),(3,'Employee');
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Srt`
--

DROP TABLE IF EXISTS `Srt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Srt` (
  `srt_id` int NOT NULL AUTO_INCREMENT,
  `srt_name` varchar(255) NOT NULL,
  PRIMARY KEY (`srt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Srt`
--

LOCK TABLES `Srt` WRITE;
/*!40000 ALTER TABLE `Srt` DISABLE KEYS */;
/*!40000 ALTER TABLE `Srt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Unit`
--

DROP TABLE IF EXISTS `Unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Unit` (
  `unit_id` int NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(255) NOT NULL,
  PRIMARY KEY (`unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Unit`
--

LOCK TABLES `Unit` WRITE;
/*!40000 ALTER TABLE `Unit` DISABLE KEYS */;
INSERT INTO `Unit` VALUES (1,'Unit A'),(2,'Unit B'),(3,'Unit C');
/*!40000 ALTER TABLE `Unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role_id` int DEFAULT NULL,
  `unit_id` int DEFAULT NULL,
  `srt_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `srt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `role_id` (`role_id`),
  KEY `unit_id` (`unit_id`),
  KEY `srt_id` (`srt_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `User_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `Role` (`role_id`),
  CONSTRAINT `User_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `Unit` (`unit_id`),
  CONSTRAINT `User_ibfk_3` FOREIGN KEY (`srt_id`) REFERENCES `srt` (`srt_id`),
  CONSTRAINT `User_ibfk_4` FOREIGN KEY (`department_id`) REFERENCES `Department` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (4,'Cokolie','password1','Cokolie@ccfng.org','CHUKWUEMEKALUM CHARLES','OKOLIE',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,2,NULL,1,NULL,NULL),(5,'aonifade','password2','aonifade@ccfnd.org','ABIODUN','ONIFADE',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,3,NULL,1,NULL,NULL),(6,'Kjohnson','password3','Kjohnson@ccfng.org','KENNETH','JOHNSON',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,3,NULL,1,NULL,NULL),(7,'abenson','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','abenson@ccfng.org','BENSON','AMODU',NULL,'2024-03-21 14:05:17','2024-03-24 17:20:35',2,3,NULL,1,NULL,NULL),(8,'arufai','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','arufai@ccfn.org','ADETUTU','RUFAI',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,3,NULL,1,NULL,NULL),(9,'sishiwu','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','sishiwu@ccfng.org','SUNDAY','ISHIWU',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,4,NULL,1,NULL,NULL),(10,'VNTUI','password7','VNTUI@ccfng.org','VINCENT','Ntui',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,4,NULL,1,NULL,NULL),(11,'Iuparegh','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Iuparegh@ccfng.org','IMOTER','UPAREGH',NULL,'2024-03-21 14:05:17','2024-03-25 15:50:14',2,5,NULL,1,'meal',NULL),(12,'monoja','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','monoja@ccfng.org','MARK','ONOJA',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,5,NULL,1,'meal',NULL),(13,'pokorie','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','pokorie@ccfng.org','PRINCESS EZINNE','OKORIE',NULL,'2024-03-21 14:05:17','2024-03-27 04:41:06',2,5,NULL,1,'meal',NULL),(14,'Oadeleke','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Oadeleke@ccfng.org','OLUSAYO TITILOPE','ADELEKE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjE0LCJmTmFtZSI6Ik9MVVNBWU8gVElUSUxPUEUiLCJsTmFtZSI6IkFERUxFS0UiLCJlbWFpbCI6Ik9hZGVsZWtlQGNjZm5nLm9yZyIsInJvbGVJRCI6MiwiaWF0IjoxNzExNDcwODM2LCJleHAiOjE3MTE1NTcyMzZ9.MPkUeZ1KVAAYKH4W6HVwJZ2felYbp-elxA2riLW2Z','2024-03-21 14:05:17','2024-03-26 16:33:56',2,5,NULL,1,'meal',NULL),(15,'gobialor','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','gobialor@ccfng.org','GINIKA','OBIALOR',NULL,'2024-03-21 14:05:17','2024-03-25 15:47:32',2,5,NULL,1,'meal',NULL),(16,'fonyecherem','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','fonyecherem@ccfng.org','ONYECHEREM ONYINYEOMA','FRANKLIN',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,5,NULL,1,'meal',NULL),(17,'Ttimbir','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Ttimbir@ccfng.org','TERFA TIMBIR','THEOPHILUS',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,5,NULL,1,'meal',NULL),(18,'Mshittu','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Mshittu@ccfng.org','MULIQ','SHITTU',NULL,'2024-03-21 14:05:17','2024-03-27 04:42:50',2,6,NULL,1,'health informatics',NULL),(19,'OAghadinun','password16','OAghadinun@ccfng.org','OBIORA','AGHADINUNO',NULL,'2024-03-21 14:05:17','2024-03-25 01:58:20',2,6,NULL,1,'health informatics',NULL),(20,'MAondohemba','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','MAondohemba@ccfng.org','GODWIN','MBESSEY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIwLCJmTmFtZSI6IkdPRFdJTiIsImxOYW1lIjoiTUJFU1NFWSIsImVtYWlsIjoiTUFvbmRvaGVtYmFAY2Nmbmcub3JnIiwicm9sZUlEIjoyLCJpYXQiOjE3MTE1MDY2MDEsImV4cCI6MTcxMTU5MzAwMX0.q9T-Yn9LabhDHJTAbmrwGYgaeH6p4RfUZc_xzvAHT2E','2024-03-21 14:05:17','2024-03-27 02:30:01',2,6,NULL,1,'health informatics',NULL),(21,'ocallistus','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','ocallistus@ccfng.org','ONYEDIKACHI','EZEOBI',NULL,'2024-03-21 14:05:17','2024-03-27 01:19:37',2,6,NULL,1,'health informatics',NULL),(22,'jeboh','password19','jeboh@ccfng.org','OLUCHI','EBOH',NULL,'2024-03-21 14:05:17','2024-03-24 21:39:10',2,6,NULL,1,'health informatics',NULL),(23,'tabba','password20','tabba@ccfng.org','THELMA','ABBA',NULL,'2024-03-21 14:05:17','2024-03-24 21:39:10',2,6,NULL,1,'health informatics',NULL),(24,'nattah','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','nattah@ccfng.org','NELSON','ATTAH','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI0LCJmTmFtZSI6Ik5FTFNPTiIsImxOYW1lIjoiQVRUQUgiLCJlbWFpbCI6Im5hdHRhaEBjY2ZuZy5vcmciLCJyb2xlSUQiOjIsImlhdCI6MTcxMTQwMDk0NiwiZXhwIjoxNzExNDg3MzQ2fQ.Zt_RifDFz7RNGim8U-ceuJeYybM22JixJ5jI_H2vHsE','2024-03-21 14:05:17','2024-03-25 21:09:06',2,6,NULL,1,'health informatics',NULL),(25,'eonyebuchi','password22','eonyebuchi@ccfgn.org','EVIDENCE','ONYEBUCHI',NULL,'2024-03-21 14:05:17','2024-03-24 21:39:10',2,6,NULL,1,'health informatics',NULL),(26,'Suzochukwu','password23','Suzochukwu@ccfng.org','SAMUEL UGOCHUKWU','UZOCHUKWU',NULL,'2024-03-21 14:05:17','2024-03-24 21:39:10',2,6,NULL,1,'health informatics',NULL),(27,'Satangcho','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Satangcho@ccfng.org','JOHN SHU','ATANGCHO',NULL,'2024-03-21 14:05:17','2024-03-25 07:34:29',2,7,NULL,1,'laboratory',NULL),(28,'Iokafor','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Iokafor@ccfng.org','IKENNA CALEB','OKAFOR',NULL,'2024-03-21 14:05:17','2024-03-27 04:43:46',2,7,NULL,1,'laboratory',NULL),(29,'cokeke','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','cokeke@ccfng.org','CLEMENT','OKEKE',NULL,'2024-03-21 14:05:17','2024-03-25 02:07:09',2,7,NULL,1,'laboratory',NULL),(30,'Cakujuobi','password27','Cakujuobi@ccfng.org','CHISOM','AKUJUOBI',NULL,'2024-03-21 14:05:17','2024-03-25 02:03:57',2,7,NULL,1,'laboratory',NULL),(31,'Eonokevbagba','password28','Eonokevbagba@ccfng.org','ONOKEVBAGBE','EDEWEDE',NULL,'2024-03-21 14:05:17','2024-03-25 02:03:57',2,7,NULL,1,'laboratory',NULL),(32,'Camuta','password29','Camuta@ccfng.org','CHUKWUEMEKA','AMUTA',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(33,'uamadi','password30','uamadi@ccfng.org','UCHECHUKWU','AMADI',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(34,'Cmaduka','password31','Cmaduka@ccfng.org','CHIKA','MADUKA',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(35,'mroland','password32','mroland@ccfng.org','ROWLAND','MORDI',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(36,'Jokwoli','password33','Jokwoli@ccfng.org','JONAS','OKWOLI',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(37,'aemehel','password34','aemehel@ccfng.org','ADA','EMEHEL',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,8,NULL,1,NULL,NULL),(38,'eerubami','password35','eerubami@ccfng.org','ENIOLA','ERUBAMI',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,9,NULL,1,NULL,NULL),(39,'aotu','password36','aotu@ccfng.org','GEORGE','OTU',NULL,'2024-03-21 14:05:17','2024-03-21 14:05:17',2,9,NULL,1,NULL,NULL),(40,'enwafor','password37','enwafor@ccfng.org','EUCHARIA','NWAFOR',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,9,NULL,1,NULL,NULL),(41,'goyinloye','password38','goyinloye@ccfng.org','GBEMINIYI','OYINLOYE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,9,NULL,1,NULL,NULL),(42,'oopara','password39','oopara@ccfng.org','ORJIUGO','OPARAH',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,9,NULL,1,NULL,NULL),(43,'dnnadi','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','dnnadi@ccfng.org','DONATUS','NNADI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjQzLCJmTmFtZSI6IkRPTkFUVVMiLCJsTmFtZSI6Ik5OQURJIiwiZW1haWwiOiJkbm5hZGlAY2Nmbmcub3JnIiwicm9sZUlEIjoyLCJpYXQiOjE3MTEzODE2NTcsImV4cCI6MTcxMTQ2ODA1N30.9sFPQDAG5nvzbBag8S61KamjS9Z1onMvjtCeVMXtP7c','2024-03-21 14:09:28','2024-03-25 15:47:37',2,9,NULL,1,'programs',NULL),(44,'oobal','password41','oobal@ccfng.org','OFEM','OBAL',NULL,'2024-03-21 14:09:28','2024-03-25 02:01:19',2,9,NULL,1,'programs',NULL),(45,'eugwuta','password42','eugwuta@ccfng.org','CHIEGOZIE EMMANUELA','UGWUTA',NULL,'2024-03-21 14:09:28','2024-03-25 02:01:19',2,9,NULL,1,'programs',NULL),(46,'Ieloka','password43','Ieloka@ccfng.org','IFEANYICHUKWU','ELOKA',NULL,'2024-03-21 14:09:28','2024-03-25 02:01:19',2,9,NULL,1,'programs',NULL),(47,'SNwobodo','password44','SNwobodo@ccfng.org','SYLVIA','NWOBODO',NULL,'2024-03-21 14:09:28','2024-03-25 02:01:19',2,9,NULL,1,'programs',NULL),(48,'JOkwor','password45','JOkwor@ccfng.org','JACINTA NNEOMA','OKWOR',NULL,'2024-03-21 14:09:28','2024-03-25 02:01:19',2,9,NULL,1,'programs',NULL),(49,'jezea','password46','jezea@ccfng.org','JOHNSON','EZE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,10,NULL,1,NULL,NULL),(50,'ondulue','password47','ondulue@ccfng.org','LINUS','NDULUE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,11,NULL,1,NULL,NULL),(51,'qmbuk','password48','qmbuk@ccfng.org','QUEEN','MBUK',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,11,NULL,1,NULL,NULL),(52,'seyo','password49','seyo@ccfng.org','SAVIOUR','EYO',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,11,NULL,1,NULL,NULL),(53,'dnwosu','password50','dnwosu@ccfng.org','DERICK','NWOSU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,11,NULL,1,NULL,NULL),(54,'gazuka','password51','gazuka@ccfng.org','GIFT','AZUKA',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(55,'echinoso','password52','echinoso@ccfng.org','CHINONSO JUDE','EGWUONWU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(56,'fagim','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','fagim@ccfng.org','FRANCIS','AGIM',NULL,'2024-03-21 14:09:28','2024-03-26 16:34:50',2,12,NULL,1,NULL,NULL),(57,'evengeline','password54','evengeline@gmail.com','EVANGELINE','UMUNNAKWE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(58,'ifeanyichukwu','password55','ifeanyichukwu@gmail.com','TIMOTY','IFEANYICHUKWU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(59,'umunnakwechibuonuprisca','password56','umunnakwechibuonuprisca@gmail.com','CHINBUONU PRISCA','UMUNNAKWE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(60,'Kugwadike','password57','Kugwadike@ccfng.org','KINGSLEY','UGWADIKE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(61,'onyebuchigeorge55','password58','onyebuchigeorge55@gmail.com','GEORGE ONYEBUCHI','GABRIEL',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,12,NULL,1,NULL,NULL),(62,'gogunlade','password59','gogunlade@ccfng.org','GABRIEL','OGUNLADE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,13,NULL,1,NULL,NULL),(63,'feze','password60','feze@ccfng.org','FELIX','EZE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(64,'uokoneccfng.org','password61','uokoneccfng.org','EYO','OKON',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(65,'aachegbulu','password62','aachegbulu','ADEJO COLINS','ACHEGBULU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(66,'bikpebe','password63','bikpebe@ccfng.org','BENJAMIN','IKPEBE',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(67,'eugwu','password64','eugwu@ccfng.org','ERNEST','UGWU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(68,'jejaidu','password65','jejaidu@ccfng.org','JOHN','EJAIDU',NULL,'2024-03-21 14:09:28','2024-03-21 14:09:28',2,14,NULL,1,NULL,NULL),(69,'jabonyi','password66','jabonyi@ccfng.org','ABONYI','JUDE',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(70,'Cuzoigwe','password67','Cuzoigwe@ccfng.org','UZOIGWE','CHIDOZIE',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(71,'Easiuweneta','password68','Easiuweneta@ccfng.org','ERIC ERUKE','ASIVWENETA',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(72,'Wkwaldet','password69','Wkwaldet@ccfng.org','KWALDET','WILLIAMS',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(73,'iuchogwu','password70','iuchogwu@ccfng.org','ISAH','UCHOGWU',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(74,'Cochi','password71','Cochi@ccfng.org','CAJETAN','OCHI',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,14,NULL,1,NULL,NULL),(75,'anzeako','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','anzeako@ccfng.org','NZEAKO','AMARA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjc1LCJmTmFtZSI6Ik5aRUFLTyIsImxOYW1lIjoiQU1BUkEiLCJlbWFpbCI6ImFuemVha29AY2Nmbmcub3JnIiwicm9sZUlEIjoyLCJpYXQiOjE3MTE1MTQ2NTIsImV4cCI6MTcxMTYwMTA1Mn0.EqawEnl5jsJJJTfsskCS_xDns4ytt4U1q7ZViyd-abM','2024-03-21 14:13:24','2024-03-27 04:44:12',2,15,NULL,1,'pharmacy',NULL),(76,'jamgah','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','jamgah@ccfng.org','JOHN','AMGAH',NULL,'2024-03-21 14:13:24','2024-03-25 02:07:09',2,15,NULL,1,'pharmacy',NULL),(77,'gottih','password74','gottih@ccfng.org','GERALD','OTTIH',NULL,'2024-03-21 14:13:24','2024-03-25 02:07:09',2,15,NULL,1,'pharmacy',NULL),(78,'Cben-Abuchi','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Cben-Abuchi@ccfng.org','AGATHA','BEN-ABUCHI',NULL,'2024-03-21 14:13:24','2024-03-25 02:09:55',2,15,NULL,1,'pharmacy',NULL),(79,'Achukwuagozie','$2b$10$zFsWw04LRqpV4jfPLaOEvO43GMLt5c2EnbvTGplKHneVZS7XgAnxK','Achukwuagozie@ccfng.org','CHUKWUAGOZIE','AMARA',NULL,'2024-03-21 14:13:24','2024-03-25 02:07:09',2,15,NULL,1,'pharmacy',NULL),(80,'sekeh','password77','sekeh@ccfng.org','SANDRA CHINWE','EKEH',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(81,'inwakamm','password78','inwakamm@ccfng.org','IKENNA','NWAKAMMA',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(82,'pedoja','password79','pedoja@ccfng.org','PRECIOUS','EDOJA',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(83,'eukpabi','password80','eukpabi@ccfng.org','EMEKE GODSWILL','UKPABI',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(84,'gobokon','password81','gobokon@ccfng.org','GABRIEL','OBOKON',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(85,'ajideofor','password82','ajideofor@ccfng.org','JIDEOFOR','AMAKA',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL),(86,'FEnwerem','password83','FEnwerem@ccfng.org','FRANKLIN','ENWEREM',NULL,'2024-03-21 14:13:24','2024-03-21 14:13:24',2,16,NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vehicle`
--

DROP TABLE IF EXISTS `Vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Vehicle` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `vehicle_name` varchar(255) NOT NULL,
  `unit_id` int DEFAULT NULL,
  `availability_status` varchar(50) NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `unit_id` (`unit_id`),
  CONSTRAINT `Vehicle_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `Unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vehicle`
--

LOCK TABLES `Vehicle` WRITE;
/*!40000 ALTER TABLE `Vehicle` DISABLE KEYS */;
/*!40000 ALTER TABLE `Vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Workplan`
--

DROP TABLE IF EXISTS `Workplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Workplan` (
  `workplan_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('Pending','Approved','Declined') NOT NULL DEFAULT 'Pending',
  `workplan_type` int DEFAULT '1',
  `workplan_day` varchar(255) DEFAULT NULL,
  `workplan_date` date DEFAULT NULL,
  `creation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `approval_date` timestamp NULL DEFAULT NULL,
  `workplan_week_id` int DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `logistic` enum('no','yes','accommodation') NOT NULL DEFAULT 'no',
  `assigned_pilot_id` int DEFAULT NULL,
  `is_unit` tinyint(1) DEFAULT '0',
  `is_srt` tinyint(1) DEFAULT '0',
  `is_dept` tinyint(1) DEFAULT '0',
  `implementing_team_id` int DEFAULT NULL,
  `authorizer` int NOT NULL DEFAULT '25',
  `decline_reason` varchar(255) DEFAULT NULL,
  `decline_date` timestamp NULL DEFAULT NULL,
  `user_unit` varchar(225) DEFAULT NULL,
  `vehicle_name` varchar(255) DEFAULT NULL,
  `pilot_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`workplan_id`),
  KEY `user_id` (`user_id`),
  KEY `workplan_week_id` (`workplan_week_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `assigned_pilot_id` (`assigned_pilot_id`),
  KEY `implementing_team_id` (`implementing_team_id`),
  CONSTRAINT `Workplan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `Workplan_ibfk_2` FOREIGN KEY (`workplan_week_id`) REFERENCES `workplan_week` (`workplan_week_id`),
  CONSTRAINT `Workplan_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle` (`vehicle_id`),
  CONSTRAINT `Workplan_ibfk_4` FOREIGN KEY (`assigned_pilot_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `Workplan_ibfk_5` FOREIGN KEY (`implementing_team_id`) REFERENCES `implementing_team` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Workplan`
--

LOCK TABLES `Workplan` WRITE;
/*!40000 ALTER TABLE `Workplan` DISABLE KEYS */;
INSERT INTO `Workplan` VALUES (213,20,'workplan for tuesday','for folder auditing','Approved',1,'tuesday','2024-03-23','2024-03-27 13:43:43','2024-03-27 12:43:48',NULL,NULL,'dmmm','ahieke','09:00:00','no',NULL,0,0,0,NULL,43,NULL,NULL,'health informatics',NULL,NULL),(214,20,'workplan for monday','for folder auditing','Approved',1,'monday','2024-03-23','2024-03-27 13:50:19','2024-03-27 12:50:39',NULL,NULL,'dmmm','ahieke','09:00:00','no',NULL,0,0,0,NULL,43,NULL,NULL,'health informatics',NULL,NULL),(215,20,'workplan for wednesday','for folder auditing','Approved',1,'wednesday','2024-03-23','2024-03-27 13:50:23','2024-03-27 12:50:41',NULL,NULL,'dmmm','ahieke','09:00:00','no',NULL,0,0,0,NULL,43,NULL,NULL,'health informatics',NULL,NULL),(216,20,'workplan for thursday','for folder auditing','Approved',1,'thursday','2024-03-23','2024-03-27 13:50:28','2024-03-27 12:50:42',NULL,NULL,'dmmm','ahieke','09:00:00','no',NULL,0,0,0,NULL,43,NULL,NULL,'health informatics',NULL,NULL),(217,20,'workplan for friday','for folder auditing','Approved',1,'friday','2024-03-23','2024-03-27 13:50:33','2024-03-27 12:50:43',NULL,NULL,'dmmm','ahieke','09:00:00','no',NULL,0,0,0,NULL,43,NULL,NULL,'health informatics',NULL,NULL);
/*!40000 ALTER TABLE `Workplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `implementing_team`
--

DROP TABLE IF EXISTS `implementing_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `implementing_team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workplan_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `fk_workplan_id` (`workplan_id`),
  CONSTRAINT `fk_workplan_id` FOREIGN KEY (`workplan_id`) REFERENCES `Workplan` (`workplan_id`),
  CONSTRAINT `implementing_team_ibfk_1` FOREIGN KEY (`workplan_id`) REFERENCES `workplan` (`workplan_id`),
  CONSTRAINT `implementing_team_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=302 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `implementing_team`
--

LOCK TABLES `implementing_team` WRITE;
/*!40000 ALTER TABLE `implementing_team` DISABLE KEYS */;
/*!40000 ALTER TABLE `implementing_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workplan_week`
--

DROP TABLE IF EXISTS `workplan_week`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workplan_week` (
  `workplan_week_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`workplan_week_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workplan_week`
--

LOCK TABLES `workplan_week` WRITE;
/*!40000 ALTER TABLE `workplan_week` DISABLE KEYS */;
/*!40000 ALTER TABLE `workplan_week` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-27 15:14:03

-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2020 at 05:32 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dormmatedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `applicants`
--

CREATE TABLE `applicants` (
  `CHATROOMID` int(128) NOT NULL,
  `LOBBYID` int(16) NOT NULL,
  `APPLICANTID` int(12) NOT NULL,
  `APPROVED` enum('T','F','W') NOT NULL DEFAULT 'W'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `applicants`
--

INSERT INTO `applicants` (`CHATROOMID`, `LOBBYID`, `APPLICANTID`, `APPROVED`) VALUES
(36, 85, 18, 'W');

-- --------------------------------------------------------

--
-- Table structure for table `lobby`
--

CREATE TABLE `lobby` (
  `LOBBYID` int(16) NOT NULL,
  `SEARCHSTATE` enum('Waiting','Full','Closed') NOT NULL DEFAULT 'Waiting',
  `LOBBYHOSTID` int(12) NOT NULL,
  `TITLE` varchar(32) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `DATE` date NOT NULL,
  `VIEWS` int(7) NOT NULL DEFAULT 0,
  `ROOMMATEMAX` int(2) NOT NULL DEFAULT 2,
  `ROOMMATECOUNT` int(2) NOT NULL DEFAULT 1,
  `AGEMIN` int(2) NOT NULL DEFAULT 16,
  `AGEMAX` int(2) NOT NULL DEFAULT 99,
  `GENDERSELECT` enum('Male','Female','Other') DEFAULT NULL,
  `STUDENTSONLY` enum('Verified Only','Yes','No') NOT NULL DEFAULT 'No',
  `NOSMOKING` enum('T','Outdoor Only','F') NOT NULL DEFAULT 'F',
  `NOALCOHOL` enum('T','Outdoor Only','F') NOT NULL DEFAULT 'F',
  `NOPETS` enum('T','F') NOT NULL DEFAULT 'F'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lobby`
--

INSERT INTO `lobby` (`LOBBYID`, `SEARCHSTATE`, `LOBBYHOSTID`, `TITLE`, `DESCRIPTION`, `DATE`, `VIEWS`, `ROOMMATEMAX`, `ROOMMATECOUNT`, `AGEMIN`, `AGEMAX`, `GENDERSELECT`, `STUDENTSONLY`, `NOSMOKING`, `NOALCOHOL`, `NOPETS`) VALUES
(85, 'Waiting', 9, 'Roommates for hire', 'Near talamban campus, im a pyschology student. Need inspiration for finals', '2020-12-11', 135, 4, 3, 16, 31, 'Male', 'Yes', 'T', 'T', 'T'),
(96, 'Waiting', 1, 'Looking for Roomies', 'Near talamban campus, im a pyschology student. Need inspiration for finals', '2020-12-10', 86, 12, 1, 19, 27, 'Female', 'Yes', 'T', 'F', 'T'),
(97, 'Waiting', 12, 'Roommates for hire', 'I need 2 roommates preferably engineering students so we can help each other out in times of exams.', '0000-00-00', 16, 3, 1, 16, 22, 'Male', 'Yes', 'T', 'T', 'T'),
(98, 'Waiting', 11, 'Roommates x Artist', 'Needs atleast 2 roommates to live with me on south street talamban', '2020-12-09', 8, 2, 1, 25, 27, 'Male', 'Yes', 'T', 'T', 'T'),
(103, 'Waiting', 17, 'I NEED ROOMMATES (CONSOLACION)', 'anyone please', '2020-12-12', 1, 3, 1, 27, 31, 'Male', 'Yes', 'T', 'T', 'F');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `LOCATIONID` int(128) NOT NULL,
  `LOBBYID` int(16) NOT NULL,
  `NAME` varchar(16) NOT NULL,
  `IMAGE` varchar(1024) DEFAULT NULL,
  `ADDRESS` varchar(255) NOT NULL,
  `RENTINGBUDGET` double(12,5) NOT NULL DEFAULT 0.00000,
  `BOOKINGLINK` varchar(255) DEFAULT NULL,
  `EMAIL` varchar(160) DEFAULT NULL,
  `TELEPHONE` varchar(15) DEFAULT NULL,
  `WIFI` enum('T','F') NOT NULL DEFAULT 'F',
  `UPVOTES` int(2) NOT NULL DEFAULT 0,
  `DOWNVOTES` int(2) NOT NULL DEFAULT 0,
  `FINALLOCATION` enum('T','F') NOT NULL DEFAULT 'F'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`LOCATIONID`, `LOBBYID`, `NAME`, `IMAGE`, `ADDRESS`, `RENTINGBUDGET`, `BOOKINGLINK`, `EMAIL`, `TELEPHONE`, `WIFI`, `UPVOTES`, `DOWNVOTES`, `FINALLOCATION`) VALUES
(44, 85, 'Acilia Suites', 'https://i.pinimg.com/originals/2f/d5/81/2fd581d52f8d9b1e057f41896a61a5d8.png', 'Cebu City', 10000.00000, 'www.facebook.com', 'lebumfacilrenzo@yahoo.com', '260923452', 'T', 0, 0, 'F'),
(55, 96, 'Sunside Dorm', 'https://q-xx.bstatic.com/xdata/images/hotel/max500/183092363.jpg?k=bfc633c0815ef3f40570b332bd128625e795f4f4b8240ed38d16ab0307e7281b&o=', 'Talamban, Cebu City', 12000.00000, 'none', 'nats@gmail.com', '09655867131', 'T', 0, 0, 'F'),
(56, 97, 'Sunside Dorm', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_URn5JIkA5L9vKjEhl63tbmLnpURJEvs-UQ&usqp=CAU', 'Talisay City, Cebu', 12000.00000, 'none', '18102936@usc.edu.ph', '09234423425', 'T', 0, 0, 'F'),
(57, 98, 'Pacific Mall', 'https://lh3.googleusercontent.com/proxy/zWEcwManed7OvKD3aTbZMDl1mLJ6Jp7kgLnjsoSxTYbgsUPc2wqGiX2rZxLQmEr1nH_ngwhaVLviy9Tlw8uQO-upNFURRv2oRAHhyg3DNuGMnE14lgAALwsjMhhgRg', 'Mandaue City, Cebu', 10000.00000, 'none', 'none', '09655867131', 'T', 0, 0, 'F'),
(62, 103, 'CONSOLACION DORM', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/LoyolaMD_Dorm.JPG/220px-LoyolaMD_Dorm.JPG', 'Consolacion, Cebu', 5000.00000, 'facebook.com', 'johnangeloal282@gmail.com', '09158898717', 'T', 0, 0, 'F');

-- --------------------------------------------------------

--
-- Table structure for table `roommate`
--

CREATE TABLE `roommate` (
  `ROOMMATEID` int(12) NOT NULL,
  `LOBBYID` int(16) NOT NULL,
  `USERID` int(12) NOT NULL,
  `DEACTIVATE` enum('Active','Leave','Kicked') NOT NULL DEFAULT 'Active',
  `KICKVOTES` int(2) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roommate`
--

INSERT INTO `roommate` (`ROOMMATEID`, `LOBBYID`, `USERID`, `DEACTIVATE`, `KICKVOTES`) VALUES
(13, 85, 9, 'Active', 0),
(24, 96, 1, 'Active', 0),
(25, 97, 12, 'Active', 0),
(26, 98, 11, 'Active', 0),
(52, 103, 17, 'Active', 0),
(59, 85, 13, 'Active', 0),
(60, 85, 15, 'Active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `roommatechat`
--

CREATE TABLE `roommatechat` (
  `ROOMCHATID` int(255) NOT NULL,
  `DATE` varchar(32) NOT NULL,
  `TIME` varchar(32) NOT NULL,
  `CHATMESSAGE` varchar(255) NOT NULL,
  `UNSEND` enum('T','F') NOT NULL,
  `USERID` int(12) DEFAULT NULL,
  `LOBBYID` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roommatechat`
--

INSERT INTO `roommatechat` (`ROOMCHATID`, `DATE`, `TIME`, `CHATMESSAGE`, `UNSEND`, `USERID`, `LOBBYID`) VALUES
(1, '2020-12-10', '12:32 pm', 'HELLO', 'T', 9, 85),
(2, '2020-12-10', '4:09 pm', 'Ola', 'T', 13, 85),
(3, '2020-12-10', '4:10 pm', 'Wehehe', 'T', 9, 85),
(5, '2020-12-11', '5:28 pm', 'HI MGA CHOI', 'T', 15, 85),
(6, '2020-12-14', '10:09 pm', 'SAMPLE CHAT', 'T', 17, 103);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `USERID` int(12) NOT NULL,
  `USERNAME` varchar(36) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `DEACTIVATE` enum('T','F') NOT NULL DEFAULT 'F',
  `PASSWORD` varchar(128) NOT NULL,
  `UPVOTE` int(2) NOT NULL,
  `DOWNVOTE` int(2) NOT NULL,
  `PROFILEPICTURE` varchar(1028) DEFAULT 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png',
  `FIRSTNAME` varchar(128) NOT NULL,
  `LASTNAME` varchar(128) NOT NULL,
  `GENDER` enum('Male','Female','Other') NOT NULL,
  `BIRTHDAY` date NOT NULL,
  `OCCUPATION` varchar(128) DEFAULT NULL,
  `SCHOOLNAME` varchar(128) DEFAULT NULL,
  `SCHOOLID` varchar(32) DEFAULT NULL,
  `SCHOOLLEVEL` enum('Secondary','Tertiary') DEFAULT NULL,
  `VERIFIEDSTUDENT` enum('T','Pending','F') NOT NULL,
  `SMOKING` enum('Yes','Outdoor','No') NOT NULL,
  `ALCOHOL` enum('Yes','Outdoor','No') NOT NULL,
  `PETS` enum('Yes','No') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`USERID`, `USERNAME`, `EMAIL`, `DEACTIVATE`, `PASSWORD`, `UPVOTE`, `DOWNVOTE`, `PROFILEPICTURE`, `FIRSTNAME`, `LASTNAME`, `GENDER`, `BIRTHDAY`, `OCCUPATION`, `SCHOOLNAME`, `SCHOOLID`, `SCHOOLLEVEL`, `VERIFIEDSTUDENT`, `SMOKING`, `ALCOHOL`, `PETS`) VALUES
(1, 'nats', 'nats@gmail.com', 'F', 'n', 0, 0, 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.0-9/125451152_188020802893488_2482497288981534697_o.jpg?_nc_cat=101&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeFCd7cnVieaJ0-Hp0jrD5wE5pEPgk2aHgzmkQ-CTZoeDGNnz3QVpuJv6ooT1ro7gpwy5FW_l9HzXWThAA4zyjNR&_nc_ohc=7_BCKNpChN0AX8epOpZ&_nc_ht=scontent.fceb2-1.fna&oh=e3a8abcf4ce8a2fa166106e4d0205dd0&oe=5FF21A94', 'Nats', 'Ramos', 'Male', '2020-12-01', 'teacher', '', '', '', 'F', 'No', 'Yes', 'No'),
(9, 'Soy', 'lebumfacilrenzo@yahoo.com', 'F', 's', 0, 0, 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.0-9/72073301_2672988359407469_7635740408135286784_o.jpg?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeFSwSYGhZb1d1gKmib1OjihmGA7o2bRd92YYDujZtF33dSnKRL5K_fmKtDQ-BFLKSbd4TBMGsMf3WtQlpg-gLX3&_nc_ohc=RerD8_Cu5qgAX9XSy0h&_nc_ht=scontent.fceb2-1.fna&oh=9246c27ad14e2d2dcfc718b3fa197d56&oe=5FF0BBA8', 'Soy', 'Leb', 'Male', '2001-01-02', 'student', 'ctu', '18102936', '', 'T', 'No', 'No', 'No'),
(11, 'Jithyl', 'jith@gmail.com', 'F', 'j', 0, 0, 'https://scontent.fceb2-1.fna.fbcdn.net/v/t1.0-9/117403439_713430339207750_3786110754214634415_o.jpg?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_eui2=AeF35qfHz3O2wPVLLdlZBXxUbbc3O5m9NMZttzc7mb00xpgQbZ5HsDGPx_PGY5JWpO4eIXoXzcGEipNQIsbPVpic&_nc_ohc=LuaKN_Xe5JwAX-caKVH&_nc_ht=scontent.fceb2-1.fna&oh=5e671166da1dabca2fed6077c4acd40d&oe=5FF4B21A', 'Jithyl', 'Salad', 'Male', '1999-05-02', 'Artist', 'CTU', '18181818', '', 'T', 'No', 'No', 'Yes'),
(12, 'Lester', 'lest@gmail.com', 'F', 'l', 0, 0, 'https://scontent.fceb2-2.fna.fbcdn.net/v/t1.0-9/118611804_3127491574143763_1578506604954714783_n.jpg?_nc_cat=107&ccb=2&_nc_sid=174925&_nc_eui2=AeGmFBi9G1mb2YFnarTZdSsNLqOURHqwQqYuo5REerBCpvD8J4L_qvmghPPpvbiZtSLXHjJbpPc8039QEnX8z58d&_nc_ohc=3USobRqQhp0AX_xf7EP&_nc_ht=scontent.fceb2-2.fna&oh=52a73f72b5d2fb3dd7400cccd5b954a7&oe=5FF2C2AF', 'Lester', 'Terol', 'Male', '2020-02-05', 'Civil', '', '', '', 'F', 'Yes', 'Yes', 'Yes'),
(13, 'thers', 'sunalegre7@gmail.com', 'F', 'asd', 0, 0, 'https://image.freepik.com/free-vector/cute-panda-paws-up-wall-panda-face-cartoon-icon_42750-498.jpg', 'Therese', 'Alegre', 'Female', '2020-12-07', 'None', 'University of San Carlo', '18105979', 'Tertiary', 'T', '', '', 'Yes'),
(14, 'hosea', 'johnangeloal282@gmail.com', 'F', 'asd', 0, 0, 'https://image.shutterstock.com/image-vector/profile-placeholder-image-gray-silhouette-260nw-1153673752.jpg', 'hosea', 'barriga', 'Male', '2020-12-16', '', '', '', 'Secondary', 'F', 'No', 'No', 'Yes'),
(15, 'James', 'james@gmail.com', 'F', 'asd', 0, 0, 'https://image.shutterstock.com/image-vector/profile-placeholder-image-gray-silhouette-260nw-1153673752.jpg', 'James', 'Sia', 'Male', '2020-12-01', 'Student', 'University of San Carlos', '18105979', 'Tertiary', 'T', 'Yes', 'Yes', 'Yes'),
(16, 'Natalie', 'natalie@gmail.com', 'F', 'asd', 0, 0, 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png', 'Natalie', 'Sagnoy', 'Female', '2020-12-31', 'Student', 'University of San Carlos', '18105979', 'Tertiary', 'T', '', '', 'Yes'),
(17, 'John', 'johnangelo_al@yahoo.com', 'F', 'asd', 0, 0, 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png', 'John', 'Alegre', 'Male', '2020-12-31', 'Student', 'University of San Carlos', '18105979', 'Secondary', 'T', 'No', 'No', 'Yes'),
(18, 'Sample', 'sample@gmail.com', 'F', 'asd', 0, 0, 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png', 'Sample', 'Account', 'Female', '2020-12-31', 'Student', '', '', 'Secondary', 'F', 'No', 'No', 'Yes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applicants`
--
ALTER TABLE `applicants`
  ADD PRIMARY KEY (`CHATROOMID`),
  ADD KEY `APPLICATIONCHATROOM_FK1` (`LOBBYID`),
  ADD KEY `APPLICATIONCHATROOM_FK2` (`APPLICANTID`);

--
-- Indexes for table `lobby`
--
ALTER TABLE `lobby`
  ADD PRIMARY KEY (`LOBBYID`),
  ADD KEY `LOBBY_FK` (`LOBBYHOSTID`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`LOCATIONID`),
  ADD KEY `LOCATION_FK` (`LOBBYID`);

--
-- Indexes for table `roommate`
--
ALTER TABLE `roommate`
  ADD PRIMARY KEY (`ROOMMATEID`),
  ADD KEY `ROOMMATE_FK1` (`LOBBYID`),
  ADD KEY `ROOMMATE_FK2` (`USERID`);

--
-- Indexes for table `roommatechat`
--
ALTER TABLE `roommatechat`
  ADD PRIMARY KEY (`ROOMCHATID`),
  ADD KEY `USERID` (`USERID`),
  ADD KEY `LOBBYID` (`LOBBYID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`USERID`),
  ADD UNIQUE KEY `USERNAME` (`USERNAME`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applicants`
--
ALTER TABLE `applicants`
  MODIFY `CHATROOMID` int(128) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `lobby`
--
ALTER TABLE `lobby`
  MODIFY `LOBBYID` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `LOCATIONID` int(128) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `roommate`
--
ALTER TABLE `roommate`
  MODIFY `ROOMMATEID` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `roommatechat`
--
ALTER TABLE `roommatechat`
  MODIFY `ROOMCHATID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `USERID` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applicants`
--
ALTER TABLE `applicants`
  ADD CONSTRAINT `APPLICATIONCHATROOM_FK1` FOREIGN KEY (`LOBBYID`) REFERENCES `lobby` (`LOBBYID`),
  ADD CONSTRAINT `APPLICATIONCHATROOM_FK2` FOREIGN KEY (`APPLICANTID`) REFERENCES `users` (`USERID`);

--
-- Constraints for table `lobby`
--
ALTER TABLE `lobby`
  ADD CONSTRAINT `LOBBY_FK` FOREIGN KEY (`LOBBYHOSTID`) REFERENCES `users` (`USERID`);

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `LOCATION_FK` FOREIGN KEY (`LOBBYID`) REFERENCES `lobby` (`LOBBYID`);

--
-- Constraints for table `roommate`
--
ALTER TABLE `roommate`
  ADD CONSTRAINT `ROOMMATE_FK1` FOREIGN KEY (`LOBBYID`) REFERENCES `lobby` (`LOBBYID`),
  ADD CONSTRAINT `ROOMMATE_FK2` FOREIGN KEY (`USERID`) REFERENCES `users` (`USERID`);

--
-- Constraints for table `roommatechat`
--
ALTER TABLE `roommatechat`
  ADD CONSTRAINT `roommatechat_ibfk_1` FOREIGN KEY (`USERID`) REFERENCES `users` (`USERID`),
  ADD CONSTRAINT `roommatechat_ibfk_2` FOREIGN KEY (`LOBBYID`) REFERENCES `lobby` (`LOBBYID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

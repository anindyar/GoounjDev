--
-- Dumping data for the table 'auth_type'
--
INSERT INTO `goounj`.`auth_type` (`type`) VALUES ('login');
INSERT INTO `goounj`.`auth_type` (`type`) VALUES ('facebook');
INSERT INTO `goounj`.`auth_type` (`type`) VALUES ('twitter');

--
-- Dumping data for the table 'poll_type'
--
INSERT INTO `goounj`.`poll_type` (`type`) VALUES ('quick');
INSERT INTO `goounj`.`poll_type` (`type`) VALUES ('opinion');
INSERT INTO `goounj`.`poll_type` (`type`) VALUES ('feedback');

--
-- Dumping data for the table 'question_type'
--
INSERT INTO `goounj`.`question_type` (`type`) VALUES ('text');
INSERT INTO `goounj`.`question_type` (`type`) VALUES ('image');
INSERT INTO `goounj`.`question_type` (`type`) VALUES ('audio');
INSERT INTO `goounj`.`question_type` (`type`) VALUES ('video');

--
-- Dumping data for the table 'role'
--
INSERT INTO `goounj`.`role` (`type`) VALUES ('user');
INSERT INTO `goounj`.`role` (`type`) VALUES ('customer');
INSERT INTO `goounj`.`role` (`type`) VALUES ('admin');

--
-- Dumping data for the table 'visibility_type'
--
INSERT INTO `goounj`.`visibility_type` (`type`) VALUES ('visible');
INSERT INTO `goounj`.`visibility_type` (`type`) VALUES ('hidden');

--
-- Dumping data for the table 'reward_type'
--
INSERT INTO `goounj`.`reward_type` (`type`, `points`) VALUES ('free', '0');

--
-- Dumping data for categories
--
INSERT INTO `goounj`.`category` (`name`) VALUES ('Art & Culture');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Education');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Entertainment');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Sports');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Science & Technology');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Neighbourhood & Society');
INSERT INTO `goounj`.`category` (`name`) VALUES ('People');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Philosophy & Thinking');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Religion & Belief System');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Nature & Wild Life');
INSERT INTO `goounj`.`category` (`name`) VALUES ('History & Events');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Geography & Places');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Lifestyle & Shopping');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Health & Fitness');
INSERT INTO `goounj`.`category` (`name`) VALUES ('General Reference');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Latest Trends');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Mathematics & Logic');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Travel & Tourism');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Photography');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Food & Beverages');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Beauty & Personal Care');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Life & Concepts');
INSERT INTO `goounj`.`category` (`name`) VALUES ('Others');

--
-- Dumping data for feedback
--
INSERT INTO `goounj`.`feedback_type` (`name`) VALUES ('Request');
INSERT INTO `goounj`.`feedback_type` (`name`) VALUES ('Complaints');
INSERT INTO `goounj`.`feedback_type` (`name`) VALUES ('Others');
INSERT INTO `goounj`.`modules` (`name`) VALUES ('Poll');
INSERT INTO `goounj`.`modules` (`name`) VALUES ('Survey');
INSERT INTO `goounj`.`modules` (`name`) VALUES ('Vote');

--
-- Dumping data for initial user
--
INSERT INTO `user` VALUES (1,'Goounj Bvocal','admin@bvocal.in','1234567890',NULL,'cfb84fad6d3f906872a2a7eba8e7a23acdfc3daee02ccf94f2360384879464de','9b454de447e83dd75b338254d5b7d415034d2565528b2b874f3aa6000cad3dfc114a12a932bd44000699da8369297d7b96ab08f82f25ead2313d75dcd1156675',NULL,NULL,'2015-10-31 02:25:17','2015-10-31 02:25:17','2015-10-31 02:25:17',1,'3436',1,1,'India','Chennai',91,'1234567890','de123vice123tok123en','Android','4.4', '1');


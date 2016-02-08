USE `goounj`;
DROP procedure IF EXISTS `setAudienceForSurvey`;

DELIMITER //
USE `goounj`//
CREATE DEFINER=`root`@`localhost` PROCEDURE `setAudienceForSurvey`(IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45), IN utcTimeStamp DATETIME, IN name VARCHAR(45), OUT userId INT(11), OUT deviceToken VARCHAR(200))
    DETERMINISTIC
    COMMENT 'Procedure to assign audience to a survey'
BEGIN
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
SET deviceToken := (SELECT device_token FROM user WHERE phone = phoneNumber LIMIT 1);
UPDATE user SET name = name WHERE id = userId;
INSERT INTO audience_poll_map (user_id, poll_id, poll_answered_time, is_answered) VALUES (userId, pollId, utcTimeStamp, 1);
END//
DELIMITER ;

USE `goounj`;
DROP procedure IF EXISTS `deletePoll`;
DELIMITER //
CREATE PROCEDURE `deletePoll`(IN pollId int(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to delete a poll'
BEGIN
DECLARE questionId int;
SET questionId := (SELECT id FROM question WHERE poll_id = pollId LIMIT 1);
WHILE (questionId IS NOT NULL) DO
    DELETE FROM answer WHERE question_id = questionId;
	DELETE FROM question_options WHERE question_id = questionId;
DELETE FROM question 
WHERE
    id = questionId;
    SET questionId := (SELECT id FROM question WHERE poll_id = pollId LIMIT 1);
END WHILE;
DELETE FROM audience_poll_map 
WHERE
    poll_id = pollId;
DELETE FROM category_poll_map 
WHERE
    poll_id = pollId;
DELETE FROM poll 
WHERE
    id = pollId;
END//
DELIMITER ;

USE `goounj`;
DROP procedure IF EXISTS `deleteUser`;
DELIMITER //
CREATE PROCEDURE `deleteUser`(IN userId INT(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to delete an user'
BEGIN
DECLARE pollId int;
SET pollId := (SELECT id FROM poll WHERE created_user_id = userId LIMIT 1);
WHILE (pollId IS NOT NULL) DO
	CALL deletePoll(pollId);
    SET pollId := (SELECT id FROM poll WHERE created_user_id = userId LIMIT 1);
END WHILE;
IF pollId IS NULL THEN
		DELETE FROM user WHERE id = userId;
    END IF;
END//
DELIMITER ;

USE `goounj`;
DROP procedure IF EXISTS `setAudienceForPoll`;
DELIMITER //
CREATE PROCEDURE `setAudienceForPoll` (IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to assign audience to a poll'
BEGIN
DECLARE userId int;
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
INSERT INTO audience_poll_map (user_id, poll_id) VALUES (userId, pollId);
END//
DELIMITER ;

USE `goounj`;
DROP procedure IF EXISTS `updateAuthCode`;
DELIMITER //
CREATE PROCEDURE `updateAuthCode` (IN authCode VARCHAR(45), IN phoneNumber VARCHAR(45), IN userVerified TINYINT(1), OUT publicKey VARCHAR(120), OUT secretKey VARCHAR(200), OUT userId VARCHAR(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to create a new user'
BEGIN
UPDATE user SET auth_code = authCode, is_verified = userVerified WHERE phone = phoneNumber;
SELECT secret_key, public_key, id
INTO secretKey, publicKey, userId
FROM user
WHERE phone = phoneNumber;
END//
DELIMITER ;
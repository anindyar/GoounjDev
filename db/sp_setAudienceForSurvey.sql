USE `goounj`;
DROP procedure IF EXISTS `setAudienceForSurvey`;

DELIMITER $$
USE `goounj`$$
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
END$$

DELIMITER ;


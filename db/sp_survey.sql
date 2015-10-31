USE `goounj`;
DROP procedure IF EXISTS `setAudienceForSurvey`;

DELIMITER $$
USE `goounj`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `setAudienceForSurvey`(IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45), IN utcTimeStamp DATETIME, OUT userId INT(11))
    DETERMINISTIC
    COMMENT 'Procedure to assign audience to a survey'
BEGIN
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
INSERT INTO audience_poll_map (user_id, poll_id) VALUES (userId, pollId);
UPDATE audience_poll_map SET poll_answered_time = utcTimeStamp, is_answered = 1 WHERE poll_id = pollId AND user_id = userId;
SELECT userId;
END$$

DELIMITER ;


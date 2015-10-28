USE `goounj`;
DROP procedure IF EXISTS `deletePoll`;

DELIMITER $$
USE `goounj`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deletePoll`(IN pollId int(45))
    DETERMINISTIC
    COMMENT 'Procedure to delete a poll'
BEGIN
DECLARE questionId int;
SET questionId := (SELECT id FROM question WHERE poll_id = pollId LIMIT 1);
WHILE (questionId IS NOT NULL) DO
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
END$$

DELIMITER ;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(IN userId INT(45))
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
END
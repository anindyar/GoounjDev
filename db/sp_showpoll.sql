USE `goounj`;
DROP procedure IF EXISTS `showPoll`;

DELIMITER $$
USE `goounj`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `showPoll`(IN pollId INT(45), OUT pollName VARCHAR(45), OUT fName VARCHAR(45), OUT lName VARCHAR(45), OUT startDate DATETIME(6), OUT endDate DATETIME(6), OUT questionList VARCHAR(225), OUT choiceList VARCHAR(225))
    COMMENT 'Procedure to display poll'
BEGIN
DECLARE temp_question, choiceList VARCHAR(225);
DECLARE exit_loop BOOLEAN;
DECLARE curs CURSOR FOR SELECT id FROM question WHERE poll_id = pollId;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;
SELECT 
    poll_name, start_date, end_date
INTO pollName , startDate , endDate FROM
    poll
WHERE
    id = pollId;
SELECT 
    first_name, last_name
INTO fName , lName FROM
    user
WHERE
    id = (SELECT 
            created_user_id
        FROM
            poll
        WHERE
            id = pollId);
SELECT 
    question
INTO questionList FROM
    question
WHERE
    poll_id = pollId;
OPEN curs;
choices_loop: LOOP
	FETCH curs INTO temp_question;
SELECT 
    `option`
INTO @choices FROM
    question_options
WHERE
    question_id = temp_question;
    SET choiceList = CONCAT(@choices,";",choiceList);
    IF exit_loop THEN 
		CLOSE curs;
        LEAVE choices_loop;
	END IF;
END LOOP choices_loop;
END$$

DELIMITER ;
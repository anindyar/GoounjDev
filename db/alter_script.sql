ALTER TABLE `goounj`.`answer`
ADD COLUMN `poll_id` INT(11) NOT NULL AFTER `user_id`,
ADD INDEX `fk_answer_poll1_idx` (`poll_id` ASC);
ALTER TABLE `goounj`.`answer`
ADD CONSTRAINT `fk_answer_poll1`
  FOREIGN KEY (`poll_id`)
  REFERENCES `goounj`.`poll` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
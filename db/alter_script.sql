ALTER TABLE `goounj`.`vote`
DROP FOREIGN KEY `fk_vote_nominee1`;
ALTER TABLE `goounj`.`vote`
CHANGE COLUMN `nominee_id` `candidate_id` INT(11) NOT NULL ;
ALTER TABLE `goounj`.`vote`
ADD CONSTRAINT `fk_vote_candidate1`
  FOREIGN KEY (`candidate_id`)
  REFERENCES `goounj`.`candidate` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `goounj`.`association_user_map`
ADD COLUMN `is_active` TINYINT(1) NULL DEFAULT 1 AFTER `association_id`;

ALTER TABLE `goounj`.`election_user_map`
ADD COLUMN `is_active` TINYINT(1) NULL DEFAULT 1 AFTER `association_id`;

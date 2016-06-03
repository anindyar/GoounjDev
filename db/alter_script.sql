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

ALTER TABLE `goounj`.`vote`
DROP COLUMN `time`;

-- -----------------------------------------------------
-- Table `goounj`.`feedback_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`feedback_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`modules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`modules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`feedback` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comments` VARCHAR(245) NOT NULL,
  `feedback_type_id` INT NOT NULL,
  `modules_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  INDEX `fk_feedback_feedback_type1_idx` (`feedback_type_id` ASC),
  INDEX `fk_feedback_modules1_idx` (`modules_id` ASC),
  INDEX `fk_feedback_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_feedback_feedback_type1`
    FOREIGN KEY (`feedback_type_id`)
    REFERENCES `goounj`.`feedback_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_feedback_modules1`
    FOREIGN KEY (`modules_id`)
    REFERENCES `goounj`.`modules` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_feedback_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema goounj
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `goounj`;
-- -----------------------------------------------------
-- Schema goounj
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `goounj` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `goounj` ;

-- -----------------------------------------------------
-- Table `goounj`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`auth_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`auth_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NOT NULL,
  `password` VARCHAR(120) NULL,
  `public_key` VARCHAR(120) NULL,
  `secret_key` VARCHAR(200) NULL,
  `gender` VARCHAR(45) NULL,
  `age` INT NULL,
  `access_time` DATETIME NULL,
  `created_time` DATETIME NULL,
  `updated_time` DATETIME NULL,
  `is_verified` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  `auth_code` VARCHAR(45) NULL,
  `role_id` INT NOT NULL,
  `auth_type_id` INT NOT NULL,
  `country` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `country_code` INT NULL,
  `device_id` VARCHAR(120) NULL,
  `device_token` VARCHAR(200) NULL,
  `os_type` VARCHAR(45) NULL,
  `os_version` VARCHAR(45) NULL,
  `is_active` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_user_role_idx` (`role_id` ASC),
  INDEX `fk_user_auth_type1_idx` (`auth_type_id` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC),
  CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `goounj`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_auth_type1`
    FOREIGN KEY (`auth_type_id`)
    REFERENCES `goounj`.`auth_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`visibility_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`visibility_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`reward_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`reward_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `points` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`poll_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`poll_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`poll`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`poll` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `poll_name` VARCHAR(45) NOT NULL,
  `is_boost` TINYINT(1) NULL DEFAULT '0',
  `visibility_type_id` INT NOT NULL,
  `reward_type_id` INT NOT NULL,
  `created_user_id` INT NOT NULL,
  `poll_type_id` INT NOT NULL,
  `is_active` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  `is_generic` TINYINT(1) UNSIGNED NULL DEFAULT '0',
  `is_survey` TINYINT(1) UNSIGNED NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_poll_visibility_type1_idx` (`visibility_type_id` ASC),
  INDEX `fk_poll_reward_type1_idx` (`reward_type_id` ASC),
  INDEX `fk_poll_user1_idx` (`created_user_id` ASC),
  INDEX `fk_poll_poll_type1_idx` (`poll_type_id` ASC),
  CONSTRAINT `fk_poll_visibility_type1`
    FOREIGN KEY (`visibility_type_id`)
    REFERENCES `goounj`.`visibility_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_reward_type1`
    FOREIGN KEY (`reward_type_id`)
    REFERENCES `goounj`.`reward_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_user1`
    FOREIGN KEY (`created_user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_poll_type1`
    FOREIGN KEY (`poll_type_id`)
    REFERENCES `goounj`.`poll_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`question_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`question_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(255) NOT NULL,
  `question_type_id` INT NOT NULL,
  `poll_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_question_question_type1_idx` (`question_type_id` ASC),
  INDEX `fk_question_poll1_idx` (`poll_id` ASC),
  CONSTRAINT `fk_question_question_type1`
    FOREIGN KEY (`question_type_id`)
    REFERENCES `goounj`.`question_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_question_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `goounj`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`question_options`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`question_options` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `option` VARCHAR(255) NOT NULL,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_question_options_question1_idx` (`question_id` ASC),
  CONSTRAINT `fk_question_options_question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `goounj`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`audience_poll_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`audience_poll_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `poll_id` INT NOT NULL,
  `is_skipped` TINYINT(1) NULL DEFAULT '0',
  `poll_answered_time` DATETIME NULL,
  `is_answered` TINYINT(1) NULL DEFAULT '0',
  INDEX `fk_user_poll_map_user1_idx` (`user_id` ASC),
  INDEX `fk_user_poll_map_poll1_idx` (`poll_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_poll_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_poll_map_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `goounj`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`category_user_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`category_user_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  INDEX `fk_category_user_map_user1_idx` (`user_id` ASC),
  INDEX `fk_category_user_map_category1_idx` (`category_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_user_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_user_map_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `goounj`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`category_poll_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`category_poll_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `poll_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  INDEX `fk_category_poll_map_poll1_idx` (`poll_id` ASC),
  INDEX `fk_category_poll_map_category1_idx` (`category_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_poll_map_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `goounj`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_poll_map_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `goounj`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `question_id` INT NOT NULL,
  `question_options_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `poll_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_answer_question1_idx` (`question_id` ASC),
  INDEX `fk_answer_question_options1_idx` (`question_options_id` ASC),
  INDEX `fk_answer_user1_idx` (`user_id` ASC),
  INDEX `fk_answer_poll1_idx` (`poll_id` ASC),
  CONSTRAINT `fk_answer_question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `goounj`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_question_options1`
    FOREIGN KEY (`question_options_id`)
    REFERENCES `goounj`.`question_options` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `goounj`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`subscription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`subscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plan_name` VARCHAR(45) NOT NULL,
  `indian_pricing` INT NOT NULL,
  `intl_pricing` INT NOT NULL,
  `ideal_for` VARCHAR(45) NOT NULL,
  `poll_count` VARCHAR(45) NOT NULL,
  `responce_count` VARCHAR(45) NOT NULL,
  `poll_database` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`purchase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subscription_id` INT NOT NULL,
  `purchase_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_subscription_map_user1_idx` (`user_id` ASC),
  INDEX `fk_user_subscription_map_subscription1_idx` (`subscription_id` ASC),
  CONSTRAINT `fk_user_subscription_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_subscription_map_subscription1`
    FOREIGN KEY (`subscription_id`)
    REFERENCES `goounj`.`subscription` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`subscription_usage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`subscription_usage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `updated_date` DATETIME NOT NULL,
  `poll_count` INT NULL,
  `response_count` INT NULL,
  `used_poll_count` INT NULL,
  `used_response_count` INT NULL,
  INDEX `fk_subscription_usage_user1_idx` (`user_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_subscription_usage_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`association`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`association` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `admin_id` INT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_association_user1_idx` (`admin_id` ASC),
  CONSTRAINT `fk_association_user1`
    FOREIGN KEY (`admin_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`association_user_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`association_user_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `association_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_association_user_map_user1_idx` (`user_id` ASC),
  INDEX `fk_association_user_map_association1_idx` (`association_id` ASC),
  CONSTRAINT `fk_association_user_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_association_user_map_association1`
    FOREIGN KEY (`association_id`)
    REFERENCES `goounj`.`association` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`election`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`election` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `created_date` DATETIME NULL,
  `start_date` DATETIME NULL,
  `end_date` DATETIME NULL,
  `nomination_end_date` DATETIME NULL,
  `vigilance_user_id` INT NOT NULL,
  `association_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_election_user1_idx` (`vigilance_user_id` ASC),
  INDEX `fk_election_association1_idx` (`association_id` ASC),
  CONSTRAINT `fk_election_user1`
    FOREIGN KEY (`vigilance_user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_election_association1`
    FOREIGN KEY (`association_id`)
    REFERENCES `goounj`.`association` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`election_vigilance_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`election_vigilance_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`candidate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`candidate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `election_id` INT NOT NULL,
  `is_active` TINYINT(1) NULL DEFAULT 0,
  `name` VARCHAR(45) NULL,
  `nick_name` VARCHAR(45) NULL,
  `about` VARCHAR(150) NULL,
  `manifesto` VARCHAR(150) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_nominee_user1_idx` (`user_id` ASC),
  INDEX `fk_nominee_election1_idx` (`election_id` ASC),
  CONSTRAINT `fk_nominee_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_nominee_election1`
    FOREIGN KEY (`election_id`)
    REFERENCES `goounj`.`election` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`vote`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`vote` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NULL,
  `nominee_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `election_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_vote_nominee1_idx` (`nominee_id` ASC),
  INDEX `fk_vote_user1_idx` (`user_id` ASC),
  INDEX `fk_vote_election1_idx` (`election_id` ASC),
  CONSTRAINT `fk_vote_nominee1`
    FOREIGN KEY (`nominee_id`)
    REFERENCES `goounj`.`candidate` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vote_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vote_election1`
    FOREIGN KEY (`election_id`)
    REFERENCES `goounj`.`election` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`election_user_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`election_user_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `voted_time` DATETIME NULL,
  `election_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `is_voted` TINYINT(1) NULL DEFAULT 0,
  `association_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_voter_election_map_election1_idx` (`election_id` ASC),
  INDEX `fk_voter_election_map_user1_idx` (`user_id` ASC),
  INDEX `fk_election_user_map_association1_idx` (`association_id` ASC),
  CONSTRAINT `fk_voter_election_map_election1`
    FOREIGN KEY (`election_id`)
    REFERENCES `goounj`.`election` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_voter_election_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_election_user_map_association1`
    FOREIGN KEY (`association_id`)
    REFERENCES `goounj`.`association` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `goounj`.`two_step_verification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goounj`.`two_step_verification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `auth_code` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_two_step_verification_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_two_step_verification_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `goounj`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

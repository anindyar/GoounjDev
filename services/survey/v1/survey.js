/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Orgware Technologies
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Orgware Technologies. Unauthorised copying of this  file, via any medium is
 * strictly prohibited. Redistribution and use in source and binary forms,
 * with or without modification, are not permitted.
 * Proprietary and confidential.
 *
 * Author:
 * Name: Kennet Jacob
 * Email: kennetjacob@gmail.com
 * Website: http://kennetjacob.com
 *
 *
 * FILE SUMMARY
 * __________________
 *
 * This file contains the logic for the survey service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');
var sms = require('./../../../sms');
var pushNote = require('./../../../push');


/**
 * @apiDefine SurveyNotFoundError
 *
 * @apiError SurveyNotFound The requested survey was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine DatabaseError
 *
 * @apiError DatabaseError Database could not be reached.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Requested Action Failed. Database could not be reached."
 *     }
 */

/**
 * @api {post} /survey/v1/survey Create survey
 * @apiVersion 0.1.0
 * @apiName Create Survey
 * @apiGroup Survey
 *
 *
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *    "pollName": "Best Footballer",
 *    "isBoost": "0"
 *    "visibilityType": "visible",
 *    "rewardType": "free",
 *    "category": "sports",
 *    "isGeneric": "0",
 *    "createdUserId": "1",
 *    "pollType": "opinion",
 *    "isSurvey": "1"
 *    "questionList": [
 *         {
 *             "question": "Who is the best striker?",
 *             "questionType": "text",
 *             "choices": [
 *                 "Messi",
 *                 "Ronaldo",
 *                 "Suarez"
 *                 ]
 *          },
 *          {
 *             "question": "Who is the top goal scorer?",
 *             "questionType": "text",
 *             "choices": [
 *                 "Messi",
 *                 "Ronaldo",
 *                 "Suarez"
 *                 ]
 *           }
 *      ]
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if((request.body.pollName != null)  && (request.body.questionList != null) && (request.body.category != null)) {

            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Survey.Create)");
                    json = {
                        error: "Survey Poll Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                    var dat = new Date().setDate(new Date().getDate() + config.poll.expiresAfter);
                    var utcTimeStampEnd = moment(dat).format('YYYY/MM/DD HH:mm:ss');

                    var isGeneric = request.body.isGeneric;
                    if(request.body.isGeneric == null) {
                        isGeneric = '0';
                    }

                    connection.query('INSERT INTO ' + config.mysql.db.name +'.poll (start_date, end_date, poll_name, is_boost, visibility_type_id, reward_type_id, created_user_id, poll_type_id, is_active, is_generic, is_survey) VALUES (?, ?, ?, ?, (SELECT id FROM visibility_type WHERE type=?), (SELECT id FROM reward_type WHERE type=?), ?, (SELECT id FROM poll_type WHERE type=?), ?, ?, ?)', [utcTimeStamp, utcTimeStampEnd, request.body.pollName, request.body.isBoost, request.body.visibilityType, request.body.rewardType, request.body.createdUserId, request.body.pollType, "1", isGeneric, request.body.isSurvey], function (queryError, poll) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Survey.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else {
                            var pollID = poll.insertId;
                            var questionList = request.body.questionList;
                            for (var i = 0; i<questionList.length; i++) {
                                (function () {
                                    var iCopy = i;
                                    connection.query('INSERT INTO ' + config.mysql.db.name + '.question (poll_id, question, question_type_id) VALUES (?, ?, (SELECT id FROM question_type WHERE type=?))', [pollID, questionList[iCopy].question, questionList[iCopy].questionType], function (queryError, quest) {
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to create a new question. Question details " + JSON.stringify(request.body.questionList) + "(Function = Survey.Create)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else {
                                            var questionID = quest.insertId;
                                            var options = questionList[iCopy].choices;
                                            for (var j = 0; j < options.length; j++) {
                                                connection.query('INSERT INTO ' + config.mysql.db.name + '.question_options (question_id, `option`) VALUES (?, ?)', [questionID, options[j]], function (queryError, choice) {
                                                    if (queryError != null) {
                                                        log.error(queryError, "Query error. Failed to create a new options. Question details " + JSON.stringify(request.body.questionList) + "(Function = Survey.Create)");
                                                        json = {
                                                            error: "Requested action failed. Database could not be reached."
                                                        };
                                                        return response.status(500).json(json);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }());
                            }

                            connection.query('INSERT INTO ' + config.mysql.db.name +'.category_poll_map (poll_id, category_id) VALUES (?, (SELECT id FROM category WHERE `name` = ?))', [pollID, request.body.category], function (queryError, poll) {
                                if (queryError != null) {
                                    log.error(queryError, "Query error. Failed to map poll to category. Category: " + JSON.stringify(request.body.category) + "(Function= Survey.Create)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                            });

                            log.info({Function: "Survey.Create"}, "New survey poll created successfully. Poll ID: " + pollID);
                            return response.sendStatus(200);
                        }
                    });
                }
            });
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Create)");
        return response.status(500).json(json);
    }
};



/**
 * @api {delete} /survey/v1/survey/:id Delete Survey
 * @apiVersion 0.1.0
 * @apiName Delete Survey
 * @apiGroup Survey
 *
 * @apiParam {String} id Survey Poll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse SurveyNotFoundError
 *
 */



/**
 * @api {get} /survey/v1/survey/:id Show survey
 * @apiVersion 0.1.0
 * @apiName Show Survey
 * @apiGroup Survey
 *
 * @apiParam {String} id Poll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     "category": "Sports",
 *     "createdUser": "Kennet Paul",
 *     "visibilityType": "visible",
 *     "isBoost": 0,
 *     "pollType": "opinion",
 *     "rewardType": "free",
 *     "isSurvey": "1",
 *     "questionList": [
 *              {
 *              "questionType": "text",
 *              "questionId": 9,
 *              "question": "Who is the best striker?",
 *              "choices": [
 *                      {
 *                      "optionId": 22,
 *                      "choice": "Messi"
 *                      },
 *                      {
 *                      "optionId": 23,
 *                      "choice": "Ronaldo"
 *                      },
 *                      {
 *                      "optionId": 24,
 *                      "choice": "Suarez"
 *                      }
 *                  ]
 *              },
 *              {
 *              "questionType": "text",
 *              "questionId": 9,
 *              "question": "Who is the top goal scorer?",
 *              "choices": [
 *                      {
 *                      "optionId": 25,
 *                      "choice": "Messi"
 *                      },
 *                      {
 *                      "optionId": 26,
 *                      "choice": "Ronaldo"
 *                      },
 *                      {
 *                      "optionId": 27,
 *                      "choice": "Suarez"
 *                      }
 *                  ]
 *              }
 *     ],
 *     "pollName": "Best Footballer",
 *     "createdUserId": 2
 *  }
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse PollNotFoundError
 *
 */



exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Survey.Show)");
                json = {
                    error: "Survey Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT poll.poll_name AS pollName, is_survey AS isSurvey, poll.is_boost AS isBoost, (SELECT type FROM poll_type WHERE id = poll.poll_type_id) AS pollType, (SELECT name FROM category WHERE id = (SELECT category_id FROM category_poll_map WHERE poll_id = poll.id)) AS category, (SELECT type FROM visibility_type WHERE id = poll.visibility_type_id) AS visibilityType, (SELECT type FROM reward_type WHERE id = poll.reward_type_id) AS rewardType, poll.created_user_id AS createdUserId, (SELECT name FROM user WHERE id = poll.created_user_id) AS createdUser, question.question, question.id AS questionId, (SELECT type FROM question_type WHERE id = question.question_type_id) AS questionType, question_options.`option` AS choices, question_options.id AS optionId FROM user INNER JOIN poll ON poll.created_user_id = user.id INNER JOIN question ON question.poll_id = poll.id INNER JOIN question_options ON question_options.question_id = question.id WHERE poll.id = ?', request.params.id, function(queryError, resultSet) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch survey poll details. Survey ID: " + JSON.stringify(request.params.id) + "(Function= Poll Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (resultSet[0]) {
                        var jsonOutput = {
                            pollName:           resultSet[0].pollName,
                            category:           resultSet[0].category,
                            pollType:           resultSet[0].pollType,
                            createdUserId:      resultSet[0].createdUserId,
                            createdUser:        resultSet[0].createdUser,
                            isBoost:            resultSet[0].isBoost,
                            rewardType:         resultSet[0].rewardType,
                            visibilityType:     resultSet[0].visibilityType,
                            isSurvey:           resultSet[0].isSurvey,
                            questionList: []
                        };
                        var questionObj = {};


                        resultSet.forEach(function(entry) {
                            if (typeof questionObj[entry.question] == "undefined") {
                                questionObj[entry.question] = [];
                            }
                            var choiceObj = {
                                choice:         entry.choices,
                                optionId:       entry.optionId,
                                questionId:     entry.questionId
                            };
                            questionObj[entry.question].push(choiceObj);
                        });

                        for (var question in questionObj) {
                            if (questionObj.hasOwnProperty(question)) {
                                jsonOutput.questionList.push({
                                    choices: questionObj[question],
                                    questionType: "text",
                                    question: question,
                                    questionId: questionObj[question][0].questionId
                                });
                            }
                        }
                        log.info({Function: "Survey.Show"}, "Fetched Survey Poll Details. Poll Id: " + request.params.id);
                        return response.status(200).json(jsonOutput);
                    } else {
                        log.info({Function: "Survey.Show"}, "Requested Survey Poll Not Found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Survey.Show)");
        return response.status(500).json(json);
    }
};


exports.update = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Survey.Update)");
                json = {
                    error: "Survey Poll Update failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('UPDATE '+ config.mysql.db.name + '.poll SET is_active = ? WHERE id = ?', request.body.isActive, function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Update survey poll details. Poll ID: " + request.params.id + " (Function = Survey.Update)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    log.info({Function: "Survey.Update"}, "Survey Poll Updated Successfully. Poll Id: " + request.params.id);
                    return response.sendStatus(200);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Survey.Update)");
        return response.status(500).json(json);
    }
};



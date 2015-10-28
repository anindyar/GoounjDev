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
 * This file contains the logic for the poll service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');

/**
 * @apiDefine PollNotFoundError
 *
 * @apiError PollNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested poll was not found.
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
 * @api {post} /polls/v1/poll Create poll
 * @apiVersion 0.1.0
 * @apiName Create Poll
 * @apiGroup Poll
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
 *    "createdUserId": "1",
 *    "pollType": "opinion",
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
 *      ],
 *      "audience": [
 *      "9994012253",
 *      "9944377754",
 *      "9443797732"
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
        if((request.body.pollName != null)  && (request.body.questionList != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Poll.Create)");
                    json = {
                        error: "Poll Delete failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                    connection.query('INSERT INTO ' + config.mysql.db.name +'.poll (start_date, end_date, poll_name, is_boost, visibility_type_id, reward_type_id, created_user_id, poll_type_id) VALUES (?, ?, ?, ?, (SELECT id FROM visibility_type WHERE type=?), (SELECT id FROM reward_type WHERE type=?), ?, (SELECT id FROM poll_type WHERE type=?))', [utcTimeStamp, utcTimeStamp, request.body.pollName, request.body.isBoost, request.body.visibilityType, request.body.rewardType, request.body.createdUserId, request.body.pollType], function (queryError, poll) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function= Poll Create)");
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
                                            log.error(queryError, "Query error. Failed to create a new question. Question details " + JSON.stringify(request.body.questionList) + "(Function= Poll Create)");
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
                                                        log.error(queryError, "Query error. Failed to create a new options. Question details " + JSON.stringify(request.body.questionList) + "(Function= Poll Create)");
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

                            var audienceList = request.body.audience;
                            for(var k = 0; k < audienceList.length; k++) {
                                connection.query('CALL setAudienceForPoll(?, ?);', [audienceList[k], pollID], function(queryError, user) {

                                    if (queryError != null) {
                                        log.error(queryError, "Query error. Failed to create a new user. User details " + JSON.stringify(request.body.phone) + "(Function= Poll Create)");
                                        jsn = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                });
                            }
                            connection.query('INSERT INTO ' + config.mysql.db.name +'.category_poll_map (poll_id, category_id) VALUES (?, (SELECT id FROM category WHERE name=?))', [pollID, request.body.category], function (queryError, poll) {
                                if (queryError != null) {
                                    log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function= Poll Create)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                            });
                            log.info({Function: "Poll.Create"}, "New poll created successfully. Poll ID: " + pollID);
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
 * @api {delete} /polls/v1/poll/:id Delete poll
 * @apiVersion 0.1.0
 * @apiName Delete Poll
 * @apiGroup Poll
 *
 * @apiParam {String} id Poll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse PollNotFoundError
 *
 */


exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Poll.Delete)");
                json = {
                    error: "Poll Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('CALL deletePoll(?);', request.params.id, function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create a new user. User details " + JSON.stringify(request.params.id) + "(Function= Poll Delete)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result.affectedRows != 0) {
                        log.info({Function: "Poll.Delete"}, "Poll Deleted Successfully. Poll ID: " + request.params.id);
                        return response.sendStatus(200);
                    } else {
                        log.info({Function: "Poll.Delete"}, "Requested Poll Not Found. Poll ID: " + request.params.id );
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Delete)");
        return response.status(500).json(json);
    }
};



/**
 * @api {get} /polls/v1/poll/:id Show poll
 * @apiVersion 0.1.0
 * @apiName Show Poll
 * @apiGroup Poll
 *
 * @apiParam {String} id Poll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "visibilityType": "visible",
 *          "category": "sports",
 *          "isBoost": 0,
 *          "pollType": "opinion",
 *          "rewardType": "free",
 *          "questionList": [
 *              {
 *                  "choices": [
 *                      "Messi",
 *                      "Ronaldo",
 *                      "Suarez"
 *                      ],
 *          "questionType": "text",
 *          "question": "Who is the best striker?"
 *              },
 *              {
 *                  "choices": [
 *                      "Messi",
 *                      "Ronaldo",
 *                      "Suarez"
 *                      ],
 *          "questionType": "text",
 *          "question": "Who is the top goal scorer?"
 *              }
 *           ],
 *     "pollName": "Best Footballer",
 *     "createdUserId": 6
 *     }
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
                log.error(connectionError, "Database Connection Error (Function = Poll.Show)");
                json = {
                    error: "Poll Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT poll.poll_name AS pollName, poll.is_boost AS isBoost, (SELECT type FROM poll_type WHERE id = poll.poll_type_id) AS pollType, (SELECT name FROM category WHERE id = (SELECT category_id FROM category_poll_map WHERE poll_id = poll.id)) AS category, (SELECT type FROM visibility_type WHERE id = poll.visibility_type_id) AS visibilityType, (SELECT type FROM reward_type WHERE id = poll.reward_type_id) AS rewardType, poll.created_user_id AS createdUserId, question.question, (SELECT type FROM question_type WHERE id = question.question_type_id) AS questionType, question_options.`option` AS choices FROM poll INNER JOIN question ON question.poll_id = poll.id INNER JOIN question_options ON question_options.question_id = question.id WHERE poll.id = ?', request.params.id, function(queryError, resultSet) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll details. Poll ID: " + JSON.stringify(request.params.id) + "(Function= Poll Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (resultSet) {
                        var jsonOutput = {
                            pollName:           resultSet[0].pollName,
                            category:           resultSet[0].category,
                            pollType:           resultSet[0].pollType,
                            createdUserId:      resultSet[0].createdUserId,
                            isBoost:            resultSet[0].isBoost,
                            rewardType:         resultSet[0].rewardType,
                            visibilityType:     resultSet[0].visibilityType,
                            questionList: []
                        };
                        var questionObj = {};

                        resultSet.forEach(function(entry) {
                            if (typeof questionObj[entry.question] == "undefined") {
                                questionObj[entry.question] = [];
                            }
                            questionObj[entry.question].push(entry.choices);
                        });

                        for (var question in questionObj) {
                            if (questionObj.hasOwnProperty(question)) {
                                jsonOutput.questionList.push({
                                    choices: questionObj[question],
                                    questionType: "text",
                                    question: question
                                });
                            }
                        }
                        log.info({Function: "Poll.Show"}, "Fetched Poll Details. Poll Id: " + request.params.id);
                        return response.status(200).json(jsonOutput);
                    } else {
                        log.info({Function: "Poll.Show"}, "Requested Poll Not Found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Show)");
        return response.status(500).json(json);
    }
};




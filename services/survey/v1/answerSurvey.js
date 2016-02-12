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
 * @api {post} /survey/v1/answerSurvey Create Survey
 * @apiVersion 0.1.0
 * @apiName Answer Survey
 * @apiGroup Survey
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *          "pollId": "11",
 *          "name": "jobs",
 *          "phone": "9878987678"
 *          "questionList": [
 *                  {
 *                      "question": "Who is the best cricketer?",
 *                      "option": "Sachin"
 *                  },
 *                  {
 *                      "question": "Who is the best footballer?",
 *                      "option": "Messi"
 *                  }
 *             ]
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse SurveyNotFoundError
 *
 *
 */


exports.create = function(request, response) {
  var json;
    try{
        if((request.body.questionList !== null) && (request.body.name != null) && (request.body.phone != null) && (request.body.pollId != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = AnswerSurvey.Create)");
                    json = {
                        error: "Survey Answer failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.audience_poll_map WHERE user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE phone = ?) AND poll_id = ?', [request.body.phone, request.body.pollId], function(queryError, check) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to record a new survey answer. Answer details " + JSON.stringify(request.body.pollId) + "(Function = AnswerSurvey.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(check.length != 0) {
                        json = {
                            error: "User has already answered this survey."
                        };
                        log.info({Function: "AnswerSurvey.Create"}, "User already answered this survey.");
                        return response.status(400).json(json);
                    }
                    else {
                        var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                        var name = request.body.name;
                        connection.query('SET @userId = 0, @deviceToken = ""; CALL setAudienceForSurvey(?, ?, ?, ?, @userId, @deviceToken); SELECT @userId AS userId, @deviceToken AS deviceToken;', [request.body.phone, request.body.pollId, utcTimeStamp, name], function (queryError, user) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to update audience. User details " + JSON.stringify(request.body.phone) + "(Function= AnswerSurvey.Create)");
                                jsn = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(user) {
                                var pollName = "";
                                var userObj = user[2];
                                var userId = userObj[0].userId;
                                var deviceToken = userObj[0].deviceToken;
                                var questionAnswer = request.body.questionList;
                                for(var i=0; i<questionAnswer.length; i++) {
                                    connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id, poll_id) VALUES (?, ?, ?, ?, ?); SELECT poll_name FROM ' + config.mysql.db.name + '.poll WHERE id = ?', [utcTimeStamp, questionAnswer[i].questionId, questionAnswer[i].optionId, userId, request.body.pollId, request.body.pollId], function (queryError, result) {
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to record a new survey answer. Answer details " + JSON.stringify(request.body.pollId) + "(Function = AnswerSurvey.Create)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else {
                                            var pollObj = result[1];
                                            pollName = pollObj[1].poll_name;
                                        }
                                    });
                                }
                                if(deviceToken == null) {
                                    if(config.sms.enabled) {
                                        var phoneArray = [];
                                        phoneArray.push(request.body.phone);
                                        sms.sendSMS(phoneArray, "This is Goounj Service. You have answered a survey: "+ pollName +"! Thank you for your support.");
                                    }
                                }
                                else {
                                    if(config.pushNotification.enabled) {
                                        var tokenArray = [];
                                        tokenArray.push(deviceToken);
                                        pushNote.sendAndroidPush(tokenArray, "You have answered a survey: " + pollName + "!");
                                    }
                                }
                                log.info({Function: "AnswerSurvey.Create"}, "New survey answer has been recorded successfully.");
                                return response.sendStatus(200);
                            }
                            else {
                                log.info({Function: "AnswerSurvey.Create"}, "Requested Survey Not Found");
                                return response.sendStatus(404);
                            }
                        });
                    }
                });
            });
        }
        else {
            log.info({Function: "AnswerSurvey.Create"}, "Parameters required.");
            return response.sendStatus(400);
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = AnswerSurvey.Create)");
        return response.status(500).json(json);
    }
};
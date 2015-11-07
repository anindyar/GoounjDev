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
 * This file contains the logic for the poll answer service.
 *
 *************************************************************************/
var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');



/**
 * @apiDefine PollNotFoundError
 *
 * @apiError PollNotFound The requested poll was not found.
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
 * @api {post} /polls/v1/answer Answer poll
 * @apiVersion 0.1.0
 * @apiName Answer
 * @apiGroup Poll
 *
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *          "pollId": "11",
 *          "userId": "4",
 *          "questionList": [
 *                  {
 *                      "question": "13",
 *                      "option": "7"
 *                  },
 *                  {
 *                      "question": "14",
 *                      "option": "10"
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
 * @apiUse PollNotFoundError
 *
 */


exports.create = function(request, response) {
    var json;
    try {
        if((request.body.questionList !== null) && (request.body.userId != null) && (request.body.pollId != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Poll.Answer)");
                    json = {
                        error: "Poll Delete failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT poll_name FROM poll WHERE id = ?', request.body.pollId, function(queryError, check) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to select audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Poll.Answer)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(check) {
                        var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                        var questionAnswer = request.body.questionList;
                        connection.query('UPDATE '+ config.mysql.db.name + '.audience_poll_map SET poll_answered_time = ?, is_answered = 1 WHERE poll_id = ? AND user_id = ?', [utcTimeStamp, request.body.pollId, request.body.userId], function(queryError, action) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to update audience. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Poll.Answer)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else{
                                for(var i=0; i<questionAnswer.length; i++) {
                                    connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id) VALUES (?, (SELECT id FROM question WHERE question = ?), (SELECT id FROM question_options WHERE option = ?), ?)', [utcTimeStamp, questionAnswer[i].question, questionAnswer[i].option, request.body.userId], function (queryError, result) {
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to record a new answer. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Poll.Answer)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else {
                                            log.info({Function: "Poll.Answer"}, "New answer has been recorded successfully.");
                                        }
                                    });
                                }
                                return response.sendStatus(200);
                            }
                        });
                    }
                    else {
                            log.info({Function: "Poll.Answer"}, "Requested Poll Not Found");
                            return response.sendStatus(404);
                    }
                });
            });
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Answer.Create)");
        return response.status(500).json(json);
    }
};
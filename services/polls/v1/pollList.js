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
 * This file contains the logic for the poll listing service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');


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
 * @api {post} /poll/v1/pollList List polls for Audience User
 * @apiVersion 0.1.0
 * @apiName CreatePollList
 * @apiGroup Poll
 *
 * @apiParam {Number} userId Audience User Id
 * @apiParam {Number} lowerLimit Limit for number of polls.
 * @apiParam {Number} upperLimit Limit for number of polls.
 * @apiParam {Number} isAnswered is answered flag
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "userId": 4,
 *           "lowerLimit": 1,
 *           "upperLimit": 10,
 *           "isAnswered": 2
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *     {
 *     "id": 12,
 *     "start_date": "2015-10-23T05:22:22.000Z",
 *     "poll_id": 4,
 *     "is_boost": 0,
 *     "end_date": "2015-10-23T05:22:22.000Z",
 *     "user_id": 9,
 *     "poll_type_id": 3,
 *     "created_user_id": 9,
 *     "poll_name": "Cinema",
 *     "is_answered": "0",
 *     "is_active": 1,
 *     "isGeneric": 1
 *     },
 *     {
 *     "id": 15,
 *     "start_date": "2015-10-23T05:30:04.000Z",
 *     "poll_id": 5,
 *     "is_skipped": 0,
 *     "is_boost": 0,
 *     "end_date": "2015-10-23T05:30:04.000Z",
 *     "user_id": 9,
 *     "poll_type_id": 2,
 *     "created_user_id": 6,
 *     "poll_name": "Composer",
 *     "is_answered": "0",
 *     "is_active": 1,
 *     "isGeneric": 1
 *     }
 *     ]
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */


//listing polls intended to the specific user.
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId !== null) && (request.body.lowerLimit != null) && (request.body.upperLimit != null) && (request.body.isAnswered != null)) {
            request.getConnection(function (connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = PollList.Create)");
                    json = {
                        error: "PollList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD');

                if(request.body.isAnswered == 2) {
                    connection.query('CREATE OR REPLACE VIEW polls AS (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, is_answered AS isAnswered, name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id INNER JOIN audience_poll_map ON poll.id = poll_id WHERE poll.end_date > ? AND user_id = ?) UNION (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, "0" AS isAnswered, user.name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE is_generic = 1 AND poll.id NOT IN (SELECT poll_id FROM audience_poll_map WHERE user_id = ?)); (SELECT * FROM polls WHERE isAnswered = 0 AND isSurvey = 0 ORDER BY pollId DESC LIMIT ?, ?) UNION (SELECT * FROM polls WHERE isAnswered = 1 AND isSurvey = 0 ORDER BY pollId DESC LIMIT ?, ?); ', [utcTimeStamp, request.body.userId, request.body.userId, request.body.lowerLimit, request.body.upperLimit,  request.body.lowerLimit, request.body.upperLimit], function(queryError, result) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.body.userId) + "(Function = PollList.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(result) {
                            var pollList = [], pollOBJ = {};
                            var resultList = result[1];
                            for(var i = 0; i < resultList.length; i++) {

                                pollOBJ = {
                                    pollId: resultList[i].pollId,
                                    startDate: resultList[i].startDate,
                                    endDate: resultList[i].endDate,
                                    pollName: resultList[i].pollName,
                                    isSurvey: resultList[i].isSurvey,
                                    isBoost: resultList[i].isBoost,
                                    isGeneric: resultList[i].isGeneric,
                                    isActive: resultList[i].isActive,
                                    isAnswered: resultList[i].isAnswered,
                                    createdUserName: resultList[i].createdUserName
                                };
                                pollList.push(pollOBJ);
                            }
                            log.info({Function: "PollList.Create"}, "Fetched Poll List.");
                            return response.status(200).json(pollList);
                        }
                        else {
                            log.info({Function: "PollList.Create"}, "Requested UserId not found.");
                            return response.sendStatus(404);
                        }
                    });
                }
                if(request.body.isAnswered == 0 || request.body.isAnswered == 1) {
                    connection.query('CREATE OR REPLACE VIEW polls AS (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, is_answered AS isAnswered, name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id INNER JOIN audience_poll_map ON poll.id = poll_id WHERE poll.end_date > ? AND user_id = ?) UNION (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, "0" AS isAnswered, user.name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE is_generic = 1 AND poll.id NOT IN (SELECT poll_id FROM audience_poll_map WHERE user_id = ?)); SELECT * FROM polls WHERE isAnswered = ? AND isSurvey = 0 ORDER BY pollId DESC LIMIT ?, ?;',[utcTimeStamp, request.body.userId, request.body.userId, request.body.isAnswered, request.body.lowerLimit, request.body.upperLimit], function(queryError, result) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.body.userId) + "(Function = PollList.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(result) {
                            var pollList = [], pollOBJ = {};
                            var resultList = result[1];
                            for(var i = 0; i < resultList.length; i++) {
                                //var startDate = resultList[i].startDate.toString();
                                //var endDate = resultList[i].endDate.toString();

                                pollOBJ = {
                                    pollId: resultList[i].pollId,
                                    startDate: resultList[i].startDate,
                                    endDate: resultList[i].endDate,
                                    pollName: resultList[i].pollName,
                                    isSurvey: resultList[i].isSurvey,
                                    isBoost: resultList[i].isBoost,
                                    isGeneric: resultList[i].isGeneric,
                                    isActive: resultList[i].isActive,
                                    isAnswered: resultList[i].isAnswered,
                                    createdUserName: resultList[i].createdUserName
                                };
                                pollList.push(pollOBJ);
                            }
                            log.info({Function: "PollList.Create"}, "Fetched Poll List.");
                            return response.status(200).json(pollList);
                        }
                        else if(!result[0]) {
                            log.info({Function: "PollList.Create"}, "Requested UserId not found.");
                            return response.sendStatus(404);
                        }
                    });
                }
            });
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = PollList.Create)");
        return response.status(500).json(json);
    }
};


/**
 * @api {get} /polls/v1/pollList/:id List polls for Created User
 * @apiVersion 0.1.0
 * @apiName ShowPollList
 * @apiGroup Poll
 *
 * @apiParam {Number} id Created User Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 1,
 *          "poll_name": "Best Footballer",
 *          "start_date": "2015-10-23T04:39:20.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "end_date": "2015-10-23T04:39:20.000Z"
 *      },
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 5,
 *          "poll_name": "Composer",
 *          "start_date": "2015-10-23T05:30:04.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "isGeneric": 1,
 *          "end_date": "2015-10-23T05:30:04.000Z"
 *      },
 *      {
 *          "visibility_type_id": 1,
 *          "created_user_id": 6,
 *          "poll_type_id": 2,
 *          "id": 6,
 *          "poll_name": "Composer",
 *          "start_date": "2015-10-23T05:30:09.000Z",
 *          "reward_type_id": 1,
 *          "is_boost": 0,
 *          "is_active": 1,
 *          "isGeneric": 1,
 *          "end_date": "2015-10-23T05:30:09.000Z"
 *      }
 *    ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */


//listing polls created by the specific user.
exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Poll.Show)");
                json = {
                    error: "PollList.Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM poll WHERE created_user_id = ? AND is_survey = 0', request.params.id, function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.params.id) + "(Function = PollList.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result) {
                    log.info({Function: "PollList.Show"}, "Fetched Poll List.");
                    return response.status(200).json(result);
                }
                else {
                    log.info({Function: "PollList.Show"}, "Requested UserId not found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = PollList.Create)");
        return response.status(500).json(json);
    }
};
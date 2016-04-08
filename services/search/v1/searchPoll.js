/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Kennet Jacob
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Kennet Jacob. Unauthorised copying of this  file, via any medium is
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
 * This file contains the resource definitions for the poll search
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');

/**
 * @apiDefine PollNotFoundError
 *
 * @apiError PollNotFound There are no polls for the given string.
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
 * @api {post} /search/v1/searchPoll Search Polls
 * @apiVersion 0.1.0
 * @apiName CreateSearchPoll
 * @apiGroup Search
 *
 * @apiParam {Number} userId Audience User Id
 * @apiParam {String} searchString String to be searched for.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "userId": 4,
 *           "searchString": "bes"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *     {
 *          "pollId": 653,
 *          "isGeneric": 0,
 *          "endDate": "2016-03-07T06:45:07.000Z",
 *          "isSurvey": 0,
 *          "startDate": "2016-02-08T06:45:07.000Z",
 *          "isBoost": 0,
 *          "isAnswered": "0",
 *          "createdUserName": "hugh jackman",
 *          "pollName": "Best Shopping mall",
 *          "isActive": 1
 *     },
 *     {
 *         "pollId": 651,
 *         "isGeneric": 0,
 *         "endDate": "2016-03-01T08:51:10.000Z",
 *         "isSurvey": 0,
 *         "startDate": "2016-02-02T08:51:10.000Z",
 *         "isBoost": 0,
 *         "isAnswered": "0",
 *         "createdUserName": "Kennet",
 *         "pollName": "Best Comedian",
 *         "isActive": 1
 *     },
 *     {
 *        "pollId": 650,
 *        "isGeneric": 0,
 *        "endDate": "2016-03-01T08:49:15.000Z",
 *        "isSurvey": 0,
 *        "startDate": "2016-02-02T08:49:15.000Z",
 *        "isBoost": 0,
 *        "isAnswered": "0",
 *        "createdUserName": "Kennet",
 *        "pollName": "Best Actress",
 *        "isActive": 1
 *     }
 *   ]
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse PollNotFoundError
 *
 */

exports.create = function(request, response){
    var json;
    try {
        if(request.body.searchString != null && request.body.userId != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = searchPoll.create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('DD/MM/YYYY');
                connection.query('CREATE OR REPLACE VIEW polls AS (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, is_answered AS isAnswered, name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id INNER JOIN audience_poll_map ON poll.id = poll_id WHERE poll.end_date > ? AND user_id = ?) UNION (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, "0" AS isAnswered, user.name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE is_generic = 1 AND poll.id NOT IN (SELECT poll_id FROM audience_poll_map WHERE user_id = ?)); CREATE OR REPLACE VIEW mine AS (SELECT * FROM polls) UNION (SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, "2" AS isAnswered, name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE created_user_id = ?); SELECT * FROM mine WHERE isSurvey = 0 AND pollName LIKE ? ORDER BY pollId DESC', [utcTimeStamp, request.body.userId, request.body.userId,  request.body.userId, '%' + request.body.searchString + '%'], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch survey list. Details " + JSON.stringify(request.body.userId) + "(Function = searchPoll.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(result[2]) {
                        log.info({Function: "searchPoll.Create"}, "Search results fetched");
                        return response.status(200).json(result[2]);
                    }
                    else {
                        log.info({Function: "searchPoll.Create"}, "Requested String not found.");
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
        log.error(error, "Exception Occurred (Function = searchPoll.Create)");
        return response.status(500).json(json);
    }
};
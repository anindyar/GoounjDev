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
 * @apiDefine SurveyNotFoundError
 *
 * @apiError SurveyNotFound There are no surveys for the given string.
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
 * @api {post} /search/v1/searchSurvey Search Surveys
 * @apiVersion 0.1.0
 * @apiName CreateSearchSurvey
 * @apiGroup Search
 *
 *
 * @apiParam {String} searchString String to be searched for.
 *
 * @apiParamExample {json} Request-Example:
 *     {
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
 *          "isSurvey": 1,
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
 *         "isSurvey": 1,
 *         "startDate": "2016-02-02T08:51:10.000Z",
 *         "isBoost": 0,
 *         "isAnswered": "0",
 *         "createdUserName": "Kennet",
 *         "pollName": "Best Sportstar",
 *         "isActive": 1
 *     },
 *     {
 *        "pollId": 650,
 *        "isGeneric": 0,
 *        "endDate": "2016-03-01T08:49:15.000Z",
 *        "isSurvey": 1,
 *        "startDate": "2016-02-02T08:49:15.000Z",
 *        "isBoost": 0,
 *        "isAnswered": "0",
 *        "createdUserName": "Kennet",
 *        "pollName": "Best Model",
 *        "isActive": 1
 *     }
 *   ]
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse SurveyNotFoundError
 *
 */

exports.create = function(request, response){
    var json;
    try {
        if(request.body.searchString != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = searchSurvey.create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                connection.query('SELECT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, created_user_id AS createdUserId, name AS createdUserName  FROM poll INNER JOIN user ON poll.created_user_id = user.id WHERE poll.end_date > ? AND is_survey = 1 AND poll_name LIKE ? ORDER BY pollId DESC', [utcTimeStamp, '%' + request.body.searchString + '%'], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch survey list. Details " + JSON.stringify(request.body.userId) + "(Function = searchSurvey.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(result[0]) {
                        log.info({Function: "searchSurvey.Create"}, "Search results fetched");
                        return response.status(200).json(result);
                    }
                    else {
                        log.info({Function: "searchSurvey.Create"}, "Requested String not found.");
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
        log.error(error, "Exception Occurred (Function = searchSurvey.Create)");
        return response.status(500).json(json);
    }
};
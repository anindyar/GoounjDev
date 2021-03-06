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
 * This file contains the logic for the user timeline service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');

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
 * @api {get} users/v1/user/:id Show User Timeline
 * @apiVersion 0.1.0
 * @apiName ShowUserTimeline
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [
 *          {
 *            "userName": "Kennet",
 *            "pollId": 648,
 *            "pollName": "Best Singer",
 *            "createdUser": "Kennet",
 *            "date": "2016-02-02T08:39:08.000Z"
 *          },
 *          {
 *            "userName": "Kennet",
 *            "pollId": 649,
 *            "pollName": "Best Actor",
 *            "createdUser": "Kennet",
 *            "date": "2016-02-02T08:43:29.000Z"
 *          },
 *          {
 *            "userName": "Kennet",
 *            "pollId": 650,
 *            "pollName": "Best Actress",
 *            "createdUser": "Kennet",
 *            "date": "2016-02-02T08:49:15.000Z"
 *          }
 *      ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */



exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Timeline.Show)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('(SELECT user.name AS userName, poll.id AS pollId, poll.start_date AS date, poll_name AS pollName, (SELECT name FROM user WHERE id = created_user_id) AS createdUser FROM user JOIN poll ON created_user_id = user.id WHERE user.id = ?) UNION (SELECT user.name AS userName, poll.id AS pollId, poll.start_date AS date, poll_name AS pollName, (SELECT name FROM user WHERE id = created_user_id) AS createdUser FROM user JOIN audience_poll_map ON user_id = user.id JOIN poll ON poll.id = poll_id WHERE user.id = ?) UNION (SELECT user.name AS userName, answer.poll_id AS pollId, answer.time AS date, (SELECT poll_name FROM poll WHERE id = answer.poll_id) AS pollName, (SELECT name FROM user WHERE id = (SELECT created_user_id FROM poll WHERE id = answer.poll_id)) AS createdUser FROM user JOIN answer ON user_id = user.id WHERE user.id = ?);', [request.params.id, request.params.id, request.params.id], function(queryError, result) {
                if(queryError != null) {
                    log.error(queryError, "Query error. Failed to create an election. (Function = Timeline.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result) {
                    log.info({Function: "Timeline.Show"}, "Fetched user timeline.");
                    return response.status(200).json(result);
                }
                else {
                    log.info({Function: "Timeline.Show"}, "Requested User Not Found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Timeline.Show)");
        return response.status(500).json(json);
    }
};
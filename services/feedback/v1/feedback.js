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
 * This file contains the logic for the feedback service.
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
 * @api {post} /feedback/v1/feedback/:id Create Feedback
 * @apiVersion 0.1.0
 * @apiName CreateFeedback
 * @apiGroup Feedback
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Feedback.Create)");
                json = {
                    error: "Poll Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT id FROM '+ config.mysql.db.name +'.user WHERE phone = ? AND email = ?', [request.body.phone, request.body.email], function(queryError, user){
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Feedback.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if (user.id == request.body.userId) {
                    connection.query('INSERT INTO '+ config.mysql.db.name +'.feedback (comments, feedback_type_id, modules_id, user_id, email, phone) VALUES (?, (SELECT id FROM '+ config.mysql.db.name +'.feedback_type WHERE name = ?), (SELECT id FROM '+ config.mysql.db.name +'.modules WHERE name = ?), ?, ?, ?)', [request.body.comments, request.body.feedbackType, request.body.module, request.body.userId, request.body.email, request.body.phone], function(queryError, feedback) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Feedback.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else {
                            var feedbackID = feedback.insertId;
                            json = {
                                feedbackId : feedbackID
                            };
                            log.info({Function: "Feedback.Create"}, "Feedback inserted");
                            return response.status(200).json(json);
                        }
                    });
                }
                else{
                    json = {
                        error: "The userID doesn't match to the given email and phone."
                    };
                    log.info({Function: "Feedback.Create"}, "Feedback unsuccessful");
                    return response.status(400).json(json);
                }
            });
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Feedback.Create)");
        return response.status(500).json(json);
    }
};
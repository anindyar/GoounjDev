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
 * @api {delete} admin/v1/poll/:id Delete Poll
 * @apiVersion 0.1.0
 * @apiName DeletePoll
 * @apiGroup Admin
 *
 * @apiParam {Number} id Poll's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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

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
 * This file contains the logic for the user service.
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
 * @api {put} users/v1/logout/:id Logout User
 * @apiVersion 0.1.0
 * @apiName LogoutUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */

exports.update = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Logout.update");
                json = {
                    error: "User Create failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM '+ config.mysql.db.name +'.user  WHERE id = ?', [request.params.id], function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Update User Details. User ID: " + request.params.id + " (Function = Logout.Update)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result[0]) {
                    var jsonData = {};
                    jsonData['is_verified'] = 0;
                    jsonData['device_token'] = null;

                    connection.query('UPDATE '+ config.mysql.db.name +'.user SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, item) {
                        if (queryError != null) {
                            log.error(queryError, "Query Error. Failed To Update User Details. User ID: " + request.params.id + " (Function = Logout.Update)");
                            json = {
                                error: "Requested Action Failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        log.info({Function: "Logout.update"}, "Successfully logged out user");
                        return response.sendStatus(200);
                    });
                }
                else {
                    log.info({Function: "Logout.update"}, "Requested user not found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: User.Create)");
        return response.status(500).json(json);
    }
};
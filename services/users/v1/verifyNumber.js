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
 * This file contains the logic for the verify number service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');

/**
 * @apiDefine UserUnathorisedError
 *
 * @apiError UserUnathorised User Unauthorised.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorised
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
 * @api {post} /users/v1/verifyNumber Verify Number
 * @apiVersion 0.1.0
 * @apiName VerifyNumber
 * @apiGroup User
 *
 * @apiParam {Number} userId User's unique id.
 * @apiParam {String} authCode Four digit auth code.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *           "userId": 4,
 *           "authCode": "7488",
 *           "newNumber": "9944377754"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserUnauthorisedError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if(request.body.userId != null && request.body.authCode != null && request.body.newNumber != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = VerifyNumber.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    connection.query('SELECT auth_code FROM '+ config.mysql.db.name +'.two_step_verification WHERE user_id = ?', request.body.userId, function(queryError, match) {
                        if(queryError != null) {
                            log.error(connectionError, "Database connection error (Function = otp.verifyotp)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        if(match[0]) {
                            if(match[0].auth_code == request.body.authCode) {
                                connection.query('UPDATE '+ config.mysql.db.name +'.user SET phone = ? WHERE id = ?', [request.body.newNumber, request.body.userId], function(queryError, result) {
                                    if(queryError != null) {
                                        log.error(queryError, "Query error. Failed to verify number. (Function = VerifyNumber.Create)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    else {
                                        log.info({Function: "VerifyNumber.Create"}, "Phone Number verified. New number: " + request.body.newNumber);
                                        return response.sendStatus(200);
                                    }
                                });
                            }
                            else {
                                json = {
                                    error: "AuthCode mismatch"
                                };
                                log.info({Function: "otp.verifyotp"}, "otp verification unsuccessful.");
                                return response.status(401).json(json);
                            }
                        }
                        else {
                            json = {
                                error: "UserId, authCode mismatch"
                            };
                            log.info({Function: "otp.verifyotp"}, "otp verification unsuccessful.");
                            return response.status(401).json(json);
                        }
                    });

                }
            });
        }
        else {
            json ={
                error: "userId and authCode are required."
            };
            log.error({Function: "VerifyNumber.Create"}, "userId and authCode are required");
            return response.status(400).json(json);
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: VerifyNumber.Update)");
        return response.status(500).json(json);
    }
};
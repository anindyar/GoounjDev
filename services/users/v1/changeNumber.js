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
 * This file contains the logic for the change number service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var sms = require('./../../../sms');

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

/**
 * @apiDefine UserAlreadyExistsError
 *
 * @apiError UserAlreadyExists The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 501 Not Implemented
 */

/**
 * @apiDefine NumberMismatchError
 *
 * @apiError NumberMismatch The oldNumber does not match.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
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
 * @api {post} /users/v1/changeNumber Change Number
 * @apiVersion 0.1.0
 * @apiName ChangeNumber
 * @apiGroup User
 *
 * @apiParam {String} userId User's unique id.
 * @apiParam {String} oldNumber User's old phone number.
 * @apiParam {String} newNumber User's new phone number.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *           "userId": "2",
 *           "oldNumber": "9944377754",
 *           "newNumber": "9940741304"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse NumberMismatchError
 *
 * @apiUse UserNotFoundError
 *
 * @apiUse UserAlreadyExistsError
 *
 */

exports.create = function(request, response, next) {
    var json;
    try {
        if(request.body.oldNumber != null && request.body.newNumber != null && request.body.userId != null) {

            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = ChangeNumber.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT phone FROM '+ config.mysql.db.name +'.user WHERE id = ?', request.body.userId, function(queryError, change) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to create an election. (Function = ChangeNumber.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(change[0]) {
                        if(change[0].phone == request.body.oldNumber) {
                            connection.query('SELECT * FROM '+ config.mysql.db.name +'.user WHERE phone = ?', request.body.newNumber, function(queryError, check) {
                                if(queryError != null) {
                                    log.error(queryError, "Query error. Failed to create an election. (Function = ChangeNumber.Create)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                                else if(!check[0]) {
                                    var authCode = Math.floor(Math.random() * 9000) + 1000;
                                    connection.query('SELECT phone FROM '+ config.mysql.db.name +'.user WHERE id = ?', request.body.userId, function(queryError, number) {
                                        if(queryError != null) {
                                            log.error(queryError, "Query error. Failed to generate otp. (Function = otp.sendotp)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        if(number[0]) {
                                            if(config.userVerification.enabled) {
                                                var phoneArray = [];
                                                phoneArray.push(number[0].phone);
                                                sms.sendSMS(phoneArray, "This is Goounj OTP Service. Please enter the following verification code. Auth Code: " + authCode);
                                            }

                                            connection.query('SELECT * FROM '+ config.mysql.db.name +'.two_step_verification WHERE user_id = ?', request.body.userId, function(queryError, check) {
                                                if(queryError != null) {
                                                    log.error(queryError, "Query error. Failed to generate otp. (Function = otp.sendotp)");
                                                    json = {
                                                        error: "Requested action failed. Database could not be reached."
                                                    };
                                                    return response.status(500).json(json);
                                                }
                                                if(check.length != 0) {
                                                    connection.query('UPDATE '+ config.mysql.db.name +'.two_step_verification SET auth_code = ? WHERE user_id = ?', [authCode, request.body.userId], function(queryError, fix) {
                                                        if(queryError != null) {
                                                            log.error(queryError, "Query error. Failed to generate otp. (Function = otp.sendotp)");
                                                            json = {
                                                                error: "Requested action failed. Database could not be reached."
                                                            };
                                                            return response.status(500).json(json);
                                                        }
                                                        else {
                                                            log.info({Function: "otp.sendotp"}, "otp generation successful.");
                                                            return response.sendStatus(200);
                                                        }
                                                    });
                                                }
                                                else if(check.length == 0) {
                                                    connection.query('INSERT INTO '+ config.mysql.db.name +'.two_step_verification (user_id, auth_code) VALUES (?, ?)',[request.body.userId, authCode], function(queryError, entry) {
                                                        if(queryError != null) {
                                                            log.error(queryError, "Query error. Failed to generate otp. (Function = otp.sendotp)");
                                                            json = {
                                                                error: "Requested action failed. Database could not be reached."
                                                            };
                                                            return response.status(500).json(json);
                                                        }
                                                        else {
                                                            log.info({Function: "otp.sendotp"}, "otp generation successful.");
                                                            return response.sendStatus(200);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            json = {
                                                error: "User not found!"
                                            };
                                            log.info({Function: "otp.sendotp"}, "User not found.");
                                            return response.status(404).json(json);
                                        }
                                    });
                                }
                                else {
                                    json = {
                                        error: "An account already exists for that new number."
                                    };
                                    log.error({Function: "ChangeNumber.Create"}, "An account already exists for that new number.");
                                    return response.status(501).json(json);
                                }
                            });

                        }
                        else {
                            json = {
                                error: "Old phone number does not match."
                            };
                            log.info({Function: "ChangeNumber.Create"}, "Old Phone Number does not exists." + request.body.oldNumber );
                            return response.status(400).json(json);
                        }
                    }
                    else {
                        log.info({Function: "ChangeNumber.Create"}, "Requested User Not Found. User ID: " + request.body.userId );
                        return response.sendStatus(404);
                    }
                });
            });
        }
        else {
            json = {
                error: "oldNumber and newNumber are required."
            };
            log.error({Function: "ChangeNumber.Create"}, "oldNumber and newNumber are required");
            return response.status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: ChangeNumber.Create)");
        return response.status(500).json(json);
    }
};



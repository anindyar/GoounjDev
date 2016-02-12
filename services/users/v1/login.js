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
 * This file contains the logic for the login service.
 * 
 *************************************************************************/

var crypto = require('crypto');
var config = require('./../../../config');
var log = require('./../../../log');


/**
 * @apiDefine UserUnauthorisedError
 *
 * @apiError UserNotFound The requested user is unauthorised.
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
 * @api {post} /users/v1/login Create User
 * @apiVersion 0.1.0
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} country User's country name.
 * @apiParam {String} city User's city name.
 * @apiParam {String} phone User's phone number.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "country": "India",
 *           "city": "Chennai",
 *           "phone": "9991234567"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 */

 exports.create = function(request, response) {

    try {
        if (request.body.country == null) {
            log.info({Function: "Login.Create"}, "Login Failed. Details: 'Country' is empty");
            return response.sendStatus(401);
        }

        if (request.body.city == null) {
            log.info({Function: "Login.Create"}, "Login Failed. Details: 'City' is empty");
            return response.sendStatus(401);
        }

        if (request.body.phone == null) {
            log.info({Function: "Login.Create"}, "Login Failed. Details: 'Phone Number' is empty");
            return response.sendStatus(401);
        }

        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Login.Create)");
                json = {
                    error: "User Login failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT phone, publicKey, secret, user_id, verified FROM '+ config.mysql.db.name +'.user WHERE user_name = ?', request.body.username, function (queryError, authenticatedUser) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. User Login failed. Username: " + request.body.username + " (Function = Login.Create)");
                    json = {
                        error: "User Login failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if ((authenticatedUser == null) || (authenticatedUser[0].secret == null)) {
                        var json = {
                            error: "The email address or password supplied were not correct."
                        };
                        log.info({Function: "Login.Create"}, "Login Failed. Details: The email address or password supplied were not correct.");
                        return response.status(401).json(json);
                    }

                    if(authenticatedUser[0].verified === 0) {
                        json = {
                            error: "Your account is not activated. Please activate your account."
                        };
                        log.info({Function: "Login.Create"}, "Login Failed. Details: Your account is not activated. Please activate your account.");
                        return response.status(401).json(json);
                    }

                    var passwordArray = authenticatedUser[0].password.split(":");
                    var iterations = passwordArray[0];
                    var salt = passwordArray[1];
                    var originalPassword = passwordArray[2];
                    crypto.pbkdf2(request.body.password, salt, parseInt(iterations), 24, function(cryptoPdkError, encodedPassword) {
                        if (cryptoPdkError) {
                            json = {
                                error: "Login Failed"
                            };
                            log.error(cryptoPdkError, "Login Failed. Username: " + request.body.username + " (Function = Login.Create)");
                            return response.status(500).json(json);
                        }

                        if (encodedPassword.toString("base64") === originalPassword) {
                            var currentTimestamp = new Date();
                            var utcTimeStamp = currentTimestamp.toUTCString();

                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET atime=? WHERE user_id = ?', [utcTimeStamp,authenticatedUser[0].user_id], function(queryError, result) {
                                if (queryError != null) {
                                    log.error(queryError, "Query Error. User Login failed. Username: " + request.body.username + " (Function = Login.Create)");
                                    json = {
                                        error: "User Login failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                } else {
                                    json = {
                                        user_id: authenticatedUser[0].user_id,
                                        publickey: authenticatedUser[0].publickey,
                                        secret: authenticatedUser[0].secret
                                    };
                                    return response.status(200).json(json);
                                }
                            });
                        } else {
                            json = {
                                error: "The email address or password supplied were not correct."
                            };
                            log.info({Function: "Login.Create"}, "Login Failed. Details: The email address or password supplied were not correct.");
                            return response.status(401).json(json);
                        }
                    });
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Login.Create)");
        return response.status(500).json(json);
    }
};

exports.index = function(request, response) {
    var json;
    json = {
        message: 'Login index called'
    };
    return response.status(200).json(json);
};
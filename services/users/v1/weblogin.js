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
 * This file contains the logic for the web login service.
 *
 *************************************************************************/


var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');
var crypto = require('crypto');


exports.create = function(request, response) {

    try {
        if (request.body.code == null) {
            log.info({Function: "Weblogin.Create"}, "Login Failed. Details: 'Country' is empty");
            return response.sendStatus(401);
        }

        if (request.body.password == null) {
            log.info({Function: "Weblogin.Create"}, "Login Failed. Details: 'City' is empty");
            return response.sendStatus(401);
        }

        if (request.body.phone == null) {
            log.info({Function: "Weblogin.Create"}, "Login Failed. Details: 'Phone Number' is empty");
            return response.sendStatus(401);
        }

        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Weblogin.Create)");
                json = {
                    error: "User Login failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT name, password, public_key, secret_key, id, is_verified FROM '+ config.mysql.db.name +'.user WHERE phone = ? AND country_code = ?', [request.body.phone, request.body.code], function (queryError, authenticatedUser) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. User Login failed. Phone: " + request.body.phone + " (Function = Weblogin.Create)");
                    json = {
                        error: "User Login failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if ((authenticatedUser == null) || (authenticatedUser[0].secret_key == null)) {
                        var json = {
                            error: "The email address or password supplied were not correct."
                        };
                        log.info({Function: "Weblogin.Create"}, "Login Failed. Details: The phone or password supplied were not correct.");
                        return response.status(401).json(json);
                    }

                    if(authenticatedUser[0].password == null) {
                        json = {
                            error: "Contact Administrator for Web Access."
                        };
                        log.info({Function: "Weblogin.Create"}, "Login Failed. Details: Your account is not activated. Please activate your account.");
                        return response.status(401).json(json);
                    }

                    if(authenticatedUser[0].is_verified === 0) {
                        json = {
                            error: "Your account is not activated. Please activate your account."
                        };
                        log.info({Function: "Weblogin.Create"}, "Login Failed. Details: Your account is not activated. Please activate your account.");
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
                            log.error(cryptoPdkError, "Login Failed. Phone: " + request.body.phone + " (Function = Weblogin.Create)");
                            return response.status(500).json(json);
                        }

                        if (encodedPassword.toString("base64") === originalPassword) {
                            var currentTimestamp = new Date();
                            var utcTimeStamp = currentTimestamp.toUTCString();

                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET access_time=? WHERE id = ?', [utcTimeStamp, authenticatedUser[0].id], function(queryError, result) {
                                if (queryError != null) {
                                    log.error(queryError, "Query Error. User Login failed. Phone: " + request.body.phone + " (Function = Weblogin.Create)");
                                    json = {
                                        error: "User Login failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                } else {
                                    json = {
                                        name: authenticatedUser[0].name,
                                        useriId: authenticatedUser[0].id,
                                        publicKey: authenticatedUser[0].public_key,
                                        secretKey: authenticatedUser[0].secret_key
                                    };
                                    return response.status(200).json(json);
                                }
                            });
                        } else {
                            json = {
                                error: "The phone or password supplied were not correct."
                            };
                            log.info({Function: "Weblogin.Create"}, "Login Failed. Details: The email address or password supplied were not correct.");
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
        log.error(error, "Exception Occurred (Function = Weblogin.Create)");
        return response.status(500).json(json);
    }
};
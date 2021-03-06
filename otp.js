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


var sms = require('./sms');
var config = require('./config');
var log = require('./log');

//otp verification
exports.verifyotp = function(request, response) {
    var json;
    request.getConnection(function(connectionError, connection) {
        if(connectionError != null) {
            log.error(connectionError, "Database connection error (Function = otp.verifyotp)");
            json = {
                error: "OTP verification failed. Database could not be reached."
            };
            return response.status(500).json(json);
        }
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
                    log.info({Function: "otp.verifyotp"}, "otp verification successful.");
                    return response.sendStatus(200);
                }
                else {
                    log.info({Function: "otp.verifyotp"}, "otp verification unsuccessful.");
                    return response.sendStatus(401);
                }
            }
            else {
                log.info({Function: "otp.verifyotp"}, "User not found.");
                return response.sendStatus(404);
            }
        });
    });
};


//otp request
exports.sendotp = function(request, response, callback) {
    var json;
    var authCode = Math.floor(Math.random() * 9000) + 1000;
    request.getConnection(function(connectionError, connection) {
        if(connectionError != null) {
            log.error(connectionError, "Database connection error (Function = otp.sendotp)");
            json = {
                error: "Requested action failed. Database could not be reached."
            };
            return response.status(500).json(json);
        }
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
    });
};



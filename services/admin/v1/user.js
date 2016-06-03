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
 * This file contains the logic for the user service.
 *
 *************************************************************************/

var crypto = require('crypto');
var config = require('./../../../config');
var sendEmail = require('./../../../email');
var sms = require('./../../../sms');
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
 * @api {post} /user Create a new user
 * @apiSampleRequest http://localhost:3000/users/v1/user
 * @apiVersion 0.1.0
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} fname User's first name.
 * @apiParam {String} lname User's last name.
 * @apiParam {String} email User's email.
 * @apiParam {String} phone User's phone number.
 * @apiParam {String} password User's password.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "fname": "Kennet",
 *           "lname": "Jacob",
 *           "email": "kennetjacob@gmail.com",
 *           "password": "demodemo1234",
 *           "phone": "9994012253"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *           "secretKey": "2b73926b3cf4f6554eb5f2eadc38be95e3b1e883b7e16d3f80fbe6b5732501007575f90ea947d988a6c63bab8216ca2dd2fcc2a0e7b604a8f8a76c3856f4fdf2",
 *           "publicKey": "5ba30d56a51dea3c77bba7bddc39885d6a01879d18dbb6eb4df406d6988d8d55",
 *           "userId": "67",
 *           "authCode": 3759
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiError UserAlreadyExists The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "User already exists"
 *     }
 *
 */

exports.create = function(request, response) {
    var userId, email, json;
    try {
        if ((request.body.email != null) && (request.body.password != null) && (request.body.phone != null) && (request.body.code != null)) {

            if ((request.body.email != null)) {
                emailFilter = config.emailFilterRegex;
                if (!emailFilter.test(request.body.email)) {
                    json = {
                        error: "Not a valid email address"
                    };
                    log.info({Function: "User.Create"}, "Not a valid email address. Email:" + request.body.email);
                    return response.status(400).json(json);
                }
                email = request.body.email.toLowerCase();
            }


            if ((request.body.phone != null)) {
                var phoneFilter = /^\d{10}$/;
                if(!request.body.phone.match(phoneFilter))
                {
                    json = {
                        error: "Not a valid phone number"
                    };
                    log.info({Function: "User.Create"}, "Not a valid phone number. Phone:" + request.body.phone);
                    return response.status(400).json(json);
                }
            }

            if (request.body.password != null) {
                var passwordFilter = config.passwordFilterRegex;
                if (!passwordFilter.test(request.body.password)) {
                    json = {
                        error: "Not a valid password. Password should be 6 characters and must contain at least one digit"
                    };
                    log.info({Function: "User.Create"}, "Not a valid password. Password:" + "REDACT");
                    return response.status(400).json(json);
                }
            }

            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = User.Create)");
                    json = {
                        error: "User Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                var password = "";
                var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

                crypto.randomBytes(24, function(cryptoRandomError, randomBytes) {
                    if (cryptoRandomError) {
                        json = {
                            error: "Failed To Create A New User"
                        };
                        log.error(cryptoRandomError, "Failed To Create A New User. User details: " + JSON.stringify(request.body.email) + " (Function = User.Create)");
                        return response.status(500).json(json);
                    }
                    else {
                        crypto.pbkdf2(request.body.password, randomBytes.toString("base64"), config.hashIterations, 24, function(cryptoPdkError, encodedPassword) {
                            if (cryptoPdkError) {
                                json = {
                                    error: "Failed To Create A New User"
                                };
                                log.error(cryptoPdkError, "Failed To Create A New User. User details: " + JSON.stringify(request.body.email) + " (Function = User.Create)");
                                return response.status(500).json(json);
                            }
                            else {
                                password = config.hashIterations + ':' + randomBytes.toString("base64") + ':' + (encodedPassword.toString("base64"));
                                //var authCode = Math.floor(Math.random()*9000) + 1000;
                                var publicKey =  crypto.randomBytes(32).toString("hex");
                                var secretKey = crypto.randomBytes(64).toString("hex");

                                var verificationFlag = 0;
                                if(config.userVerification.enabled) {
                                    verificationFlag = 0;
                                } else {
                                    verificationFlag = 1;
                                }
                                connection.query('SELECT password, id, is_active FROM '+ config.mysql.db.name +'.user WHERE phone = ? AND country_code = ?', [request.body.phone, request.body.code], function(queryError, user) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query Error. Failed To Create A New User. User details: " + JSON.stringify(request.body.email) + " (Function = User.Create)");
                                        json = {
                                            error: "Requested Action Failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    userId = user[0].id;

                                    if(user.length != 0) {
                                        if (user[0].password != null) {
                                            json = {
                                                error: "User already exists"
                                            };
                                            log.info({Function: "User.Create"}, "User already exists. User ID:" + userId);
                                            return response.status(400).json(json);
                                        }

                                        if (user[0].is_active != 0) {
                                            json = {
                                                error: "User not verified. Contact admin."
                                            };
                                            log.info({Function: "User.Create"}, "User not verified. User ID:" + userId);
                                            return response.status(400).json(json);
                                        }

                                        else {

                                            //firstName, lastName, userEmail, userPhone, updateTime, createdTime, accessTime, userRole, publicKey, secretKey, userPassword, authCode
                                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET password = ?, updated_time = ?, email = ? WHERE id = ?', [password, utcTimeStamp, email, userId], function(queryError, user) {
                                                if (queryError != null) {
                                                    log.error(queryError, "Query Error. Failed To Create A New User. User details: " + JSON.stringify(request.body.email) + " (Function = User.Create)");
                                                    json = {
                                                        error: "Requested Action Failed. Database could not be reached."
                                                    };
                                                    return response.status(500).json(json);
                                                }
                                                else {
                                                    if(config.userVerification.enabled) {
                                                        if(config.email.enabled) {
                                                            sendEmail.sendEmail(email.toLowerCase(), 'GOOUNJ', 'Hi '+ request.body.name.toString().bold() +'!  This is Administrator, Goounj Support Service. \n Your password is: ' + request.body.password.toString().bold());
                                                        }
                                                    }

                                                    json = {
                                                        userId: userId,
                                                        publicKey: publicKey,
                                                        secretKey: secretKey
                                                    };
                                                    log.info({Function: "User.Create"}, "New WEB User Created Successfully. User Id: " + userId);
                                                    return response.status(200).json(json);
                                                }
                                            });
                                        }
                                    }

                                    else {
                                        connection.query('INSERT INTO '+ config.mysql.db.name +'.user (name, phone, country_code, email, city, created_time, updated_time, is_verified, role_id, auth_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [request.body.name, request.body.phone, request.body.code, email, request.body.city, utcTimeStamp, utcTimeStamp, verificationFlag, "1", "1"], function(queryError, user) {
                                            if (queryError != null) {
                                                log.error(queryError, "Query Error. Failed To Create A New User. User details: " + JSON.stringify(request.body.email) + " (Function = User.Create)");
                                                json = {
                                                    error: "Requested Action Failed. Database could not be reached."
                                                };
                                                return response.status(500).json(json);
                                            }
                                            else {
                                                if(config.userVerification.enabled) {
                                                    if(config.email.enabled) {
                                                        sendEmail.sendEmail(email.toLowerCase(), 'GOOUNJ', 'Hi '+ request.body.name.toString().bold() +'!  This is Administrator, Goounj Support Service. \n Your password is: ' + request.body.password.toString().bold());
                                                    }
                                                }

                                                json = {
                                                    userId: userId,
                                                    publicKey: publicKey,
                                                    secretKey: secretKey
                                                };
                                                log.info({Function: "User.Create"}, "New WEB User Created Successfully. User Id: " + userId);
                                                return response.status(200).json(json);
                                            }
                                        });
                                    }
                                });

                            }
                        });
                    }
                });
            });
        } else {
            json = {
                error: "Email/Username and Password are required"
            };
            log.error({Function: "User.Create"}, "Email/Username and Password are required");
            return response.status(400).json(json);
        }
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = User.Create)");
        return response.status(500).json(json);
    }
};
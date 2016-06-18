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
var crypto = require('crypto');
var util = require('./../../../util');
var moment = require('moment');
var sms = require('./../../../sms');
var mailer = require('./../../../email');


/**
 * @apiDefine AssociationNotFoundError
 *
 * @apiError AssociationNotFound The requested association was not found.
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
 * @api {post} /vote/v1/invite Invite Members to Association
 * @apiVersion 0.1.0
 * @apiName AssociationInvite
 * @apiGroup Vote
 *
 * @apiParam {String} associationId Association Id
 * @apiParam {String} member Member list consisting of their name, phone and country
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "member": [
 *            {
 *              "name": "Cath",
 *              "phone": "9944377754",
 *              "country": "India",
 *              "city": "Chennai",
 *              "code": "91"
 *            },
 *            {
 *              "name": "Ken",
 *              "phone": "9994012253",
 *              "country": "India",
 *              "city": "Chennai",
 *              "code": "91"
 *            },
 *            "associationId": 2
 *         ]
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

//adding members for an association
exports.create = function(request, response) {
    var json;
    var memberList = [];
    try {
        if(request.body.associationId != null && request.body.member != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Invite.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE id = ?', request.body.associationId, function(queryError, item) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Invite.Create)");
                        json  = {
                            error: "Query error. Failed to invite new association."
                        };
                        return response.status(500).json(json);
                    }
                    if(item.length != 0) {
                        memberList = request.body.member;
                        for(var i = 0; i < memberList.length; i++) {
                            (function () {
                                var count = 0;
                                var iCopy = i;
                                if(memberList[iCopy].name != null && memberList[iCopy].phone != null && memberList[iCopy].country != null && request.body.associationId != null) {
                                    connection.query('SELECT is_active, user_id FROM '+ config.mysql.db.name +'.association_user_map WHERE user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE country_code = ? AND phone = ?) AND association_id = ?', [memberList[iCopy].code, memberList[iCopy].phone, request.body.associationId], function(queryError, find) {
                                        if(queryError != null) {
                                            log.error(queryError, "Query error. (Function: Invite.Create)");
                                            json  = {
                                                error: "Query error. Failed to add association members."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        if(find[0]) {
                                            if(find[0].is_active == 0) {
                                                connection.query('UPDATE '+ config.mysql.db.name +'.association_user_map SET is_active = 1 WHERE user_id = ?', find[0].user_id, function(queryError, activate) {
                                                    if(queryError != null) {
                                                        log.error(queryError, "Query error. (Function: Invite.Create)");
                                                        json  = {
                                                            error: "Query error. Failed to add association members."
                                                        };
                                                        return response.status(500).json(json);
                                                    }
                                                    else {
                                                        count++;
                                                    }
                                                });
                                            }
                                            else {
                                                log.info({Function: "Invite.Create"}, "user: " + memberList[iCopy].name + " is already a member");
                                            }
                                            if(iCopy == memberList.length - 1) {
                                                return response.sendStatus(200);
                                            }
                                        }
                                        else {
                                            connection.query('SELECT id FROM '+ config.mysql.db.name +'.user WHERE country = ? AND phone = ?', [memberList[iCopy].country, memberList[iCopy].phone], function(queryError, user) {
                                                if(queryError != null) {
                                                    log.error(queryError, "Query error. (Function: Invite.Create)");
                                                    json  = {
                                                        error: "Query error. Failed to add association members."
                                                    };
                                                    return response.status(500).json(json);
                                                }
                                                if(user[0]) {
                                                    connection.query('INSERT INTO '+ config.mysql.db.name +'.association_user_map (user_id, association_id) VALUES (?, ?)', [user[0].id, request.body.associationId], function(queryError, fill) {
                                                        if(queryError != null) {
                                                            log.error(queryError, "Query error. (Function: Invite.Create)");
                                                            json  = {
                                                                error: "Query error. Failed to add association members."
                                                            };
                                                            return response.status(500).json(json);
                                                        }
                                                        else {
                                                            count++;
                                                            log.info({Function: "Invite.Create"}, "adding user ID: " + memberList[iCopy]);
                                                            if(iCopy == memberList.length - 1) {
                                                                log.info({Function: "Invite.Create"}, "added " +count+ " members");
                                                                return response.sendStatus(200);
                                                            }
                                                        }
                                                    });
                                                }
                                                else {
                                                    var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

                                                    crypto.randomBytes(24,function(cryptoRandomError, randomBytes) {
                                                        if(cryptoRandomError) {
                                                            json = {
                                                                error: "Failed to add a new member."
                                                            };
                                                            log.error(cryptoRandomError, "Failed to add a new member. User Details: " + JSON.stringify(memberList[iCopy].phone) + "(Function = Invite.Create)");
                                                            return response.status(500).json(json);
                                                        }
                                                        else {
                                                            crypto.pbkdf2(memberList[iCopy].phone, randomBytes.toString("base64"), config.hashIterations, 24, function(cryptoPdkError, encodedPhone) {
                                                                if(cryptoPdkError) {
                                                                    json = {
                                                                        error: "Failed to create a new user."
                                                                    };
                                                                    log.error(cryptoPdkError, "Failed to create new user. User Details: " + JSON.stringify(memberList[iCopy].phone) + "(Function = Invite.Create)");
                                                                    return response.status(500).json(json);
                                                                }
                                                                else {
                                                                    var publicKey = crypto.randomBytes(32).toString("hex");
                                                                    var secretKey = crypto.randomBytes(64).toString("hex");

                                                                    var verificationFlag = 0;
                                                                    if(config.userVerification.enabled) {
                                                                        verificationFlag = 0;
                                                                    }
                                                                    else {
                                                                        verificationFlag = 1;
                                                                    }

                                                                    //if(util.getCountryCode(memberList[iCopy].country) == "Undefined") {
                                                                    //    json = {
                                                                    //        error: "Invalid Country Name"
                                                                    //    };
                                                                    //    log.info({Function: "Invite.Create"}, "Invalid Country Name. Country Name: " + JSON.stringify(memberList[iCopy].country));
                                                                    //    return response.status(500).json(json);
                                                                    //}

                                                                    //userPhone, userCountry, countryCode, userCity, userRole, createdTime, publicKey, secretKey, verificationFlag, roleId, authTypeId, country, countryCode
                                                                    connection.query('INSERT INTO '+ config.mysql.db.name +'.user (name, phone, email, public_key, secret_key, access_time, created_time, updated_time, is_verified, role_id, auth_type_id, country, country_code, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [memberList[iCopy].name, memberList[iCopy].phone, memberList[iCopy].email, publicKey, secretKey, utcTimeStamp, utcTimeStamp, utcTimeStamp, verificationFlag, "1", "1", memberList[iCopy].country, memberList[iCopy].code, "1"], function(queryError, user) {
                                                                        if(queryError != null) {
                                                                            log.error(queryError, "Query error. Failed to create a new user. User details " + JSON.stringify(request.body.phone) + "(Function= User Create)");
                                                                            json = {
                                                                                error: "Requested action failed. Database could not be reached."
                                                                            };
                                                                            return response.status(500).json(json);
                                                                        }
                                                                        else {
                                                                            connection.query('INSERT INTO '+ config.mysql.db.name +'.association_user_map (user_id, association_id) VALUES (?, ?)', [user.insertId, request.body.associationId], function(queryError, fill) {
                                                                                if(queryError != null) {
                                                                                    log.error(queryError, "Query error. (Function: Invite.Create)");
                                                                                    json  = {
                                                                                        error: "Query error. Failed to add association members."
                                                                                    };
                                                                                    return response.status(500).json(json);
                                                                                }
                                                                                else {
                                                                                    var phoneArray = [];
                                                                                    phoneArray.push(memberList[iCopy].phone);
                                                                                    sms.sendSMS(phoneArray, "Hi " + memberList[iCopy].name + "! You have been added as a member to an association" + memberList[iCopy].associationName + "Download Goounj using https://play.google.com/store/apps/details?id=com.bvocal.goounj&hl=en");

                                                                                    count++;
                                                                                    log.info({Function: "Invite.Create"}, "adding user ID: " + memberList[iCopy]);
                                                                                    if(iCopy == memberList.length - 1) {
                                                                                        log.info({Function: "Invite.Create"}, "added " +count+ " members");
                                                                                        return response.sendStatus(200);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }

                                                            });
                                                        }

                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    json = {
                                        error: "Bad Request"
                                    };
                                    log.info({Function: "AssociationInvite.Create"}, "Bad Request.");
                                    return response.status(500).json(json);
                                }
                            }());
                        }
                    }
                    else {
                        json = {
                            error: "Association not found."
                        };
                        log.info({Function: "AssociationInvite.Create"}, "Association not found.");
                        return response.status(404).json(json);
                    }
                });
            });
        }
        else {
            log.info({Function: "AssociationInvite.Create"}, "Association not found.");
            return response.sendStatus(400);
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Invite.Create)");
        return response.status(500).json(json);
    }
};



/**
 * @api {get} /vote/v1/invite/:id Show Members of Association
 * @apiVersion 0.1.0
 * @apiName ShowAssociationMembers
 * @apiGroup Vote
 *
 * @apiParam {String} id Association Id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *      {
 *        "email": "admin@bvocal.in",
 *        "id": 1,
 *        "phone": "1234567890",
 *        "country": "India",
 *        "name": "Goounj Bvocal",
 *        "is_active": 1
 *      },
 *      {
 *        "email": "",
 *        "id": 6,
 *        "phone": "9095914543",
 *        "country": "India",
 *        "name": "Nanda",
 *        "is_active": 1
 *      },
 *      {
 *        "email": "",
 *        "id": 7,
 *        "phone": "7339447457",
 *        "country": "India",
 *        "name": "Kate",
 *        "is_active": 1
 *      }
 *  ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

//members of the given association
exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Invite.Show)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('SELECT user.id, user.email, user.phone, user.country, user.name, user.is_active  FROM association_user_map as associationDetails INNER JOIN user ON user_id = user.id WHERE association_id = ? AND associationDetails.is_active = 1', request.params.id, function(queryError, list) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create an election. (Function = Invite.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if(list) {
                    for(var i=0; i<list.length; i++) {
                        if(list[i].email == null) {
                            list[i].email = "";
                        }
                    }
                    log.info({Function: "Invite.Show"}, "Fetched Association member list.");
                    return response.status(200).json(list);
                }
                else {
                    log.info({Function: "Invite.Show"}, "Requested association not found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Invite.Show)");
        return response.status(500).json(json);
    }
};


/**
 * @api {put} /vote/v1/invite/:id Update Members of Association
 * @apiVersion 0.1.0
 * @apiName UpdateAssociationMember
 * @apiGroup Vote
 *
 * @apiParam {Number} id Association Id
 * @apiParam {Number} userId User's unique Id
 * @apiParam {Number} isActive is_active flag of the association member
 *
 * @apiParamExample {json} Request-Example:
 * {
 *  "userId": 3,
 *  "isActive": 0
 * }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

exports.update = function(request, response) {
    var json;
    try {
        if(request.body.userId != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Invite.Update)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                //userId must be an array
                var userId = request.body.userId;
                for(var i = 0; i < userId.length; i++) {
                    (function(){
                        var iCopy = i;
                        connection.query('UPDATE '+ config.mysql.db.name + '.association_user_map SET is_active = 0 WHERE association_id = ? AND user_id = ?', [request.params.id, userId[iCopy]], function(queryError, member) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to create an election. (Function = Invite.Update)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                if(iCopy == userId.length - 1) {
                                    log.info({Function: "Invite.Show"}, "Members set to inactive: " + userId.length);
                                    return response.sendStatus(200);
                                }
                            }
                        });
                    }());
                }
            });
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Invite.Delete)");
        return response.status(500).json(json);
    }
};

exports.options = function(request, response) {
    return response.sendStatus(200);
};

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

exports.create = function(request, response) {
    var json;
    var memberList = [];
    try {
        if(request.body.associationId != null && request.body.members != null) {
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
                        var count = 0;
                        memberList = request.body.members;
                        for(var i = 0; i < memberList.length; i++) {
                            (function () {
                                var iCopy = i;
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association_user_map WHERE user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?) AND association_id = ?', [memberList[iCopy], request.body.associationid], function(queryError, check) {
                                    if(queryError != null) {
                                        log.error(queryError, "Query error. (Function: Invite.Create)");
                                        json  = {
                                            error: "Query error. Failed to add association members."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    if(check.length == 0) {
                                        connection.query('SELECT * FROM '+ config.mysql.db.name +'.association_user_map WHERE user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?) AND association_id = ?',  [memberList[iCopy], request.body.associationId], function(queryError, find) {
                                            if(queryError != null) {
                                                log.error(queryError, "Query error. (Function: Invite.Create)");
                                                json  = {
                                                    error: "Query error. Failed to add association members."
                                                };
                                                return response.status(500).json(json);
                                            }
                                            else if(find.length != 0) {
                                                log.info({Function: "Invite.Create"}, memberList[iCopy] + " is already a member");

                                                if(iCopy == memberList.length - 1 && count == 0) {
                                                    log.info({Function: "Invite.Create"}, "No new members.");
                                                    return response.sendStatus(200);
                                                }
                                            }
                                            else {
                                                connection.query('INSERT INTO '+ config.mysql.db.name +'.association_user_map (user_id, association_id) VALUES ((SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?), ?)', [memberList[iCopy], request.body.associationId], function(queryError, fill) {
                                                    if(queryError != null) {
                                                        log.error(queryError, "Query error. (Function: Invite.Create)");
                                                        json  = {
                                                            error: "Query error. Failed to add association members."
                                                        };
                                                        return response.status(500).json(json);
                                                    }
                                                    else {
                                                        log.info({Function: "Invite.Create"}, "adding members..");
                                                        count++;
                                                        if(iCopy == memberList.length - 1) {
                                                            log.info({Function: "Invite.Create"}, count + " members added.");
                                                            return response.sendStatus(200);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
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
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Invite.Create)");
        return response.status(500).json(json);
    }
};

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
            connection.query('SELECT name FROM association_user_map INNER JOIN user ON user_id = user.id WHERE association_id = ?', request.params.id, function(queryError, list) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create an election. (Function = Invite.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if(list) {
                    var  members = [];
                    for(var i=0; i<list.length; i++) {
                        members.push(list[i].name);
                    }
                    log.info({Function: "Invite.Show"}, "Fetched Association member list.");
                    return response.status(200).json(members);
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
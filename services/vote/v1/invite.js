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

                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE id = ?', request.params.id, function(queryError, item) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Invite.Create)");
                        json  = {
                            error: "Query error. Failed to create new association."
                        };
                        return response.status(500).json(json);
                    }
                    if(item) {
                        var memberList = request.body.members;
                        for(i = 0; i < memberList.length; i++) {
                            connection.query('SELECT * FROM '+ config.mysql.db.name +'.association_user_map WHERE user_id = (SELECT user_id FROM '+ config.mysql.db.name +'.user WHERE first_name = ? AND last_name = ?) AND association_id = ?', [memberList[i].firstName, memberList[i].lastName, request.params.id], function(queryError, check) {
                                if(queryError != null) {
                                    log.error(queryError, "Query error. (Function: Invite.Create)");
                                    json  = {
                                        error: "Query error. Failed to create new association."
                                    };
                                    return response.status(500).json(json);
                                }
                                if(!check) {
                                    connection.query('INSERT INTO '+ config.mysql.db.name +'.association_user_map (user_id, association_id) VALUES ((SELECT user_id FROM '+ config.mysql.db.name +'.user WHERE first_name = ? AND last_name = ?), ?)', [memberList[i].firstName, memberList[i].lastName, request.params.id], function(queryError, fill) {
                                        if(queryError != null) {
                                            log.error(queryError, "Query error. (Function: Invite.Create)");
                                            json  = {
                                                error: "Query error. Failed to create new association."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else{
                                            log.info({Function: "Invite.Create"}, "Association members invited.");
                                            return response.sendStatus(200);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    else {
                        log.info({Function: "AssociationInvite.Create"}, "Association not found.");
                        return response.sendStatus(404);
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
            connection.query('SELECT concat(first_name," ",last_name) AS members FROM association_user_map INNER JOIN user ON user_id = user.id WHERE association_id = ?', request.params.id, function(queryError, list) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create an election. (Function = Invite.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if(list) {
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
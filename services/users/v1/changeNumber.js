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
 * Main config file.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');

exports.update = function(request, response) {
    var json, jsonData = {};
    try {
        if(request.body.oldNumber != null && request.body.newNumber != null) {

            var phoneFilter = /^\d{10}$/;
            if(request.body.phone.match(phoneFilter)) {
                jsonData['phone'] = request.body.phone;
            } else {
                json = {
                    error: "Not a valid phone number"
                };
                log.info({Function: "ChangeNumber.Update"}, "Not a valid phone number. New Number:" + request.body.newNumber);
                return response.status(400).json(json);
            }

            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = ChangeNumber.Update)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT phone FROM '+ config.mysql.db.name +'.user WHERE id = ?', request.params.id, function(queryError, change) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to create an election. (Function = ChangeNumber.Update)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(change[0]) {
                        if(change[0].phone == request.body.oldNumber) {
                            connection.query('UPDATE '+ config.mysql.db.name +'.user SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, result) {
                                if(queryError != null) {
                                    log.error(queryError, "Query error. Failed to create an election. (Function = ChangeNumber.Update)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                                else {
                                    log.info({Function: "ChangeNumber.Update"}, "Phone Number changed. New number" + request.body.newNumber );
                                    return response.sendStatus(200);
                                }
                            });
                        }
                        else {
                            json = {
                                error: "Old phone number does not match."
                            };
                            log.info({Function: "ChangeNumber.Update"}, "Old Phone Number mismatch." + request.body.oldNumber );
                            return response.status(501).json(json);
                        }
                    }
                    else {
                        log.info({Function: "ChangeNumber.Update"}, "Requested User Not Found. User ID: " + request.params.id );
                        return response.sendStatus(404);
                    }
                });
            });
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: ChangeNumber.Update)");
        return response.status(500).json(json);
    }
};


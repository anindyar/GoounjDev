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
var sms = require('./../../../sms');
var log = require('./../../../log');
var moment = require('moment');

exports.create = function(request, response) {
  var json;
    try {
        if(request.body.associationName != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error. (Function: Association.create)");
                    json = {
                      error: "Connection failed. Database could not be reached"
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE name = ?', request.body.associationName, function(queryError, association) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Association.create)");
                        json  = {
                            error: "Query error. Failed to create new association."
                        };
                        return response.status(500).json(json);
                    }
                    else if(association[0]) {
                        var associationOBJ = association[0];
                        var associationID = associationOBJ[0];
                        json = {
                            error: "Association already exists!"
                        };
                        log.info({Function: "Association.Create"},"Association already exists. Category ID: " + associationID);
                        return response.status(400).json(json);

                    }
                    else {
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.association (name) VALUES (?)', request.body.associationName, function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Association.create)");
                                json  = {
                                    error: "Query error. Failed to create new association."
                                };
                                return response.status(500).json(json);
                            }
                            else{
                                associationID = result.insertId;
                                json = {
                                    AssociationID: associationID
                                };
                                log.info({Function: "Association.Create"}, "New association created successfully. Association ID: " + associationID);
                                return response.status(200).json(json);
                            }
                        });
                    }
                });
            });
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Association.Create)");
        return response.status(500).json(json);
    }
};


exports.update = function(request, response) {
    var json;
    try {
        if(request.params.id != null && request.body.association != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Association.Update");
                    json = {
                        error: "Association Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE name = ?', [request.body.association], function(queryError, item) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to create a new association. Association Details: " + JSON.stringify(request.body.association) + "(Function = Association.Update)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if (item[0]) {
                        var associationOBJ = item[0];
                        var associationID = associationOBJ[0];
                        json = {
                            error: "Association already exists!"
                        };
                        log.info({Function: "Association.Update"}, "Association already exists. Association ID: " + associationID);
                        return response.status(400).json(json);
                    }
                    else{
                        connection.query('SELECT * FROM ' + config.mysql.db.name + '.association WHERE id = ?', [request.params.id], function (queryError, entry) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch the requested association. Association Details: " + JSON.stringify(request.params.id) + "(Function = Association.Update)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(!entry[0]){
                                json = {
                                    error: "Requested Association not found."
                                };
                                log.info({Function: "Association.Update"},"Requested association not found. Association ID: " + request.params.id);
                                return response.status(404).json(json);
                            }
                            else {
                                if(request.body.association != null){
                                    connection.query('UPDATE '+ config.mysql.db.name + '.association SET name = ? WHERE id = ?', [request.body.association, request.params.id], function(queryError, none){
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to update association. Association ID: " + JSON.stringify(request.params.id) + "(Function = Association.Update)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else {
                                            connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE id = ?', request.params.id, function(queryError, result) {
                                                if (queryError != null) {
                                                    log.error(queryError, "Query Error. Failed To Update Association. Association ID: " + request.params.id + " (Function = Association.Update)");
                                                    json = {
                                                        error: "Requested Action Failed. Database could not be reached."
                                                    };
                                                    return response.status(500).json(json);
                                                } else {
                                                    log.info({Function: "Association.Update"}, "Association Updated Successfully. Association ID: " + request.params.id);
                                                    return response.status(200).json(result[0]);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            });
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Association: Update)");
        return response.status(500).json(json);
    }
};


exports.index = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError) {
                log.error(connectionError, "Database connection error (Function = Association.Index");
                json = {
                    error: "Association Create failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            else {
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association', function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query Error. Failed to fetch association details. (Function = Association.Index)");
                        json = {
                            error: "Requested Action Failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    } else {
                        if (result) {
                            log.info({Function: "Association.Show"}, "Fetched Association Details.");
                            return response.status(200).json(result);
                        } else {
                            log.info({Function: "Association.Show"}, "No Associations yet!");
                            return response.sendStatus(404);
                        }
                    }
                });
            }
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Association: Update)");
        return response.status(500).json(json);
    }
};


exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Association.Delete)");
                json = {
                    error: "Association Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('DELETE FROM ' + config.mysql.db.name + '.association WHERE id = ?', request.params.id, function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Delete an Association. Association ID: " + request.params.id + " (Function = Association.Delete)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result.affectedRows != 0) {
                        log.info({Function: "Association.Delete"}, "Association Deleted Successfully. id: " + request.params.id);
                        return response.sendStatus(200);
                    } else {
                        log.info({Function: "Association.Delete"}, "Requested Association Not Found. Association ID: " + request.params.id );
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Association.Delete)");
        return response.status(500).json(json);
    }
};
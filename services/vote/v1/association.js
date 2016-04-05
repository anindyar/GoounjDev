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

/**
 * @apiDefine AssociationNotFoundError
 *
 * @apiError AssociationNotFound The requested user was not found.
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
 * @api {post} /vote/v1/association Create Association
 * @apiVersion 0.1.0
 * @apiName CreateAssociation
 * @apiGroup Vote
 *
 * @apiParam {String} associationName Association name.
 * @apiParam {String} associationAdminId Association Id.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "associationName": "Orgware",
 *      "associationAdminId": "2"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "AssociationID": 3
 *      }
 *
 * @apiUse DatabaseError
 *
 *
 */

exports.create = function(request, response) {
  var json;
    try {
        if(request.body.associationName != null && request.body.associationAdminId != null) {
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
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.association (name, admin_id) VALUES (?, ?)', [request.body.associationName, request.body.associationAdminId], function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Association.create)");
                                json  = {
                                    error: "Query error. Failed to create new association."
                                };
                                return response.status(500).json(json);
                            }
                            else{
                                associationID = entry.insertId;
                                connection.query('INSERT INTO '+ config.mysql.db.name +'.association_user_map (association_id, user_id) VALUES (?, ?)', [associationID, request.body.associationAdminId], function(queryError, entry) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query error. (Function: Association.create)");
                                        json = {
                                            error: "Query error. Failed to create new association."
                                        };
                                        return response.status(500).json(json);
                                    }
                                });
                                json = {
                                    associationId: associationID
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


/**
 * @api {put} /vote/v1/association/:id Update Association
 * @apiVersion 0.1.0
 * @apiName UpdateAssociation
 * @apiGroup Vote
 *
 * @apiParam {String} associationName Association name.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "associationName": "Orgware Technologies"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "name": "Orgware Technologies",
 *       "admin_id": 1
 *     }
 *
 * @apiUse DatabaseError
 *
 *
 */

exports.update = function(request, response) {
    var json;
    try {
        if(request.params.id != null && request.body.associationName != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Association.Update");
                    json = {
                        error: "Association Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association WHERE name = ?', [request.body.associationName], function(queryError, item) {
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
                                var jsonData = {};
                                if(request.body.associationName != null) {
                                    jsonData['name'] = request.body.associationName;
                                }
                                if(request.body.associationAdminId != null) {
                                    jsonData['admin_id'] = request.body.associationAdminId;
                                }

                                connection.query('UPDATE '+ config.mysql.db.name + '.association SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, none){
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
                        });
                    }
                });

            });
        }
        else {
            json = {
                error: "New Association Name/Admin Id and Id are required."
            };
            log.info({Function: "Association.Update"}, "Association Update Failed.");
            return response.status(500).json(json);
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


/**
 * @api {get} /vote/v1/association Index Association
 * @apiVersion 0.1.0
 * @apiName IndexAssociation
 * @apiGroup Vote
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "name": "Orgware Technologies",
 *        "is_active": 1
 *      },
 *      {
 *        "name": "Devs",
 *        "is_active": 1
 *      }
 *    ]
 *
 * @apiUse DatabaseError
 *
 *
 */

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
                connection.query('SELECT name, is_active FROM '+ config.mysql.db.name +'.association', function(queryError, result) {
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
        log.error(error, "Exception Occurred (Function = Association.Update)");
        return response.status(500).json(json);
    }
};


/**
 * @api {get} /vote/v1/association/:id Show Association
 * @apiVersion 0.1.0
 * @apiName ShowAssociation
 * @apiGroup Vote
 *
 * @apiParam {Number} associationId Association Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "memberTotal": 1,
 *        "name": "Orgware Technologies",
 *        "associationAdminId": 1,
 *        "associationAdminName": "Goounj Bvocal"
 *      }
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Association.Show)");
                json = {
                    error: "Association Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT association.name AS associationName, association.admin_id AS associationAdminId, (SELECT name FROM user WHERE id = association.admin_id) AS associationAdminName,  COUNT(association_user_map.user_id) AS memberTotal FROM association INNER JOIN association_user_map ON association.id = association_user_map.association_id WHERE association.id = ? AND is_active = ?', [request.params.id, "1"], function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Show an Association. Association ID: " + request.params.id + " (Function = Association.Show)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result[0]) {
                    var associationObj = {
                        associationName: result[0].associationName,
                        associationAdminId: result[0].associationAdminId,
                        associationAdminName: result[0].associationAdminName,
                        memberTotal: result[0].memberTotal,
                        members: []
                    };
                    connection.query('SELECT name FROM association_user_map INNER JOIN user ON user_id = user.id WHERE association_id = ?', request.params.id, function(queryError, member) {
                        if (queryError != null) {
                            log.error(queryError, "Query Error. Failed To Show an Association. Association ID: " + request.params.id + " (Function = Association.Show)");
                            json = {
                                error: "Requested Action Failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(member) {
                            for(var i=0; i<member.length; i++) {
                                associationObj.members.push(member[i].name);
                            }
                            log.info({Function: "Association.Show"}, "Fetched Association Details. Association ID: " + request.params.id);
                            return response.status(200).json(associationObj);
                        }
                    });
                }
                else {
                    log.info({Function: "Association.Show"}, "Requested Association not found. Association ID: " + request.params.id);
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Association.Show)");
        return response.status(500).json(json);
    }
};


/**
 * @api {delete} /vote/v1/association/:id Delete Association
 * @apiVersion 0.1.0
 * @apiName DeleteAssociation
 * @apiGroup Vote
 *
 * @apiParam {Number} associationId Association Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

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

            connection.query('UPDATE '+ config.mysql.db.name + '.association SET is_active = ? WHERE id = ?', ["0", request.params.id], function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Delete an Association. Association ID: " + request.params.id + " (Function = Association.Delete)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    if (result.affectedRows != 0) {
                        log.info({Function: "Association.Delete"}, "Association Deleted Successfully. id: " + request.params.id);
                        return response.sendStatus(200);
                    }
                    else {
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
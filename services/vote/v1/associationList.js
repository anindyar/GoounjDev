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
 * This file contains the logic for the poll answer service.
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
 * @api {post} /vote/v1/associationList List of associations for Member user
 * @apiVersion 0.1.0
 * @apiName CreateAssociationList
 * @apiGroup Vote
 *
 * @apiParam {Integer} userId User's unique id.
 * @apiParam {Integer} lowerLimit lower bound of the range of association list.
 * @apiParam {Integer} upperLimit upper bound of the range of association list.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "userId": "1",
 *      "lowerLimit": 0,
 *      "upperLimit": 10
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "associationAdminName": "Goounj Bvocal",
 *        "associationID": 1,
 *        "associationName": "Orgware Technologies"
 *      },
 *      {
 *        "associationAdminName": "Goounj Bvocal",
 *        "associationID": 2,
 *        "associationName": "Devs"
 *      },
 *      {
 *        "associationAdminName": "Goounj Bvocal",
 *        "associationID": 3,
 *        "associationName": "Orgware"
 *      }
 *    ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

//listing associations for participant user
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId !== null) && (request.body.lowerLimit != null) && (request.body.upperLimit != null)) {
            request.getConnection(function (connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = associationList.Create)");
                    json = {
                        error: "associationList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                connection.query('SELECT association.id AS associationID, association.name AS associationName, user.name AS associationAdminName  FROM association INNER JOIN user ON association.admin_id = user.id INNER JOIN association_user_map ON association.id = association_id WHERE association.is_active = ? AND user.id = ? LIMIT ?, ?', ["1", request.body.userId, request.body.lowerLimit, request.body.upperLimit], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch association list. Details " + JSON.stringify(request.body.userId) + "(Function = associationList.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(result[0]) {
                        log.info({Function: "associationList.Create"}, "Fetched Association List.");
                        return response.status(200).json(result);
                    }
                    else {
                        log.info({Function: "associationList.Create"}, "No associations found.");
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
        log.error(error, "Exception Occurred (Function = PollList.Create)");
        return response.status(500).json(json);
    }
};


/**
 * @api {get} /vote/v1/associationList/:id List of associations for Admin user
 * @apiVersion 0.1.0
 * @apiName ShowAssociationList
 * @apiGroup Vote
 *
 * @apiParam {Integer} userId User's unique id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "associations": [
 *                 "Orgware Technologies",
 *                 "Devs",
 *                 "Orgware"
 *               ]
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

//listing associations for the admin user.
exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = associationList.Show)");
                json = {
                    error: "PollList.Show failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT name FROM association WHERE admin_id = ? AND is_active = ?', [request.params.id, "1"], function(queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll list. Details " + JSON.stringify(request.params.id) + "(Function = associationList.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(result[0]) {
                    var associations = [];
                    var json = {
                        associations: associations
                    };
                    for(i = 0; i < result.length; i++) {
                        associations.push(result[i].name);
                    }
                    log.info({Function: "associationList.Show"}, "Fetched Association List.");
                    return response.status(200).json(json);
                }
                else {
                    log.info({Function: "associationList.Show"}, "Requested UserId not found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = associationList.Show)");
        return response.status(500).json(json);
    }
};
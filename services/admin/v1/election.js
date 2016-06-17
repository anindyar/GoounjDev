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
 * This file contains the logic for the election admin service.
 *
 *************************************************************************/


var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');



/**
 * @apiDefine ElectionNotFoundError
 *
 * @apiError ElectionNotFound The requested election was not found.
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
 * @api {delete} admin/v1/election/:id Delete Election
 * @apiVersion 0.1.0
 * @apiName DeleteElection
 * @apiGroup Admin
 *
 * @apiParam {Number} id Election's unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 */


exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Election.Delete)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('DELETE FROM '+ config.mysql.db.name +'.vote WHERE election_id = ?; DELETE FROM '+ config.mysql.db.name +'.election_user_map WHERE election_id = ?; DELETE FROM '+ config.mysql.db.name +'.election WHERE id = ?', [request.params.id, request.params.id, request.params.id], function(queryError, remove) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch election details. (Function = Election.Delete)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(remove.affectedRows != 0) {
                    log.info({Function: "Election.Delete"}, "Election Deleted Successfully. Election ID: " + request.params.id);
                    return response.sendStatus(200);
                }
                else {
                    log.info({Function: "Election.Delete"}, "Requested Election Not Found. Election ID: " + request.params.id );
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Election.Delete)");
        return response.status(500).json(json);
    }
};
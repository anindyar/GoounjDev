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
 * @apiDefine CandidateNotFoundError
 *
 * @apiError CandidateNotFound The requested candidate was not found.
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
 * @api {post} /vote/v1/nominate Accept Candidate
 * @apiVersion 0.1.0
 * @apiName AcceptCandidate
 * @apiGroup Vote
 *
 * @apiParam {Number} isActive is_active flag for candidate
 * @apiParam {Number} candidateId Candidate's unique id
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "isActive": 1,
 *         "candidateId": 3
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse CandidateNotFoundError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if(request.body.isActive != 0 && request.body.candidateId != 0) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Nominate.Create");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT is_active FROM '+ config.mysql.db.name +'.candidate  WHERE id = ?', request.body.candidateId, function(queryError, check) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Nominate.Create)");
                        json  = {
                            error: "Requested Action Failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(check) {
                        connection.query('UPDATE '+ config.mysql.db.name +'.candidate SET is_active = ? WHERE id = ?', [request.body.isActive, request.body.candidateId], function(queryError, nom) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Nominate.Create)");
                                json  = {
                                    error: "Requested Action Failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(nom) {
                                if(request.body.isActive == 1) {
                                    log.info({Function: "Nominate.Create"}, "Candidate accepted.");
                                    return response.sendStatus(200);
                                }
                                else if(request.body.isActive == 0) {
                                    log.info({Function: "Nominate.Create"}, "Candidate rejected.");
                                    return response.sendStatus(200);
                                }
                            }
                        });
                    }
                    else {
                        log.info({Function: "Nominate.Create"}, "Candidate not found.");
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
        log.error(error, "Exception occured. (Function: Nominate.Update)");
        return response.status(500).json(json);
    }
};
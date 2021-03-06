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
 * This file contains the logic for the vote service.
 *
 *************************************************************************/



var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');


/**
 * @apiDefine CandidateNotFoundError
 *
 * @apiError CandidateNotFound The requested candidate was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */


/**
 * @apiDefine BadRequestError
 *
 * @apiError BadRequest Database could not be reached.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *
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
 * @apiParam {Number} userId User's unique Id
 * @apiParam {Number} candidateId Candidate's unique Id
 * @apiParam {Number} electionId Election's unique Id
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *        "userId": 3,
 *        "candidateId": 7,
 *        "electionId": 11
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
 * @apiUse BadRequestError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if((request.body.candidateId != null) && (request.body.userId != null) && (request.body.electionId != null)) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Vote.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ? AND election_id = ?', [request.body.candidateId, request.body.electionId], function(queryError, candidate) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to record vote. ElectionID: " + JSON.stringify(request.body.electionId) + " & CandidateID: " + JSON.stringify(request.body.candidateId) + "(Function = Vote.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(candidate[0]) {
                        connection.query('SELECT * FROM '+ config.mysql.db.name +'.vote WHERE user_id = ? AND election_id = ?', [request.body.userId, request.body.electionId], function(queryError, check) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. Failed to record vote. ElectionID: " + JSON.stringify(request.body.electionId) + " & CandidateID: " + JSON.stringify(request.body.candidateId) + "(Function = Vote.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(check[0] != null) {
                                json = {
                                    message: "User has already cast a vote for this election."
                                };
                                log.info({Function: "Candidate.Create"}, "User has already voted.");
                                return response.status(501).json(json);
                            }
                            else {
                                var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

                                connection.query('INSERT INTO '+ config.mysql.db.name +'.vote (user_id, candidate_id, election_id) VALUES (?, ?, ?)', [request.body.userId, request.body.candidateId, request.body.electionId], function(queryError, entry) {
                                    if(queryError != null) {
                                        log.error(queryError, "Query error. Failed to record vote. ElectionID: " + JSON.stringify(request.body.electionId) + " & CandidateID: " + JSON.stringify(request.body.candidateId) + "(Function = Vote.Create)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    else if(entry){
                                        connection.query('UPDATE '+ config.mysql.db.name +'.election_user_map SET is_voted = ?, voted_time = ?', [1, utcTimeStamp], function(queryError, item) {
                                            if(queryError != null) {
                                                log.error(queryError, "Query error. Failed to update election_voter_map.(Function = Vote.Create)");
                                                json = {
                                                    error: "Requested action failed. Database could not be reached."
                                                };
                                                return response.status(500).json(json);
                                            }
                                        });
                                        log.info({Function: "Vote.Create"}, "User voting successful.");
                                        return response.sendStatus(200);
                                    }
                                });
                            }
                        });
                    }
                    else {
                        json = {
                            error: "Election/Candidate does not exist."
                        };
                        log.info({Function: "Vote.Create"}, "User voting unsuccessful. Election/Candidate does not exist.");
                        return response.status(404).json(json);
                    }
                });
            });
        }
        else {
            json = {
                error: "Nominee ID, voter ID and election ID are required."
            };
            log.error({Function: "Vote.Create"}, "Parameter(s) are empty.");
            return response.status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Vote.Create)");
        return response.status(500).json(json);
    }
};



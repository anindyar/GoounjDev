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
 * This file contains the logic for the list of candidates service.
 *
 *************************************************************************/


var config = require('./../../../config');
var log = require('./../../../log');

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
 * @apiDefine ElectionNotFoundError
 *
 * @apiError ElectionNotFound The requested election was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */


/**
 * @api {get} /vote/v1/candidateList/:id List of candidates for an election
 * @apiVersion 0.1.0
 * @apiName CreateCandidateList
 * @apiGroup Vote
 *
 *
 * @apiParam {Number} id Election Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "candidateCount": 2,
 *          "candidates": [
 *                    {
 *                       "nickName": "Kate",
 *                       "candidateId": 2,
 *                       "name": "Catherine",
 *                       "about": "JS developer",
 *                       "manifesto": "I will blah blah blah"
 *                     },
 *                     {
 *                       "nickName": "Sam",
 *                       "candidateId": 3,
 *                       "name": "Samuel",
 *                       "about": "Process Designer",
 *                       "manifesto": "I will blah blah blah"
 *                     }
 *              ]
 *      }
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "candidateCount": 0,
 *          "message": "There are no candidates for this election yet."
 *      }
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 *
 */

exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = CandidateList.Show");
                json = {
                    error: "Candidate listing failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM '+ config.mysql.db.name +'.election_user_map WHERE election_id = ?', request.params.id, function(queryError, check) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: CandidateList.Show)");
                    json  = {
                        error: "Query error. Failed to list candidates."
                    };
                    return response.status(500).json(json);
                }
                if(check[0]) {
                    connection.query('SELECT id AS candidateId, name AS candidateName, nick_name AS nickName, about, manifesto FROM '+ config.mysql.db.name +'.candidate WHERE election_id = ? AND is_active = 1', request.params.id, function(queryError, result) {
                        if(queryError != null) {
                            log.error(queryError, "Query error. (Function: CandidateList.Show)");
                            json  = {
                                error: "Requested Action Failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        if(result.length != 0) {
                            var candidate = [];
                            for(i = 0; i < result.length; i++) {
                                var candidateOBJ = {
                                    candidateId: result[i].candidateId,
                                    name: result[i].candidateName,
                                    nickName: result[i].nickName,
                                    about: result[i].about,
                                    manifesto: result[i].manifesto
                                };
                                candidate.push(candidateOBJ);
                            }
                            json = {
                                candidates: candidate,
                                candidateCount: result.length
                            };
                            log.info({Function: "CandidateList.Show"}, "Fetched Candidate List.");
                            return response.status(200).json(json);
                        }
                        else {
                            json = {
                                candidateCount: result.length,
                                message: "There are no candidates for this election yet."
                            };
                            log.info({Function: "CandidateList.Show"}, "No Candidates found for this election.");
                            return response.status(200).json(json);
                        }
                    });
                }
                else if(!check[0]) {
                    log.info({Function: "CandidateList.Show"}, "Election does not exists.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: CandidateList.Show)");
        return response.status(500).json(json);
    }
};
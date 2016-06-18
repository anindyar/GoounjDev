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
 * This file contains the logic for the vote result service.
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
 * @api {get} /vote/v1/voteResult/:id Show vote results
 * @apiVersion 0.1.0
 * @apiName VoteResult
 * @apiGroup Vote
 *
 * @apiParam {Number} electionId Election's unique Id
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     [
 *      {
 *        "votes": 2,
 *        "candidate": "Catherine ",
 *        "candidateId": 1,
 *        "percentage": "100 %"
 *      }
 *     ]
 *
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
                log.error(connectionError, "Database Connection Error (Function = VoteResult.Show)");
                json = {
                    error: "Vote Results failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT candidate.id AS candidateId, candidate.name AS candidate, COUNT(candidate_id) AS votes FROM election INNER JOIN candidate ON candidate.election_id = election.id RIGHT JOIN vote ON (vote.candidate_id = candidate.id) WHERE election.id = ? GROUP BY vote.candidate_id;', request.params.id, function(queryError, resultSet) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed fetch vote results. Vote Result details " + JSON.stringify(request.params.id) + "(Function = VoteResult.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    if (resultSet[0]) {
                        var votes = 0;
                        var voteObj = {}, result = [];
                        for(var j=0; j<resultSet.length; j++) {
                            votes += resultSet[j].votes;
                        }
                        for(var i=0; i<resultSet.length; i++) {
                            voteObj = {
                                votes: resultSet[i].votes,
                                candidate: resultSet[i].candidate,
                                candidateId: resultSet[i].candidateId,
                                percentage: (resultSet[i].votes * 100)/votes + " %"
                            };
                            result.push(voteObj);
                        }
                        log.info({Function: "VoteResult.Show"}, "Fetched Vote Results. Poll Id: " + request.params.id);
                        return response.status(200).json(result);
                    }
                    else {
                        json = {
                            message: "No votes for this election."
                        };
                        log.info({Function: "VoteResult.Show"}, "Requested Vote Results Not Found");
                        return response.status(404).json(json);
                    }
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = VoteResult.Show)");
        return response.status(500).json(json);
    }
};
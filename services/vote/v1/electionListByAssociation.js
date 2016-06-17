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
 * This file contains the logic for the list of elections by association service.
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
 * @api {get} /vote/v1/electionListByAssociation/:id Election List by Association
 * @apiVersion 0.1.0
 * @apiName ElectionListByAssociation
 * @apiGroup Vote
 *
 * @apiParam {String} id Association Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     [
 *          {
 *              "electionId": 2,
 *              "electionName": "Orgware",
 *              "endDate": "1/20/2016, 12:00:00 AM",
 *              "startDate": "1/18/2016, 12:00:00 AM",
 *              "isVoted": 1,
 *              "nominationEndDate": "1/16/2016, 12:00:00 AM",
 *              "associationName": "Orgware"
 *          },
 *          {
 *              "electionId": 4,
 *              "electionName": "Scrum master",
 *              "endDate": "1/30/2016, 12:00:00 AM",
 *              "startDate": "1/27/2016, 12:00:00 AM",
 *              "isVoted": 1,
 *              "nominationEndDate": "1/21/2016, 12:00:00 AM",
 *              "associationName": "Orgware"
 *          }
 *      ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse AssociationNotFoundError
 *
 */

exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = ElectionListByAssociation.Show)");
                json = {
                    error: "PollList.Create failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT election.id AS electionId, election.name AS electionName, created_date AS createdDate, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, vigilance_user_id AS vigilanceUserId, (SELECT name FROM user WHERE id = election.vigilance_user_id) AS vigilanceUser, association_id AS associationId, (SELECT name FROM association WHERE id = election.association_id) AS associationName, (SELECT COUNT(vote.id) FROM vote JOIN election ON election.id = vote.election_id WHERE election.id = electionId GROUP BY election.id) AS voteCount, (SELECT COUNT(id) FROM election_user_map WHERE association_id = ?) AS eligibleToVote  FROM election JOIN association ON association.id = election.association_id WHERE association.id = ? ORDER BY election.id DESC', [request.params.id, request.params.id], function (queryError, list) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionListByAssociation.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(list[0]) {
                    var electionList = [], electionObj = {};
                    for(var k=0; k<list.length; k++) {
                        if(list[k].voteCount == null) {
                            list[k].voteCount = 0;
                        }

                        (function() {
                            var kCopy = k;
                            connection.query('SELECT candidate.id AS candidateId, candidate.name AS candidate, COUNT(candidate_id) AS votes FROM election INNER JOIN candidate ON candidate.election_id = election.id RIGHT JOIN vote ON (vote.candidate_id = candidate.id) WHERE election.id = ? GROUP BY vote.candidate_id;', list[kCopy].electionId, function(queryError, resultSet) {
                                if (queryError != null) {
                                    log.error(queryError, "Query error. Failed fetch vote results. (Function = ElectionListByAssociation.Show)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                                else {
                                    if (resultSet[0]) {
                                        electionObj = {
                                            electionId: list[kCopy].electionId,
                                            electionName: list[kCopy].electionName,
                                            createdDate: list[kCopy].createdDate,
                                            startDate: list[kCopy].startDate,
                                            endDate: list[kCopy].endDate,
                                            nominationEndDate: list[kCopy].nominationEndDate,
                                            vigilanceUserId: list[kCopy].vigilanceUserId,
                                            vigilanceUser: list[kCopy].vigilanceUser,
                                            associationId: list[kCopy].associationId,
                                            associationName: list[kCopy].associationName,
                                            voteCount: list[kCopy].voteCount,
                                            eligibleToVote: list[kCopy].eligibleToVote,
                                            voteResult: []
                                        };
                                        var votes = 0;
                                        var voteObj = {}, result = [];
                                        for(var j=0; j<resultSet.length; j++) {
                                            votes += resultSet[j].votes;
                                        }
                                        for (var i=0; i<resultSet.length; i++) {
                                            voteObj = {
                                                votes: resultSet[i].votes,
                                                candidate: resultSet[i].candidate,
                                                candidateId: resultSet[i].candidateId,
                                                percentage: (resultSet[i].votes * 100)/votes + " %"
                                            };
                                            result.push(voteObj);
                                            electionObj.voteResult = result;
                                            electionList.push(electionObj);
                                            if(kCopy == list.length - 1) {
                                                log.info({Function: "ElectionListByAssociation.Show"}, "Details of elections for a given association");
                                                return response.status(200).json(electionList);
                                            }
                                        }
                                    }
                                    else {
                                        electionObj = {
                                            electionId: list[kCopy].electionId,
                                            electionName: list[kCopy].electionName,
                                            createdDate: list[kCopy].createdDate,
                                            startDate: list[kCopy].startDate,
                                            endDate: list[kCopy].endDate,
                                            nominationEndDate: list[kCopy].nominationEndDate,
                                            vigilanceUserId: list[kCopy].vigilanceUserId,
                                            vigilanceUser: list[kCopy].vigilanceUser,
                                            associationId: list[kCopy].associationId,
                                            associationName: list[kCopy].associationName,
                                            voteCount: list[kCopy].voteCount,
                                            eligibleToVote: list[kCopy].eligibleToVote,
                                            voteResult: []
                                        };
                                        electionList.push(electionObj);
                                        if(kCopy == list.length - 1) {
                                            log.info({Function: "ElectionListByAssociation.Show"}, "Details of elections for a given association");
                                            return response.status(200).json(electionList);
                                        }
                                    }
                                }
                            });
                        }());
                    }
                }
                else {
                    log.info({Function: "ElectionListByAssociation.Show"}, "Elections not found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = ElectionListByAssociation.Show)");
        return response.status(500).json(json);
    }
};

exports.options = function(request, response) {
    return response.sendStatus(200);
};
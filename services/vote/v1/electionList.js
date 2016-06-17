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
 * This file contains the logic for the list of elections service.
 *
 *************************************************************************/



var config = require('./../../../config');
var log = require('./../../../log');


/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
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
 * @api {post} /vote/v1/electionList List of elections for user
 * @apiVersion 0.1.0
 * @apiName CreateElectionList
 * @apiGroup Vote
 *
 * @apiParam {Integer} userId User's unique id.
 * @apiParam {Integer} lowerLimit lower bound of the range of election list.
 * @apiParam {Integer} upperLimit upper bound of the range of election list.
 * @apiParam {Integer} isVoted either 0, 1 or 2
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "userId": "1",
 *      "lowerLimit": 0,
 *      "upperLimit": 10,
 *      "isVoted": "2"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
 * @apiUse UserNotFoundError
 *
 */

//listing elections intended to the specific user
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId != null)  && (request.body.isVoted != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = ElectionList.Create)");
                    json = {
                        error: "PollList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if((request.body.upperLimit != null) && (request.body.lowerLimit != null)) {
                    if (request.body.isVoted == 2) {
                        connection.query('(SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 0 LIMIT ?, ?) UNION (SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 1 LIMIT ?, ?)', [request.body.userId, request.body.lowerLimit, request.body.upperLimit, request.body.userId, request.body.lowerLimit, request.body.upperLimit], function(queryError, list) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(list) {
                                var electionOBJ = {}, electionList = [];
                                for(i = 0; i < list.length; i++) {
                                    var startDate = list[i].startDate;
                                    var endDate = list[i].endDate;
                                    var nominationEndDate = list[i].nominationEndDate;

                                    electionOBJ = {
                                        electionId: list[i].electionId,
                                        electionName: list[i].electionName,
                                        startDate: startDate,
                                        endDate: endDate,
                                        nominationEndDate: nominationEndDate,
                                        associationName: list[i].associationName,
                                        isVoted: list[i].isVoted
                                    };
                                    electionList.push(electionOBJ);
                                }
                                log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                                return response.status(200).json(electionList);
                            }
                            else {
                                log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                                return response.sendStatus(404);
                            }
                        });
                    }
                    if(request.body.isVoted == 0 || request.body.isVoted == 1) {
                        connection.query('SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = ? LIMIT ?, ?', [request.body.userId, request.body.isVoted, request.body.lowerLimit, request.body.upperLimit], function(queryError, list) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(list) {
                                var electionOBJ = {}, electionList = [];
                                for(i = 0; i < list.length; i++) {
                                    var startDate = list[i].startDate;
                                    var endDate = list[i].endDate;
                                    var nominationEndDate = list[i].nominationEndDate;

                                    electionOBJ = {
                                        electionId: list[i].electionId,
                                        electionName: list[i].electionName,
                                        startDate: startDate,
                                        endDate: endDate,
                                        nominationEndDate: nominationEndDate,
                                        associationName: list[i].associationName,
                                        isVoted: list[i].isVoted
                                    };
                                    electionList.push(electionOBJ);
                                }
                                log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                                return response.status(200).json(electionList);
                            }
                            else {
                                log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                                return response.sendStatus(404);
                            }
                        });
                    }
                }
                else {
                    if (request.body.isVoted == 2) {
                        connection.query('(SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 0) UNION (SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 1)', [request.body.userId, request.body.userId], function(queryError, list) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(list) {
                                var electionOBJ = {}, electionList = [];
                                for(i = 0; i < list.length; i++) {
                                    var startDate = list[i].startDate;
                                    var endDate = list[i].endDate;
                                    var nominationEndDate = list[i].nominationEndDate;

                                    electionOBJ = {
                                        electionId: list[i].electionId,
                                        electionName: list[i].electionName,
                                        startDate: startDate,
                                        endDate: endDate,
                                        nominationEndDate: nominationEndDate,
                                        associationName: list[i].associationName,
                                        isVoted: list[i].isVoted
                                    };
                                    electionList.push(electionOBJ);
                                }
                                log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                                return response.status(200).json(electionList);
                            }
                            else {
                                log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                                return response.sendStatus(404);
                            }
                        });
                    }
                    if(request.body.isVoted == 0 || request.body.isVoted == 1) {
                        connection.query('SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = ?', [request.body.userId, request.body.isVoted], function(queryError, list) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(list) {
                                var electionOBJ = {}, electionList = [];
                                for(i = 0; i < list.length; i++) {
                                    var startDate = list[i].startDate;
                                    var endDate = list[i].endDate;
                                    var nominationEndDate = list[i].nominationEndDate;

                                    electionOBJ = {
                                        electionId: list[i].electionId,
                                        electionName: list[i].electionName,
                                        startDate: startDate,
                                        endDate: endDate,
                                        nominationEndDate: nominationEndDate,
                                        associationName: list[i].associationName,
                                        isVoted: list[i].isVoted
                                    };
                                    electionList.push(electionOBJ);
                                }
                                log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                                return response.status(200).json(electionList);
                            }
                            else {
                                log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                                return response.sendStatus(404);
                            }
                        });
                    }
                }

            });
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = ElectionList.Create)");
        return response.status(500).json(json);
    }
};


/**
 * @api {get} /vote/v1/electionList/:id Election List for the created user
 * @apiVersion 0.1.0
 * @apiName ElectionListForCreatedUser
 * @apiGroup Vote
 *
 * @apiParam {String} id User Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *        "vigilanceUserId": 3,
 *        "electionName": "Shuttle master",
 *        "nominationEndDate": "2016-04-15T18:30:00.000Z",
 *        "createdDate": "2016-04-13T08:44:25.000Z",
 *        "votesForThisElection": 0,
 *        "associationId": 2,
 *        "endDate": "2016-05-02T18:30:00.000Z",
 *        "noOfElections": 3,
 *        "electionId": 4,
 *        "vigilanceUser": "Cath",
 *        "associationName": "devs",
 *        "startDate": "2016-04-30T18:30:00.000Z"
 *      }
 *     ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */

exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function (connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = ElectionList.Show)");
                json = {
                    error: "PollList.Create failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT election.id AS electionId, election.name AS electionName, created_date AS createdDate, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, vigilance_user_id AS vigilanceUserId, (SELECT name FROM user WHERE id = election.vigilance_user_id) AS vigilanceUser, association_id AS associationId, (SELECT name FROM association WHERE id = election.association_id) AS associationName, (SELECT COUNT(election.id) FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ?) AS noOfElections, (SELECT COUNT(vote.id) FROM vote JOIN election ON election.id = vote.election_id WHERE election.id = electionId GROUP BY election.id) AS voteCount, (SELECT COUNT()) AS eligibleToVote FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ? ORDER BY election.id DESC', [request.params.id, request.params.id], function (queryError, list) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(list) {
                    for(var i=0; i<list.length; i++) {
                        if(list[i].voteCount == null) {
                            list[i].voteCount = 0;
                        }
                    }
                    log.info({Function: "ElectionList.Show"}, "Election List fetched");
                    return response.status(200).json(list);
                }
                else {
                    log.info({Function: "ElectionList.Show"}, "User Not Found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = ElectionList.Show)");
        return response.status(500).json(json);
    }
};

exports.options = function(request, response) {
    return response.sendStatus(200);
};
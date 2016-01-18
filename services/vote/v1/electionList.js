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

//listing elections intended to the specific user
exports.create = function(request, response) {
    var json;
    try {
        if((request.body.userId != null) && (request.body.upperLimit != null) && (request.body.lowerLimit != null) && (request.body.isVoted != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = ElectionList.Create)");
                    json = {
                        error: "PollList.Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if(request.body.isVoted == 2) {
                    connection.query('(SELECT election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndName, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 0 LIMIT ?, ?) UNION (SELECT election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndName, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = 1 LIMIT ?, ?)', [request.body.userId, request.body.lowerLimit, request.body.upperLimit, request.body.userId, request.body.lowerLimit, request.body.upperLimit], function(queryError, list) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(list) {
                            log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                            return response.status(200).json(list);
                        }
                        else {
                            log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                            return response.sendStatus(404);
                        }
                    });
                }
                if(request.body.isVoted == 0 || request.body.isVoted == 1) {
                    connection.query('SELECT election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndName, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND is_voted = ? LIMIT ?, ?', [request.body.userId, request.body.isVoted, request.body.lowerLimit, request.body.upperLimit], function(queryError, list) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to fetch election list. Details " + JSON.stringify(request.body.userId) + "(Function = ElectionList.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(list) {
                            log.info({Function: "ElectionList.Create"}, "Fetched Election List.");
                            return response.status(200).json(list);
                        }
                        else {
                            log.info({Function: "ElectionList.Create"}, "Requested UserId not found.");
                            return response.sendStatus(404);
                        }
                    });
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
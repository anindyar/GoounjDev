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


exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Poll.Result)");
                json = {
                    error: "Poll Results failed. Database could not be reached."
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
                        console.log(resultSet);
                        log.info({Function: "Poll.Result"}, "Fetched Poll Results. Poll Id: " + request.params.id);
                        return response.status(200).json(resultSet);
                    }
                    else {
                        log.info({Function: "Poll.Result"}, "Requested Poll Result Not Found");
                        return response.sendStatus(404);
                    }
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Result)");
        return response.status(500).json(json);
    }
}
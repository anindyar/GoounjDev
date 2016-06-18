/*************************************************************************
 *
 * COPYRIGHT NOTICE
 * __________________
 *
 * NodeServiceManager - v0.1.0
 *
 * Copyright (C) 2015, Kennet Jacob
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property
 * of Kennet Jacob. Unauthorised copying of this  file, via any medium is
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
 * This file contains the resource definitions for the election search
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
 * @api {post} /search/v1/searchElection Search Elections
 * @apiVersion 0.1.0
 * @apiName searchElection
 * @apiGroup Search
 *
 * @apiParam {Number} userId Audience User Id
 * @apiParam {String} searchString String to be searched for.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *           "userId": 4,
 *           "searchString": "bes"
 *      }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *     [
 *      {
 *        "electionId": 1,
 *        "electionName": "Shuttle master",
 *        "startDate": "2016-05-01T00:00:00.000Z",
 *        "endDate": "2016-05-03T00:00:00.000Z",
 *        "nominationEndDate": "2016-04-16T00:00:00.000Z",
 *        "associationName": "Orgware-Test",
 *        "isVoted": 1
 *      }
 *     ]
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */

exports.create = function(request, response){
    var json;
    try {
        if(request.body.searchString != null && request.body.userId != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = searchElection.create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                connection.query('SELECT election.id AS electionId, election.name AS electionName, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, association.name AS associationName, is_voted AS isVoted FROM election_user_map INNER JOIN election ON election_id = election.id INNER JOIN association ON association.id = election.association_id WHERE user_id = ? AND election.name LIKE ?', [request.body.userId, '%' + request.body.searchString + '%'], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch survey list. Details " + JSON.stringify(request.body.userId) + "(Function = searchElection.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(result) {
                        log.info({Function: "searchElection.Create"}, "Search results fetched");
                        return response.status(200).json(result);
                    }
                    else {
                        log.info({Function: "searchElection.Create"}, "Requested String not found.");
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
        log.error(error, "Exception Occurred (Function = searchElection.Create)");
        return response.status(500).json(json);
    }
};
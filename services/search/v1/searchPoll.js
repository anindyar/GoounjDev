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
 * This file contains the resource definitions for the poll search
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');

exports.create = function(request, response){
    var json;
    try {
        if(request.body.searchString != null && request.body.userId != null) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = searchPoll.create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                connection.query('CREATE OR REPLACE VIEW search AS (SELECT DISTINCT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, is_answered AS isAnswered, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, created_user_id AS createdUserId, name AS createdUserName  FROM audience_poll_map INNER JOIN poll ON audience_poll_map.poll_id = poll.id INNER JOIN user ON poll.created_user_id = user.id  WHERE  audience_poll_map.user_id = ?) UNION (SELECT DISTINCT poll.id AS pollId, start_date AS startDate, end_date AS endDate, poll_name AS pollName, 0 AS isAnswered, is_survey AS isSurvey, is_boost AS isBoost, poll.is_active AS isActive, is_generic AS isGeneric, created_user_id AS createdUserId, name AS createdUserName FROM user INNER JOIN poll ON poll.created_user_id = user.id WHERE poll.created_user_id = ?); SELECT * FROM search WHERE endDate > ? AND isSurvey = 0 AND pollName LIKE ? ORDER BY pollId DESC;', [request.body.userId, request.body.userId, utcTimeStamp, '%' + request.body.searchString + '%'], function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to fetch survey list. Details " + JSON.stringify(request.body.userId) + "(Function = searchPoll.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(result[1]) {
                        log.info({Function: "searchPoll.Create"}, "Search results fetched");
                        return response.status(200).json(result[1]);
                    }
                    else {
                        log.info({Function: "searchPoll.Create"}, "Requested String not found.");
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
        log.error(error, "Exception Occurred (Function = searchPoll.Create)");
        return response.status(500).json(json);
    }
};
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

exports.create = function(request, response) {
    var json;
    try {
        if((request.body.electionName != null) && (request.body.createdDate != null) && (request.body.startDate != null) && (request.body.endDate != null) && (request.body.vigilenceUserId != null) && (request.body.nominationEndDate != null) && (request.body.associationId != null)) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Election.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('INSERT INTO '+ config.mysql.db.name +'.election (name, created_date, start_date, end_date, nomination_end_date, vigilence_user_id, association_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [request.body.electionName, request.body.createdDate, request.body.startDate, request.body.endDate, request.body.nominationEndDate, request.body.vigilenceUserId, request.body.associaionId], function(queryError, entry) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to create an election. (Function = Election.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(entry) {
                        var electionID = entry.insertId;
                        json = {
                            ElectionID : electionID
                        };
                        log.info({Function: "Election.Create"}, "Election creation successful.");
                        return response.status(200).json(json);
                    }
                });
            });
        }
        else {
            json ={
                error: "Parameters are required."
            };
            log.error({Function: "Vote.Create"}, "Parameter(s) are empty.");
            return response.status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Election.Create)");
        return response.status(500).json(json);
    }
};
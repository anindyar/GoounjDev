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
var moment = require('moment');


exports.election = function(request, connection, response) {
    connection.query('SELECT id, name, created_date AS createdDate, vigilance_user_id AS vigilanceUserId, nomination_end_date AS nominationEndDate, start_date AS startDate, end_date AS endDate, association_id AS associationId, (SELECT name FROM '+ config.mysql.db.name +'.association WHERE id = election.association_id) AS associationName FROM '+ config.mysql.db.name +'.election WHERE id = ?', request.params.id, function(queryError, election) {
        if (queryError != null) {
            log.error(queryError, "Query error. Failed to fetch election details. (Function = Election.Show)");
            json = {
                error: "Requested action failed. Database could not be reached."
            };
            return response.status(500).json(json);
        }
        if(election.length) {
            var electionObj = {
                electionId: election[0].id,
                electionName: election[0].name,
                createdDate: election[0].createdDate,
                vigilanceUserId: election[0].vigilanceUserId,
                nominationEndDate: election[0].nominationEndDate,
                startDate: election[0].startDate,
                endDate: election[0].endDate,
                associationId: election[0].associationId,
                associationName: election[0].associationName,
                members: []
            };
            connection.query('SELECT name FROM election_user_map INNER JOIN user ON user_id = user.id WHERE election_id = ?', request.params.id, function(queryError, member) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To fetch election details. Election ID: " + request.params.id + " (Function = Election.Show)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(member) {
                    for(var i=0; i<member.length; i++) {
                        electionObj.members.push(member[i].name);
                    }
                    log.info({Function: "Election.Show"}, "Fetched Election Details. Election ID: " + request.params.id);
                    return response.status(200).json(electionObj);
                }
            });
        }
        else {
            log.info({Function: "Election.Show"}, "Requested election not found");
            return response.sendStatus(404);
        }
    });
};
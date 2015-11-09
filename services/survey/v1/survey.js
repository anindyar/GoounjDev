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
 * This file contains the logic for the survey service.
 *
 *************************************************************************/
var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');


exports.create = function(request, response) {
  var json;
    try{
        if((request.body.questionList !== null) && (request.body.name != null) && (request.body.phone != null) && (request.body.pollId != null)){
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = Poll.Answer)");
                    json = {
                        error: "Poll Delete failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                connection.query('SET @userId = 0; CALL setAudienceForSurvey(?, ?, ?, @userId); SELECT @userId AS userId;', [request.body.phone, request.body.pollId, utcTimeStamp], function (queryError, user) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to update audience. User details " + JSON.stringify(request.body.phone) + "(Function= Poll Create)");
                        jsn = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(user) {
                        var questionAnswer = request.body.questionList;
                        for(var i=0; i<questionAnswer.length; i++) {
                            connection.query('INSERT INTO ' + config.mysql.db.name + '.answer (time, question_id, question_options_id, user_id) VALUES (?, ?, ?, ?)', [utcTimeStamp, questionAnswer[i].questionId, questionAnswer[i].optionId, user.userId], function (queryError, result) {
                                if (queryError != null) {
                                    log.error(queryError, "Query error. Failed to record a new answer. Answer details " + JSON.stringify(request.body.pollId) + "(Function = Poll.Answer)");
                                    json = {
                                        error: "Requested action failed. Database could not be reached."
                                    };
                                    return response.status(500).json(json);
                                }
                                else {
                                    log.info({Function: "Poll.Answer"}, "New answer has been recorded successfully.");
                                }
                            });
                        }
                        return response.sendStatus(200);
                    }
                    else {
                        log.info({Function: "Poll.Answer"}, "Requested Poll Not Found");
                        return response.sendStatus(404);
                    }
                });
            });
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Poll.Create)");
        return response.status(500).json(json);
    }
};
/**
 * Created by catherinesamuel on 18/05/16.
 */

var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');

exports.show = function(request, response){
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Dashboard.Show)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            else {
                var polls = [], surveys = [];
                connection.query('SELECT * FROM user WHERE id = ?', request.params.id, function(queryError, user) {
                    if (queryError != null) {
                        log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(user[0]) {
                        var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD');

                        connection.query('(SELECT id AS pollId, poll_name AS pollName, start_date AS startDate, end_date AS endDate, (SELECT COUNT(user_id) FROM answer WHERE poll_id = poll.id) AS totalAnswers, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 0) AS total, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 0 AND poll.end_date >= ?) AS open, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 0 AND poll.end_date < ?) AS closed, is_survey AS isSurvey FROM poll WHERE is_survey = 0 AND poll.created_user_id = ? ORDER BY poll.id DESC LIMIT 5) UNION (SELECT id AS surveyId, poll_name AS surveyName, start_date AS startDate, end_date AS endDate, (SELECT COUNT(user_id) FROM answer WHERE poll_id = poll.id) AS totalAnswers, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 1) AS total, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 1 AND poll.end_date >= ?) AS open, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 1 AND poll.end_date < ?) AS closed, is_survey AS isSurvey FROM poll WHERE is_survey = 1 AND poll.created_user_id = ? ORDER BY poll.id DESC LIMIT 5);', [request.params.id, request.params.id, utcTimeStamp, request.params.id, utcTimeStamp, request.params.id, request.params.id, request.params.id, utcTimeStamp, request.params.id, utcTimeStamp, request.params.id], function(queryError, pollAndSurvey) {
                            if (queryError != null) {
                                log.error(queryError, "Database Query Error (Function = Dashboard.Show)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                if(pollAndSurvey) {
                                    if(pollAndSurvey[0]){
                                        for(var i=0; i<pollAndSurvey.length; i++){
                                            if(pollAndSurvey[i].isSurvey == 0) {
                                                polls.push(pollAndSurvey[i]);
                                            }
                                            else if(pollAndSurvey[i].isSurvey == 1) {
                                                surveys.push(pollAndSurvey[i]);
                                            }
                                        }
                                    }

                                    connection.query('SELECT election.id AS electionId, election.name AS electionName, created_date AS createdDate, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, vigilance_user_id AS vigilanceUserId, (SELECT name FROM user WHERE id = election.vigilance_user_id) AS vigilanceUser, association_id AS associationId, (SELECT name FROM association WHERE id = election.association_id) AS associationName, (SELECT COUNT(election.id) FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ?) AS total, (SELECT COUNT(election.id) FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ? AND election.start_date <= ? AND election.end_date >= ?) AS open, (SELECT COUNT(election.id) FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ? AND election.end_date < ?) AS closed  FROM election JOIN association ON association.id = election.association_id WHERE association.admin_id = ? ORDER BY election.id DESC LIMIT 5', [request.params.id, request.params.id, utcTimeStamp, utcTimeStamp, request.params.id, utcTimeStamp, request.params.id], function(queryError, elections) {
                                        if (queryError != null) {
                                            log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else if(elections) {
                                            json = {
                                                polls: polls,
                                                surveys: surveys,
                                                elections: elections
                                            };
                                            log.info({Function: "Dashboard.Show"}, "Dashboard items fetched");
                                            return response.status(200).json(json);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else {
                        log.info({Function: "Dashboard.Show"}, "User Not Found");
                        return response.sendStatus(404);
                    }
                });
            }
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Dashboard.Show)");
        return response.status(500).json(json);
    }
};

exports.options = function(request, response) {
    return response.sendStatus(200);
};
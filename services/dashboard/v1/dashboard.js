/**
 * Created by catherinesamuel on 18/05/16.
 */

var config = require('./../../../config');
var log = require('./../../../log');

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
                var polls = [], surveys = [], elections = [];
                var totalElections;
                connection.query('SELECT * FROM user WHERE id = ?', request.params.id, function(queryError, user) {
                    if (queryError != null) {
                        log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(user[0]) {
                        connection.query('(SELECT id AS pollId, poll_name AS pollName, start_date AS startDate, end_date AS endDate, (SELECT COUNT(user_id) FROM answer WHERE poll_id = poll.id) AS totalAnswers, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 0) AS totalPolls, is_survey AS isSurvey FROM poll WHERE is_survey = 0 AND poll.created_user_id = ? ORDER BY poll.id DESC LIMIT 5) UNION (SELECT id AS pollId, poll_name AS pollName, start_date AS startDate, end_date AS endDate, (SELECT COUNT(user_id) FROM answer WHERE poll_id = poll.id) AS totalAnswers, (SELECT COUNT(id) FROM poll WHERE created_user_id = ? AND is_survey = 1) AS totalSurveys, is_survey AS isSurvey FROM poll WHERE is_survey = 1 AND poll.created_user_id = ? ORDER BY poll.id DESC LIMIT 5);', [request.params.id, request.params.id, request.params.id, request.params.id], function(queryError, pollAndSurvey) {
                            if (queryError != null) {
                                log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
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

                                    connection.query('SELECT id FROM association WHERE admin_id = ?', [request.params.id], function(queryError, associations) {
                                        if (queryError != null) {
                                            log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        if(associations[0]) {
                                            for(var j=0; j<associations.length; j++) {
                                                (function() {
                                                    var jCopy = j;
                                                    connection.query('SELECT id AS electionId, name AS electionName, created_date AS createdDate, start_date AS startDate, end_date AS endDate, nomination_end_date AS nominationEndDate, vigilance_user_id AS vigilanceUserId, (SELECT name FROM user WHERE id = election.vigilance_user_id) AS vigilanceUser, association_id AS associationId, (SELECT name FROM association WHERE id = election.association_id) AS associationName, (SELECT COUNT(id) FROM election WHERE association_id = ?) AS noOfElections FROM election WHERE association_id = ?', [associations[jCopy].id, associations[jCopy].id], function(queryError, election) {
                                                        if (queryError != null) {
                                                            log.error(queryError, "Database Connection Error (Function = Dashboard.Show)");
                                                            json = {
                                                                error: "Requested action failed. Database could not be reached."
                                                            };
                                                            return response.status(500).json(json);
                                                        }
                                                        else if(election) {
                                                            if(election[0]) {
                                                                for(var k=0; k<election.length; k++) {
                                                                    elections.push(election[k]);
                                                                    totalElections =+ election[k].noOfElections
                                                                }
                                                            }
                                                            if(jCopy == associations.length - 1) {
                                                                json = {
                                                                    polls: polls,
                                                                    surveys: surveys,
                                                                    elections: elections,
                                                                    totalElections: totalElections
                                                                };
                                                                log.info({Function: "Dashboard.Show"}, "Dashboard items fetched");
                                                                return response.status(200).json(json);
                                                            }
                                                        }
                                                    });
                                                }());
                                            }
                                        }
                                        else {
                                            json = {
                                                polls: polls,
                                                surveys: surveys,
                                                elections: elections,
                                                totalElections: totalElections
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
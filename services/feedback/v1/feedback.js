var config = require('./../../../config');
var log = require('./../../../log');
var moment = require('moment');


exports.create = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Feedback.Create)");
                json = {
                    error: "Poll Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT id FROM '+ config.mysql.db.name +'.user WHERE phone = ? AND email = ?', [request.body.phone, request.body.email], function(queryError, user){
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Feedback.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if (user.id == request.body.userId) {
                    connection.query('INSERT INTO '+ config.mysql.db.name +'.feedback (comments, feedback_type_id, modules_id, user_id, email, phone) VALUES (?, (SELECT id FROM '+ config.mysql.db.name +'.feedback_type WHERE name = ?), (SELECT id FROM '+ config.mysql.db.name +'.modules WHERE name = ?), ?, ?, ?)', [request.body.comments, request.body.feedbackType, request.body.modules, request.body.userId, request.body.email, request.body.phone], function(queryError, feedback) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Feedback.Create)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else {
                            var feedbackID = feedback.insertId;
                            json = {
                                feedbackId : feedbackID
                            };
                            log.info({Function: "Feedback.Create"}, "Feedback inserted");
                            return response.status(200).json(json);
                        }
                    });
                }
                else{
                    json = {
                        error: "The userID doesn't match to the given email and phone."
                    };
                }
            });
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Feedback.Create)");
        return response.status(500).json(json);
    }
};
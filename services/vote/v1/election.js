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

exports.create = function(request, response) {
    var json;
    try {
        if((request.body.electionName != null) && (request.body.startDate != null) && (request.body.endDate != null) && (request.body.vigilanceUserName != null) && (request.body.nominationEndDate != null) && (request.body.associationId != null) && (request.body.adminUserId != null) && (request.body.members != null)) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Election.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                var utcTimeStamp =  moment(new Date()).format('YYYY/MM/DD HH:mm:ss');

                var startDate =  moment(request.body.startDate).format('YYYY/MM/DD HH:mm:ss');
                var endDate =  moment(request.body.endDate).format('YYYY/MM/DD HH:mm:ss');
                var nominationEndDate =  moment(request.body.nominationEndDate).format('YYYY/MM/DD HH:mm:ss');

                connection.query('INSERT INTO '+ config.mysql.db.name +'.election (name, created_date, start_date, end_date, nomination_end_date, vigilance_user_id, association_id) VALUES (?, ?, ?, ?, ?, (SELECT id FROM user WHERE name = ?), ?)', [request.body.electionName, utcTimeStamp, startDate, endDate, nominationEndDate, request.body.vigilanceUserName, request.body.associationId], function(queryError, entry) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to create an election. (Function = Election.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    else if(entry) {
                        var electionID = entry.insertId;
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.election_user_map (election_id, association_id, user_id) VALUES (?, ?, ?)', [electionID, request.body.associationId, request.body.adminUserId], function(queryError, mapping) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to create an election. (Function = Election.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(mapping) {
                                var memberList = request.body.members;
                                for(i = 0; i < memberList.length; i++){
                                    connection.query('INSERT INTO '+ config.mysql.db.name +'.election_user_map (election_id, association_id, user_id) VALUES (?, ?, (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?))', [electionID, request.body.associationId, memberList[i]], function(queryError, check) {
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to create an election. (Function = Election.Create)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                    });
                                }
                                json = {
                                    ElectionID : electionID
                                };
                                log.info({Function: "Election.Create"}, "Election creation successful.");
                                return response.status(200).json(json);
                            }
                        });
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters are required."
            };
            log.error({Function: "Election.Create"}, "Parameter(s) are empty.");
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


exports.update = function(request, response) {
    var json;
    try {
        if((request.body.electionName != null) || (request.body.startDate != null) || (request.body.endDate != null) || (request.body.vigilenceUserFirstName != null) || (request.body.vigilenceUserLastName != null) || (request.body.nominationEndDate != null)) {
            request.getConnection(function(connectionError, connection) {
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Election.Update)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }

                connection.query('SELECT * FROM '+ config.mysql.db.name +'.election WHERE id = ?', request.params.id, function(queryError, check) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. Failed to update an election. (Function = Election.Update)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(check) {

                        var dat = moment('Jan 10 2016').format('YYYY/MM/DD HH:mm:ss');
                        console.log(dat);

                        var jsonData = {};
                        if(request.body.electionName != null) {
                            jsonData['name'] = request.body.electionName;
                        }
                        if(request.body.startDate != null) {
                            jsonData['start_date'] = moment(request.body.startDate).format('YYYY/MM/DD HH:mm:ss');
                        }
                        if(request.body.endDate != null) {
                            jsonData['end_date'] = moment(request.endDate).format('YYYY/MM/DD HH:mm:ss');
                        }
                        if(request.body.vigilanceUserName != null) {
                            jsonData['vigilance_user_id'] = request.body.vigilanceUserName;
                        }
                        if(request.body.nominationEndDate != null) {
                            jsonData['nomination_end_date'] = moment(request.body.nominationEndDate).format('YYYY/MM/DD HH:mm:ss');;
                        }

                        connection.query('UPDATE '+ config.mysql.db.name +'.election SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, item) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. Failed to update an election. (Function = Election.Update)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(item) {
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.election WHERE id = ?', request.params.id, function(queryError, give) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query error. Failed to create an election. (Function = Election.Update)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    log.info({Function: "Election.Update"}, "Nothing to update.");
                                    return response.status(200).json(give[0]);
                                });
                            }
                        });
                    }
                    else {
                        log.info({Function: "Election.Update"}, "Requested election not found");
                        return response.sendStatus(404);
                    }
                });
            });
        }
        else {
            log.info({Function: "Election.Update"}, "Nothing to update.");
            return response.sendStatus(400);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Election.Update)");
        return response.status(500).json(json);
    }
};


exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Election.Show)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM '+ config.mysql.db.name +'.election WHERE id = ?', request.params.id, function(queryError, election) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch election details. (Function = Election.Show)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                if(election) {
                    log.info({Function: "Election.Show"}, "Fetched Election details.");
                    return response.status(200).json(election[0]);
                }
                else {
                    log.info({Function: "Election.Show"}, "Requested election not found");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Election.Show)");
        return response.status(500).json(json);
    }
};


exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Election.Delete)");
                json = {
                    error: "Requested action failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('DELETE FROM '+ config.mysql.db.name +'.election_user_map WHERE election_id = ?', request.params.id, function(queryError, remove) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch election details. (Function = Election.Delete)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(remove.affectedRows != 0) {
                    connection.query('DELETE FROM '+ config.mysql.db.name +'.election WHERE id = ?', request.params.id, function(queryError, del) {
                        if (queryError != null) {
                            log.error(queryError, "Query error. Failed to fetch election details. (Function = Election.Delete)");
                            json = {
                                error: "Requested action failed. Database could not be reached."
                            };
                            return response.status(500).json(json);
                        }
                        else if(del.affectedRows != 0) {
                            log.info({Function: "Election.Delete"}, "Election Deleted Successfully. Election ID: " + request.params.id);
                            return response.sendStatus(200);
                        }
                    });
                }
                else {
                    log.info({Function: "Election.Delete"}, "Requested Election Not Found. Election ID: " + request.params.id );
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Election.Delete)");
        return response.status(500).json(json);
    }
};
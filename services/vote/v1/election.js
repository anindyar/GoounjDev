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
var util = require('./util');



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
 * @api {post} /vote/v1/election Create Election
 * @apiVersion 0.1.0
 * @apiName CreateElection
 * @apiGroup Vote
 *
 * @apiParam {String} electionName Name of the election.
 * @apiParam {String} startDate Start date of election.
 * @apiParam {String} endDate End date of election.
 * @apiParam {String} vigilanceUserName Name of the vigilance user.
 * @apiParam {String} nominationEndDate End date for nominations.
 * @apiParam {String} associationId Association's id.
 * @apiParam {String} associationAdminId Admin user's id.
 * @apiParam {String} members list of members of the association who can vote for the election.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "electionName": "Orgware",
 *         "startDate": "Jan 18 2016",
 *         "endDate": "Jan 20 2016",
 *         "vigilanceUserName": "Kennet",
 *         "nominationEndDate": "Jan 16 2016",
 *         "associationId": "1",
 *         "associationAdminId": "1",
 *         "members": [
 *            "Catherine", "Victoria"
 *         ]
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "electionId": 3
 *      }
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if((request.body.electionName != null) && (request.body.startDate != null) && (request.body.endDate != null) && (request.body.vigilanceUserName != null) && (request.body.nominationEndDate != null) && (request.body.associationId != null) && (request.body.associationAdminId != null) && (request.body.members != null)) {
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
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.election_user_map (election_id, association_id, user_id) VALUES (?, ?, ?)', [electionID, request.body.associationId, request.body.associationAdminId], function(queryError, mapping) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to create an election. (Function = Election.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(mapping) {
                                var memberList = request.body.members;
                                for(var i = 0; i < memberList.length; i++){
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
                                    electionId : electionID
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


/**
 * @api {put} /vote/v1/election/:id Update Election
 * @apiVersion 0.1.0
 * @apiName UpdateElection
 * @apiGroup Vote
 *
 * @apiParam {String} id Election Id.
 *
 * @apiParam {String} electionName Name of the election.
 * @apiParam {String} startDate Start date of election.
 * @apiParam {String} endDate End date of election.
 * @apiParam {String} vigilanceUserName Name of the vigilance user.
 * @apiParam {String} nominationEndDate End date for nominations.
 * @apiParam {String} members list of members of the association who can vote for the election.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "electionName": "Orgware HR"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "created_date": "2016-02-10T06:41:25.000Z",
 *       "vigilance_user_id": 4,
 *       "id": 3,
 *       "nomination_end_date": "2016-01-15T18:30:00.000Z",
 *       "start_date": "2016-01-17T18:30:00.000Z",
 *       "end_date": "2016-01-19T18:30:00.000Z",
 *       "name": "Orgware HR",
 *       "association_id": 1
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 */

exports.update = function(request, response) {
    var json;
    try {
        if((request.body.electionName != null) || (request.body.startDate != null) || (request.body.endDate != null) || (request.body.vigilanceUserName != null) || (request.body.nominationEndDate != null)) {
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
                            jsonData['nomination_end_date'] = moment(request.body.nominationEndDate).format('YYYY/MM/DD HH:mm:ss');
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
                                log.info({Function: "Election.Update"}, "Election update successful. Election ID: " + request.params.id);
                                util.election(request, connection, response);
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
        else if(request.body.members != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Election.Update)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var memberList = request.body.members;
                var count = 0;
                for(var i = 0; i < memberList.length; i++){
                    (function () {
                        var iCopy = i;
                        connection.query('SELECT * FROM '+ config.mysql.db.name +'.election_user_map WHERE election_id = ? AND user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?)', [request.params.id, memberList[iCopy]], function(queryError, check) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to create an election. (Function = Election.Update)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else if(check.length != 0) {
                                log.info({Function: "Election.Update"}, memberList[iCopy] + " is already eligible");

                                if(iCopy == memberList.length - 1 && count == 0) {
                                    log.info({Function: "Election.Update"}, "No new members.");
                                    log.info({Function: "Election.Update"}, "Election update successful. Election ID: " + request.params.id);
                                    util.election(request, connection, response);
                                }
                            }
                            else if(check.length == 0) {
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.association_user_map WHERE association_id = (SELECT association_id FROM '+ config.mysql.db.name +'.election WHERE id = ?) AND user_id = (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?)', [request.params.id, memberList[iCopy]], function(queryError, memberCheck) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query error. Failed to update an election. (Function = Election.Update)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    else if(memberCheck.length != 0) {
                                        console.log(memberCheck);
                                        connection.query('INSERT INTO '+ config.mysql.db.name +'.election_user_map (election_id, association_id, user_id) VALUES (?, (SELECT association_id FROM '+ config.mysql.db.name +'.election WHERE id = ?), (SELECT id FROM '+ config.mysql.db.name +'.user WHERE name = ?))', [request.params.id, request.params.id, memberList[iCopy]], function(queryError, check) {
                                            if (queryError != null) {
                                                log.error(queryError, "Query error. Failed to update an election. (Function = Election.Update)");
                                                json = {
                                                    error: "Requested action failed. Database could not be reached."
                                                };
                                                return response.status(500).json(json);
                                            }
                                            else {
                                                log.info({Function: "Election.Update"}, "adding voting members..");
                                                count++;
                                                if(iCopy == memberList.length - 1) {
                                                    log.info({Function: "Election.Update"}, count + " members added.");
                                                    log.info({Function: "Election.Update"}, "Election update successful. Election ID: " + request.params.id);
                                                    util.election(request, connection, response);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        json = {
                                            error: memberList[iCopy] + " is not an association member."
                                        };
                                        log.info({Function: "Election.Update"}, memberList[iCopy] + " is not an association member. " + count + " members added.");
                                        return response.status(400).json(json);
                                    }
                                });
                            }
                        });
                    }());
                }
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


/**
 * @api {get} /vote/v1/election/:id Show Election
 * @apiVersion 0.1.0
 * @apiName ShowElection
 * @apiGroup Vote
 *
 * @apiParam {String} id Election Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "created_date": "2016-02-10T06:41:25.000Z",
 *       "vigilance_user_id": 4,
 *       "id": 3,
 *       "nomination_end_date": "2016-01-15T18:30:00.000Z",
 *       "start_date": "2016-01-17T18:30:00.000Z",
 *       "end_date": "2016-01-19T18:30:00.000Z",
 *       "name": "Orgware HR",
 *       "association_id": 1
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 */

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
            util.election(request, connection, response);
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


/**
 * @api {delete} /vote/v1/election/:id Delete Election
 * @apiVersion 0.1.0
 * @apiName DeleteElection
 * @apiGroup Vote
 *
 * @apiParam {String} id Election Id.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 * @apiUse ElectionNotFoundError
 *
 */

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
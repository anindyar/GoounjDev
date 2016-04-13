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


/**
 * @apiDefine CandidateNotFoundError
 *
 * @apiError CandidateNotFound The requested candidate was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 */

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
 * @api {post} /vote/v1/candidate Create Candidate
 * @apiVersion 0.1.0
 * @apiName CreateCandidate
 * @apiGroup Vote
 *
 * @apiParam {String} userId Candidate's userId.
 * @apiParam {String} electionId Election Id.
 * @apiParam {String} userName Candidate's prefered user name.
 * @apiParam {String} nickName Candidate's nick name.
 * @apiParam {String} about Candidate's detail.
 * @apiParam {String} manifesto Candidate's manifesto.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "userId": "2",
 *         "electionId": "1",
 *         "userName": "Catherine",
 *         "nickName": "Kate",
 *         "about": "JS developer",
 *         "manifesto": "I will blah blah blah"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "candidateId": 3
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
        if((request.body.userId != null) && (request.body.electionId != null) && (request.body.userName != null) && (request.body.nickName != null) && (request.body.about != null) && (request.body.manifesto != null)) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Candidate.Create");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT is_active FROM '+ config.mysql.db.name +'.candidate  WHERE user_id = ? AND election_id = ?', [request.body.userId, request.body.electionId], function(queryError, candidates) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Candidate.Create)");
                        json  = {
                            error: "Requested Action Failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(candidates.length != 0) {
                        if(candidates[0].is_active == 1) {
                            json = {
                                message: "This user is already a candidate."
                            };
                            log.info({Function: "Candidate.Create"}, "User is already a candidate.");
                            return response.status(501).json(json);
                        }
                        else if(candidates[0].is_active == 0) {
                            json = {
                                message: "This user has already filed a nomination and is being scrutinized."
                            };
                            log.info({Function: "Candidate.Create"}, "User under scrutiny.");
                            return response.status(501).json(json);
                        }
                    }
                    else if(candidates.length == 0) {
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.candidate (user_id, election_id, name, nick_name, about, manifesto, is_active) VALUES (?, ?, ?, ?, ?, ?, "1")', [request.body.userId, request.body.electionId, request.body.userName, request.body.nickName, request.body.about, request.body.manifesto], function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Candidate.Create)");
                                json  = {
                                    error: "Requested Action Failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                var candidateId = entry.insertId;
                                json = {
                                    candidateId : candidateId
                                };
                                log.info({Function: "Candidate.Create"}, "Nomination filed successfully and awaits approval.");
                                return response.status(200).json(json);
                            }
                        });
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters - userID,electionId,userName,nickName,about,manifesto  should not be empty!"
            };
            log.error({Function: "Candidate.Create"}, "Parameters are empty.");
            return status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Association.Create)");
        return response.status(500).json(json);
    }
};


/**
 * @api {put} /vote/v1/candidate/:id Update Candidate
 * @apiVersion 0.1.0
 * @apiName UpdateCandidate
 * @apiGroup Vote
 *
 * @apiParam {String} id Candidate's userId.
 *
 * @apiParam {String} userName Candidate's prefered user name.
 * @apiParam {String} nickName Candidate's nick name.
 * @apiParam {String} about Candidate's detail.
 * @apiParam {String} manifesto Candidate's manifesto.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "electionId": 1,
 *         "nickName": "Katie"
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "nick_name": "Kate",
 *       "manifesto": "I will blah blah blah",
 *       "id": 1,
 *       "is_accepted": 0,
 *       "election_id": 1,
 *       "user_id": 2,
 *       "about": "JS developer",
 *       "name": "Katie"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse CandidateNotFoundError
 *
 */

exports.update = function(request, response) {
    var json;
    try{
        if(request.body.electionId != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Candidate.Create");
                    json = {
                        error: "Association Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', [request.params.id, request.body.electionId], function(queryError, result) {
                    if(queryError != null) {
                        log.error(queryError, "Query error. (Function: Candidate.Create)");
                        json  = {
                            error: "Requested Action Failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if(result[0]) {
                        var jsonData= {};
                        if(request.body.userName != null) {
                            jsonData['name'] = request.body.userName
                        }
                        if(request.body.nickName != null) {
                            jsonData['name'] = request.body.nickName
                        }
                        if(request.body.about != null) {
                            jsonData['name'] = request.body.about
                        }
                        if(request.body.manifesto != null) {
                            jsonData['name'] = request.body.manifesto
                        }

                        connection.query('UPDATE '+ config.mysql.db.name +'.candidate SET ? WHERE id = ?', [jsonData, request.params.id], function(queryError, entry) {
                            if(queryError != null) {
                                log.error(queryError, "Query error. (Function: Candidate.Update)");
                                json  = {
                                    error: "Requested Action Failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, detail) {
                                    if(queryError != null) {
                                        log.error(queryError, "Query error. (Function: Candidate.Update)");
                                        json  = {
                                            error: "Requested Action Failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                    log.info({Function: "Candidate.Update"}, "Candidate details updated.");
                                    return response.status(200).json(detail[0]);
                                });
                            }
                        });
                    }
                    else {
                        log.info({Function: "Candidate.Update"}, "Candidate not found. Candidate ID: " + request.body.electionId);
                        return response.status(404).json(json);
                    }
                });
            });
        }
        else {
            json = {
                error: "Parameters - electionId & userName/nickName/about/manifesto  are required!"
            };
            log.error({Function: "Candidate.Update"}, "Parameters required.");
            return response.status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Association.Update)");
        return response.status(500).json(json);
    }
};



/**
 * @api {get} /vote/v1/candidate/:id Show Candidate
 * @apiVersion 0.1.0
 * @apiName ShowCandidate
 * @apiGroup Vote
 *
 * @apiParam {String} id Candidate's userId.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "nick_name": "Kate",
 *       "manifesto": "I will blah blah blah",
 *       "id": 1,
 *       "is_accepted": 0,
 *       "election_id": 1,
 *       "user_id": 2,
 *       "about": "JS developer",
 *       "name": "Katie"
 *     }
 *
 * @apiUse DatabaseError
 *
 * @apiUse CandidateNotFoundError
 *
 */

exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Candidate.Show");
                json = {
                    error: "Requested Action Failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT * FROM '+ config.mysql.db.name +'.candidate WHERE id = ?', request.params.id, function(queryError, nominee) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: Candidate.Show)");
                    json  = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(nominee[0]) {
                    log.info({Function: "Candidate.Show"}, "Fetched Candidate Details.");
                    return response.status(200).json(nominee[0]);
                }
                else{
                    log.info({Function: "Candidate.Show"}, "Candidate not found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Candidate.Show)");
        return response.status(500).json(json);
    }
};



/**
 * @api {delete} /vote/v1/candidate/:id Delete Candidate
 * @apiVersion 0.1.0
 * @apiName DeleteCandidate
 * @apiGroup Vote
 *
 * @apiParam {String} id Candidate's userId.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse CandidateNotFoundError
 *
 */

exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database connection error (Function = Candidate.Delete");
                json = {
                    error: "Requested Action Failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('UPDATE '+ config.mysql.db.name +'.candidate SET is_active = 0 WHERE id = ?', request.params.id, function(queryError, nominee) {
                if(queryError != null) {
                    log.error(queryError, "Query error. (Function: Candidate.Delete)");
                    json  = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else if(nominee.affectedRows != 0) {
                    log.info({Function: "Candidate.Show"}, "Candidate Deleted.");
                    return response.sendStatus(200);
                }
                else {
                    log.info({Function: "Candidate.Show"}, "Candidate Not Found.");
                    return response.sendStatus(404);
                }
            });
        });
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: Candidate.Delete)");
        return response.status(500).json(json);
    }
};


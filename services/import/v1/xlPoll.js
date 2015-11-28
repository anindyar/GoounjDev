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
 * This file contains the resource definitions for the service module
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var xlsx = require('node-xlsx');
var fs = require('fs');
var moment = require('moment');


exports.create = function(request, response) {
    var json, jsonOutput;
    var obj = xlsx.parse(fs.readFileSync('goounj_poll_sheet.xlsx'));
    try {
        if(request.body.createdUserId != null) {
            //for(a = 1; a < obj[0].data.length; a++) {
            //    if(obj[0].data[a].length != []) {
            //        jsonOutput = {
            //            pollName: obj[0].data[a][0],
            //            pollType: obj[0].data[a][1],
            //            category: obj[0].data[a][2],
            //            isBoost: obj[0].data[a][3],
            //            isGeneric: obj[0].data[a][4],
            //            visibilityType: obj[0].data[a][5],
            //            rewardType: obj[0].data[a][6],
            //            questionList: []
            //        };
            //        for(b = 7; b < 24; b++) {
            //            if(obj[0].data[a][b] != null) {
            //                var questionObj = {
            //                    question: obj[0].data[a][b],
            //                    questionType: obj[0].data[a][b+1],
            //                    options: []
            //                };
            //                for(c = 2; c < 8; c++) {
            //                    if(obj[0].data[a][b+c] != null) {
            //                        questionObj.options.push(obj[0].data[a][b+c]);
            //                    }
            //                }
            //                jsonOutput.questionList.push(questionObj);
            //            } b = b + 7;
            //        }
            //
            //
            //        (function (){
            //            var jsonData = jsonOutput;
            //            request.getConnection(function(connectionError, connection) {
            //                if (connectionError != null) {
            //                    log.error(connectionError, "Database Connection Error (Function = Poll.Create)");
            //                    json = {
            //                        error: "Poll Delete failed. Database could not be reached."
            //                    };
            //                    return response.status(500).json(json);
            //                }
            //                else {
            //                    var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
            //                    var dat = new Date().setDate(new Date().getDate() + config.poll.expiresAfter);
            //                    var utcTimeStampEnd = moment(dat).format('YYYY/MM/DD HH:mm:ss');
            //
            //                    console.log(jsonData);
            //
            //                    connection.query('INSERT INTO ' + config.mysql.db.name +'.poll (start_date, end_date, poll_name, is_boost, visibility_type_id, reward_type_id, created_user_id, poll_type_id, is_active, is_generic) VALUES (?, ?, ?, ?, (SELECT id FROM visibility_type WHERE type=?), (SELECT id FROM reward_type WHERE type=?), ?, (SELECT id FROM poll_type WHERE type=?), ?, ?)', [utcTimeStamp, utcTimeStampEnd, jsonData.pollName, jsonData.isBoost, jsonData.visibilityType, jsonData.rewardType, request.body.createdUserId, jsonData.pollType, "1", jsonData.isGeneric], function (queryError, poll) {
            //                        if (queryError != null) {
            //                            log.error(queryError, "Query error. Failed to create a new poll. (Function= xlPoll.Create)");
            //                            json = {
            //                                error: "Requested action failed. Database could not be reached."
            //                            };
            //                            return response.status(500).json(json);
            //                        }
            //                        else {
            //                            var pollID = poll.insertId;
            //                            var questionList = jsonData.questionList;
            //                            for (var i = 0; i<questionList.length; i++) {
            //                                (function () {
            //                                    var iCopy = i;
            //                                    connection.query('INSERT INTO ' + config.mysql.db.name + '.question (poll_id, question, question_type_id) VALUES (?, ?, (SELECT id FROM question_type WHERE type=?))', [pollID, questionList[iCopy].question, questionList[iCopy].questionType], function (queryError, quest) {
            //                                        if (queryError != null) {
            //                                            log.error(queryError, "Query error. Failed to create a new question. Question details " + JSON.stringify(jsonData.questionList) + "(Function= xlPoll.create)");
            //                                            json = {
            //                                                error: "Requested action failed. Database could not be reached."
            //                                            };
            //                                            return response.status(500).json(json);
            //                                        }
            //                                        else {
            //                                            var questionID = quest.insertId;
            //                                            var options = questionList[iCopy].options;
            //                                            for (var j = 0; j < options.length; j++) {
            //                                                connection.query('INSERT INTO ' + config.mysql.db.name + '.question_options (question_id, `option`) VALUES (?, ?)', [questionID, options[j]], function (queryError, choice) {
            //                                                    if (queryError != null) {
            //                                                        log.error(queryError, "Query error. Failed to create a new options. Question details " + JSON.stringify(jsonData.questionList) + "(Function= xlPoll.create)");
            //                                                        json = {
            //                                                            error: "Requested action failed. Database could not be reached."
            //                                                        };
            //                                                        return response.status(500).json(json);
            //                                                    }
            //                                                });
            //                                            }
            //                                        }
            //                                    });
            //                                }());
            //                            }
            //
            //                            connection.query('INSERT INTO ' + config.mysql.db.name +'.category_poll_map (poll_id, category_id) VALUES (?, (SELECT id FROM category WHERE `name` = ?))', [pollID, jsonData.category], function (queryError, poll) {
            //                                if (queryError != null) {
            //                                    log.error(queryError, "Query error. Failed to map poll to category. Category: " + JSON.stringify(jsonData.category) + "(Function= Poll Create)");
            //                                    json = {
            //                                        error: "Requested action failed. Database could not be reached."
            //                                    };
            //                                    return response.status(500).json(json);
            //                                }
            //                            });
            //                        }
            //                    });
            //                }
            //            });
            //        }());
            //
            //        function formPollQuery(utcTimeStamp, utcTimeStampEnd, pollName, isBoost, visibilityType, rewardType, createdUserId, pollType, isActive, isGeneric) {
            //            var query_text = 'INSERT INTO ' + config.mysql.db.name +'.poll (start_date, end_date, poll_name, is_boost, visibility_type_id, reward_type_id, created_user_id, poll_type_id, is_active, is_generic) VALUES (' + utcTimeStamp + ', ' + utcTimeStampEnd + ', ' + pollName + ', ' + isBoost + ', (SELECT id FROM visibility_type WHERE type='+ visibilityType +'), (SELECT id FROM reward_type WHERE type='+ rewardType +'), '+ createdUserId +', (SELECT id FROM poll_type WHERE type='+ pollType +'), '+ isActive +', '+ isGeneric +');';
            //        }
            //    }
            //    else {
            //        continue;
            //    }
            //}
            request.getConnection(function(connectionError, dbConnection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database Connection Error (Function = User.Update)");
                    json = {
                        error: "User Update failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                var counter = 0;
                console.log(obj[0].data.length);
                for(a = 1; a < obj[0].data.length; a++) {
                    if(obj[0].data[a].length != []) {
                        counter++;
                        console.log(counter);
                        var finalQueryText = "";

                        var utcTimeStamp = moment(new Date()).format('YYYY/MM/DD HH:mm:ss');
                        var dat = new Date().setDate(new Date().getDate() + config.poll.expiresAfter);
                        var utcTimeStampEnd = moment(dat).format('YYYY/MM/DD HH:mm:ss');

                        //pollName: obj[0].data[a][0],
                        //pollType: obj[0].data[a][1],
                        //category: obj[0].data[a][2],
                        //isBoost: obj[0].data[a][3],
                        //isGeneric: obj[0].data[a][4],
                        //visibilityType: obj[0].data[a][5],
                        //rewardType: obj[0].data[a][6]

                        // Building the poll query
                        var pollQuery = formPollQuery(dbConnection, utcTimeStamp, utcTimeStampEnd, obj[0].data[a][0], obj[0].data[a][3], obj[0].data[a][5], obj[0].data[a][6], request.body.createdUserId, obj[0].data[a][1], '1', obj[0].data[a][4]);
                        finalQueryText+=pollQuery;

                        // Building category poll map query
                        var categoryPollQuery = formCategoryPollMapQuery (dbConnection, obj[0].data[a][2]);
                        finalQueryText+=categoryPollQuery;

                        var questionListQuery = "";
                        var optionListQuery = "";

                        for(b = 7; b < 24; b++) {
                            if(obj[0].data[a][b] != null) {
                                // Building the question query
                                var questionQuery = formQuestionQuery(dbConnection, obj[0].data[a][b], obj[0].data[a][b+1]);
                                questionListQuery += questionQuery;
                                for(c = 2; c < 8; c++) {
                                    if(obj[0].data[a][b+c] != null) {
                                        // Building the options query
                                        var optionQuery = formOptionsQuery(dbConnection, obj[0].data[a][b+c]);
                                        optionListQuery += optionQuery;
                                    }
                                }

                                // Append the question list query with the final query
                                finalQueryText += questionListQuery;
                                questionListQuery = "";

                                // Append the option list query with the final query
                                finalQueryText += optionListQuery;
                                optionListQuery = "";

                                console.log(finalQueryText);

                                dbConnection.query(finalQueryText, function(queryError, results) {
                                    if (queryError != null) {
                                        log.error(queryError, "Query error. Failed to create a new poll. (Function= Poll Create)");
                                        json = {
                                            error: "Requested action failed. Database could not be reached."
                                        };
                                        return response.status(500).json(json);
                                    }
                                });
                            } b = b + 7;
                        }

                        function formPollQuery(connection, utcTimeStamp, utcTimeStampEnd, pollName, isBoost, visibilityType, rewardType, createdUserId, pollType, isActive, isGeneric) {
                            var queryText = 'INSERT INTO ' + config.mysql.db.name +'.poll (start_date, end_date, poll_name, is_boost, visibility_type_id, reward_type_id, created_user_id, poll_type_id, is_active, is_generic) VALUES (' + connection.escape(utcTimeStamp) + ', ' + connection.escape(utcTimeStampEnd) + ', ' + connection.escape(pollName) + ', ' + connection.escape(isBoost) + ', (SELECT id FROM visibility_type WHERE type='+ connection.escape(visibilityType) +'), (SELECT id FROM reward_type WHERE type='+ connection.escape(rewardType) +'), '+ connection.escape(createdUserId) +', (SELECT id FROM poll_type WHERE type='+ connection.escape(pollType) +'), '+ connection.escape(isActive) +', '+ connection.escape(isGeneric) +'); SET @pollID = LAST_INSERT_ID();';
                            return queryText;
                        }

                        function formQuestionQuery (connection, question, questionType) {
                            var queryText = 'INSERT INTO ' + config.mysql.db.name +'.question (poll_id, question, question_type_id) VALUES (@pollID, ' + connection.escape(question) + ', (SELECT id FROM question_type WHERE type=' + connection.escape(questionType) + ')); SET @questionID = LAST_INSERT_ID();';
                            return queryText;
                        }

                        function formOptionsQuery (connection, option) {
                            var queryText = 'INSERT INTO ' + config.mysql.db.name +'.question_options (question_id, `option`) VALUES (@questionID, ' + connection.escape(option) + ');';
                            return queryText;
                        }

                        function formCategoryPollMapQuery (connection, category) {
                            var queryText = 'INSERT INTO ' + config.mysql.db.name +'.category_poll_map (poll_id, category_id) VALUES (@pollID, (SELECT id FROM category WHERE `name` = ' + connection.escape(category) + '));';
                            return queryText;
                        }
                    }
                    else {
                        continue;
                    }
                }
            });

            log.info({Function: "xlPoll.create"}, "The polls were successfully created.");
            return response.sendStatus(200);
        }
        else {
            log.info({Function: "xlPoll.create"}, "createdUserId is required.");
            return response.sendStatus(500);
        }

    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = xlPoll.Create)");
        return response.status(500).json(json);
    }
};
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
 * This file contains the logic for the poll result service.
 *
 *************************************************************************/
var config = require('./../../../config');
var log = require('./../../../log');

/**
 * @apiDefine SurveyNotFoundError
 *
 * @apiError SurveyNotFound The requested survey was not found.
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
 * @api {show} /survey/v1/surveyResult/:id  Show survey results
 * @apiVersion 0.1.0
 * @apiName Survey Result
 * @apiGroup Survey
 *
 * @apiParam {String} id SurveyPoll Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "pollName": "Best Footballer",
 *          "questionList": [
 *                   {
 *                      "questionType": "text",
 *                      "question": "Who is the best footballer?",
 *                      "choices": [
 *                             {
 *                               "percentage": "100 %",
 *                               "resultCount": 1,
 *                               "choice": "Messi"
 *                             },
 *                             {
 *                               "percentage": "0 %",
 *                               "resultCount": 0,
 *                               "choice": "Ronaldo"
 *                             },
 *                             {
 *                               "percentage": "0 %",
 *                               "resultCount": 0,
 *                               "choice": "Ibrahimovic"
 *                             }
 *                       ],
 *                   "totalCount": 1
 *                   },
 *                  {
 *                       "questionType": "text",
 *                       "question": "Who is the top goal scorer?",
 *                       "choices": [
 *                             {
 *                               "percentage": "100 %",
 *                               "resultCount": 1,
 *                               "choice": "Messi"
 *                             },
 *                             {
 *                               "percentage": "0 %",
 *                               "resultCount": 0,
 *                               "choice": "Ronaldo"
 *                             },
 *                             {
 *                               "percentage": "0 %",
 *                               "resultCount": 0,
 *                               "choice": "Lewandoski"
 *                             }
 *                       ],
 *                       "totalCount": 1
 *                 }
 *                 ],
 *           "createdUserId": 1,
 *           "category": "Sports"
 *      }
 *
 * @apiUse DatabaseError
 *
 * @apiUse SurveyNotFoundError
 *
 */


exports.show = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = SurveyResult.Create)");
                json = {
                    error: "Survey Poll Results failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            connection.query('SELECT poll.poll_name AS pollName,(SELECT name FROM category WHERE id = (SELECT category_id FROM category_poll_map WHERE poll_id = poll.id)) AS category, poll.created_user_id AS createdUserId, question.question AS question, question_options.`option` AS choices, COUNT(answer.question_options_id) AS resultCount FROM poll INNER JOIN question ON question.poll_id = poll.id INNER JOIN question_options ON question_options.question_id = question.id RIGHT JOIN answer ON (answer.question_id = question.id) AND (answer.question_options_id = question_options.id) WHERE poll.id = ? GROUP BY answer.question_options_id;', request.params.id, function(queryError, resultSet) {
                if (queryError != null) {
                    log.error(queryError, "Query error. Failed to fetch poll results. Survey Poll Result details " + JSON.stringify(request.params.id) + "(Function = SurveyResult.Create)");
                    json = {
                        error: "Requested action failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                else {
                    if (resultSet[0]) {
                        var choiceObj,jsonOutput,questionObj = {};
                        connection.query('SELECT question.question AS question, question_options.`option` AS choices FROM poll INNER JOIN question ON question.poll_id = poll.id INNER JOIN question_options ON question_options.question_id = question.id WHERE poll.id = ?', request.params.id, function(queryError, choice) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch poll results. Survey Poll Result details " + JSON.stringify(request.params.id) + "(Function = SurveyResult.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else {
                                jsonOutput = {
                                    pollName:           resultSet[0].pollName,
                                    category:           resultSet[0].category,
                                    createdUserId:      resultSet[0].createdUserId,
                                    questionList: []
                                };

                                choice.forEach(function(choiceEntry){
                                    if (typeof questionObj[choiceEntry.question] == "undefined") {
                                        questionObj[choiceEntry.question] = [];
                                    }
                                    var count = 0;
                                    var num = 0;
                                    resultSet.forEach(function(resultEntry) {
                                        choiceObj = {
                                            choice:         resultEntry.choices,
                                            resultCount:    resultEntry.resultCount,
                                            percentage: ""
                                        };
                                        var arr = questionObj[choiceEntry.question];

                                        for(i = 0; i < arr.length; i++) {
                                            if(resultEntry.choices == arr[i].choice) {
                                                num++;
                                            }
                                        }

                                        if (choiceEntry.question == resultEntry.question) {
                                            if(num == 0){
                                                questionObj[choiceEntry.question].push(choiceObj);
                                            }
                                        }

                                        if (choiceEntry.question == resultEntry.question) {
                                            if(choiceEntry.choices == resultEntry.choices) {
                                                count++;
                                            }
                                        }
                                    });
                                    if(count == 0) {
                                        choiceObj = {
                                            choice: choiceEntry.choices,
                                            resultCount: 0,
                                            percentage: ""
                                        };
                                        questionObj[choiceEntry.question].push(choiceObj);
                                    }
                                });


                                for (var question in questionObj) {
                                    if (questionObj.hasOwnProperty(question)) {
                                        jsonOutput.questionList.push({
                                            choices: questionObj[question],
                                            questionType: "text",
                                            question: question,
                                            totalCount: 0
                                        });
                                    }
                                }

                                var questions = jsonOutput.questionList;
                                for(var i = 0; i < questions.length; i++) {
                                    var options = questions[i].choices;
                                    var totalCount = 0;
                                    for(var j = 0; j < options.length; j++) {
                                        totalCount += options[j].resultCount;
                                    }
                                    for(var k = 0; k < options.length; k++) {
                                        var percentage = 0;
                                        percentage = (options[k].resultCount/totalCount)*100;
                                        options[k].percentage = Math.round(percentage) + " %";
                                    }
                                    questions[i].totalCount = totalCount;
                                }


                                log.info({Function: "SurveyResult.Create"}, "Fetched Survey Poll Results. Poll Id: " + request.params.id);
                                return response.status(200).json(jsonOutput);
                            }
                        });
                    }
                    else {
                        json = {
                            error: "No results for this survey poll."
                        };
                        log.info({Function: "SurveyResult.Create"}, "Requested Survey Poll Result Not Found");
                        return response.status(404).json(json);
                    }
                }
            });
        });
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = SurveyResult.Create)");
        return response.status(500).json(json);
    }
};
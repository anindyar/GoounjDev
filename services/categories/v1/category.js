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
 * This file contains the logic for the category service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');

/**
 * @apiDefine CategoryNotFoundError
 *
 * @apiError CategoryNotFound The requested category was not found.
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
 * @api {post} /categories/v1/category Create category
 * @apiVersion 0.1.0
 * @apiName Create Category
 * @apiGroup Category
 *
 *
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "category": "general"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiUse DatabaseError
 *
 *
 */

exports.create = function(request, response) {
    var json;
    try{
        if(request.body.category != null){
            request.getConnection(function(connectionError, connection){
                if(connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Category.Create");
                    json = {
                        error: "Category Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.category WHERE name = ?', [request.body.category], function(queryError, item) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to create a new category. Category Details: " + JSON.stringify(request.body.category) + "(Function = Category.Create)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if (item[0]){
                        var categoryOBJ = item[0];
                        var categoryID = categoryOBJ[0];
                        json = {
                            error: "Category already exists!"
                        };
                        log.info({Function: "Category.Create"},"Category already exists. Category ID: " + categoryID);
                        return response.status(400).json(json);
                    }
                    else{
                        connection.query('INSERT INTO '+ config.mysql.db.name +'.category (name) VALUES(?)',request.body.category, function(queryError, result){
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to create a new poll. User details " + JSON.stringify(request.body.phone) + "(Function = Category.Create)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            else{
                                categoryID = result.insertId;
                                json = {
                                    categoryId: categoryID
                                };
                                log.info({Function: "Category.Create"}, "New category created successfully. Category ID: " + categoryID);
                                return response.status(200).json(json);
                            }
                        });
                    }
                });
            });
        }

    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Category.Create)");
        return response.status(500).json(json);
    }
};


/**
 * @api {put} /categories/v1/category/:id Update category
 * @apiVersion 0.1.0
 * @apiName Update Category
 * @apiGroup Category
 *
 * @apiParam {String} id Category Id.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "category": "general"
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
 *      "id": 1,
 *      "name": "general"
 *  }
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse CategoryNotFoundError
 *
 * @apiUse CategoryAlreadyExistsError
 */

/**
 * @apiDefine CategoryAlreadyExistsError
 *
 * @apiError CategoryAlreadyExists The requested category name already exists under another id.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *          error: "Category already exists!"
 *     }
 *
 */


exports.update = function(request, response) {
    var json;
    try {
        if(request.params.id != null) {
            request.getConnection(function(connectionError, connection) {
                if (connectionError != null) {
                    log.error(connectionError, "Database connection error (Function = Category.Update");
                    json = {
                        error: "Category Create failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                }
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.category WHERE name = ?', [request.body.category], function(queryError, item) {
                    if (queryError != null) {
                        log.error(queryError, "Query error. Failed to create a new category. Category Details: " + JSON.stringify(request.body.category) + "(Function = Category.Update)");
                        json = {
                            error: "Requested action failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    }
                    if (item[0]) {
                        var categoryOBJ = item[0];
                        var categoryID = categoryOBJ[0];
                        json = {
                            error: "Category already exists!"
                        };
                        log.info({Function: "Category.Update"}, "Category already exists. Category ID: " + categoryID);
                        return response.status(400).json(json);
                    }
                    else{
                        connection.query('SELECT * FROM ' + config.mysql.db.name + '.category WHERE id = ?', [request.params.id], function (queryError, entry) {
                            if (queryError != null) {
                                log.error(queryError, "Query error. Failed to fetch the requested category. Category Details: " + JSON.stringify(request.params.id) + "(Function = Category.Update)");
                                json = {
                                    error: "Requested action failed. Database could not be reached."
                                };
                                return response.status(500).json(json);
                            }
                            if(!entry[0]){
                                json = {
                                    error: "Requested category not found."
                                };
                                log.info({Function: "Category.Update"},"Requested category not found. Category ID: " + request.params.id);
                                return response.status(404).json(json);
                            }
                            else {
                                if(request.body.category != null){
                                    connection.query('UPDATE '+ config.mysql.db.name + '.category SET name = ? WHERE id = ?', [request.body.category, request.params.id], function(queryError, none){
                                        if (queryError != null) {
                                            log.error(queryError, "Query error. Failed to update category. Category ID: " + JSON.stringify(request.params.id) + "(Function = Category.Update)");
                                            json = {
                                                error: "Requested action failed. Database could not be reached."
                                            };
                                            return response.status(500).json(json);
                                        }
                                        else {
                                            connection.query('SELECT * FROM '+ config.mysql.db.name +'.category WHERE id = ?', request.params.id, function(queryError, result) {
                                                if (queryError != null) {
                                                    log.error(queryError, "Query Error. Failed To Update Category. Category ID: " + request.params.id + " (Function = Category.Update)");
                                                    json = {
                                                        error: "Requested Action Failed. Database could not be reached."
                                                    };
                                                    return response.status(500).json(json);
                                                } else {
                                                    log.info({Function: "Category.Update"}, "Category Updated Successfully. Category ID: " + request.params.id);
                                                    return response.status(200).json(result[0]);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            });
        }
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Category: Update)");
        return response.status(500).json(json);
    }
};


/**
 * @api {get} /categories/v1/category Index categories
 * @apiVersion 0.1.0
 * @apiName Index Category
 * @apiGroup Category
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *       "id": 1,
 *       "name": "general"
 *       },
 *       {
 *       "id": 2,
 *       "name": "sports"
 *       }
 *    ]
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse CategoryNotFoundError
 *
 */

exports.index = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if(connectionError) {
                log.error(connectionError, "Database connection error (Function = Category.Index");
                json = {
                    error: "Category Create failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }
            else {
                connection.query('SELECT * FROM '+ config.mysql.db.name +'.category', function(queryError, result) {
                    if (queryError != null) {
                        log.error(queryError, "Query Error. Failed to fetch category details. (Function = Category.Index)");
                        json = {
                            error: "Requested Action Failed. Database could not be reached."
                        };
                        return response.status(500).json(json);
                    } else {
                        if (result) {
                            log.info({Function: "Category.Show"}, "Fetched Category Details.");
                            return response.status(200).json(result);
                        } else {
                            log.info({Function: "Category.Show"}, "Requested Category Not Found");
                            return response.sendStatus(404);
                        }
                    }
                });
            }
        });
    }
    catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Category: Update)");
        return response.status(500).json(json);
    }
};


/**
 * @api {delete} /categories/v1/category/:id Delete category
 * @apiVersion 0.1.0
 * @apiName Delete Category
 * @apiGroup Category
 *
 * @apiParam {String} id Category Id.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse CategoryNotFoundError
 *
 */

exports["delete"] = function(request, response) {
    var json;
    try {
        request.getConnection(function(connectionError, connection) {
            if (connectionError != null) {
                log.error(connectionError, "Database Connection Error (Function = Category.Delete)");
                json = {
                    error: "Category Delete failed. Database could not be reached."
                };
                return response.status(500).json(json);
            }

            connection.query('DELETE FROM ' + config.mysql.db.name + '.category WHERE id = ?', request.params.id, function (queryError, result) {
                if (queryError != null) {
                    log.error(queryError, "Query Error. Failed To Delete A Category. Category ID: " + request.params.id + " (Function = Category.Delete)");
                    json = {
                        error: "Requested Action Failed. Database could not be reached."
                    };
                    return response.status(500).json(json);
                } else {
                    if (result.affectedRows != 0) {
                        log.info({Function: "Category.Delete"}, "Category Deleted Successfully. id: " + request.params.id);
                        return response.sendStatus(200);
                    } else {
                        log.info({Function: "Category.Delete"}, "Requested Category Not Found. Category ID: " + request.params.id );
                        return response.sendStatus(404);
                    }
                }
            });
        });
    } catch (error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception Occurred (Function = Category.Delete)");
        return response.status(500).json(json);
    }
};
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
 * This file contains the logic for the requestOtp service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var otp = require('./../../../otp');


/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
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
 * @api {post} /vote/v1/requestOtp Request OTP for a user
 * @apiVersion 0.1.0
 * @apiName RequestOtp
 * @apiGroup Vote
 *
 * @apiParam {Number} userId User's unique Id
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "userId": 1
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 *
 * @apiUse DatabaseError
 *
 * @apiUse UserNotFoundError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if(request.body.userId != null) {
            otp.sendotp(request, response);
        }
        else {
            json = {
                error: "userId required."
            };
            log.error({Function: "requestOtp.Create"}, "userId required");
            return response.status(400).json(json);
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: RequestOtp.Create)");
        return response.status(500).json(json);
    }
};


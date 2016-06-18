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
 * This file contains the logic for the verifytOtp service.
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
 * @apiDefine UserUnauthorisedError
 *
 * @apiError UserNotFound The requested user is unauthorised.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorised
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
 * @api {post} /vote/v1/verifyOtp Verify OTP for a user
 * @apiVersion 0.1.0
 * @apiName VerifyOtp
 * @apiGroup Vote
 *
 * @apiParam {Number} userId User's unique Id
 * @apiParam {Number} authCode OTP for authentication
 *
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *         "userId": 1,
 *         "authCOde": 2345
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
 * @apiUse UserUnauthorisedError
 *
 */

exports.create = function(request, response) {
    var json;
    try {
        if(request.body.userId != null && request.body.authCode != null) {
            otp.verifyotp(request, response);
        }
        else {
            json = {
                error: "userId & authCode required."
            };
            log.error({Function: "VerifyOtp.Create"}, "userId and authCode are required");
            return response.status(400).json(json);
        }
    }
    catch(error) {
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: VerifytOtp.Create)");
        return response.status(500).json(json);
    }
};

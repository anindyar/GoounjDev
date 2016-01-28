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
 * This file contains the logic for the verify number service.
 *
 *************************************************************************/

var config = require('./../../../config');
var log = require('./../../../log');
var otp = require('./../../../otp');

exports.create = function(request, response) {
    var json;
    try {
        if(request.body.userId != null && request.body.authCode != null) {
            otp.verifyotp(request, response);
            log.info({Function: "VerifyNumber.Create"}, "Phone Number verified. New number: " + request.body.newNumber );
        }
        else {
            json ={
                error: "userId and authCode are required."
            };
            log.error({Function: "VerifyNumber.Create"}, "userId and authCode are required");
            return response.status(400).json(json);
        }
    }
    catch(error){
        json = {
            error: "Error: " + error.message
        };
        log.error(error, "Exception occured. (Function: VerifyNumber.Update)");
        return response.status(500).json(json);
    }
};
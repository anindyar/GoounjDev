/**
 * Created by catherinesamuel on 11/02/16.
 */

var config = require('./../../../config');
var log = require('./../../../log');
var otp = require('./../../../otp');

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

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
 * This class is used to send sms using nexmo and smslane.
 * 
 *************************************************************************/

var config = require('./config');
var log = require('./log');
var http = require('http');

exports.sendSMS = function(recipient, text) {

    if(config.sms.enabled) {
        var content = encodeURIComponent(text);
        var path = '/vendorsms/pushsms.aspx?user=' + config.smslane.username + '&password=' + config.smslane.password + '&msisdn=' + recipient + '&sid=WebSMS&msg=' + content + '&fl=0';
        console.log(path);
        var options = {
            host: config.sms.host,
            port: config.sms.port,
            path: path,
            method: 'GET'
        };

        http.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        }).end();
    } else {
        log.info({Function: "SMS.SendSMS"}, "SMS is disabled. Please enable sms in the configurations.");
    }

};


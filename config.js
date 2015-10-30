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
 * Main config file.
 * 
 *************************************************************************/

var cafile, cafiles, config, fs;

fs = require('fs');

process.env.NODE_ENV = 'production';

config = {
    name: 'Goounj-API',
    version: '0.1.0',
    hashIterations: 1000,
    emailFilterRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    passwordFilterRegex: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
    enableConsole: true,
    http: {
        enabled: true,
        port: 3000
    },
    https: {
        enabled: false,
        port: 443,
        options: {
            key: '',
            cert: '',
            ca: ''
        }
    },
    mysql: {
        server: {
            host: 'localhost',
            port: 3306
        },
        db: {
            name: 'goounj',
            username: 'root',
            password: ''
        }
    },
    pushNotification: {
        enabled: false,
        android: {
            api_key: ''
        },
        ios: {

        }
    },
    email: {
        enabled: false,
        mandrill: {
            api_key: '',
            fromEmail: 'support@bvocal.in',
            fromName: 'Goounj Support'
        }
    },
    sms: {
        enabled: false,
        host: 'adithya.me',
        port: '443'
    },
    userVerification: {
        enabled: false,
    }
};

if (process.env.NODE_ENV == 'production') {

    // Production db setup
    config.mysql.server.host = 'goounjdb.cloudapp.net';
    config.mysql.db.username = 'dev';
    config.mysql.db.password = 'dev@123';
    config.mysql.server.port = 3306;
    config.mysql.db.name = 'goounj';

    // production http/https setup
    config.http.port = 1337;
    config.https.enabled = false;
    config.https.port = 443;

    // Production ssl support
    //cafiles = ['/web/cert/EssentialSSLCA_2.crt', '/web/cert/ComodoUTNSGCCA.crt', '/web/cert/UTNAddTrustSGCCA.crt', '/web/cert/AddTrustExternalCARoot.crt'];
    //config.http.port = 80;
    //config.https.options.key = fs.readFileSync('/web/cert/star_re3tech_com.key');
    //config.https.options.cert = fs.readFileSync('/web/cert/star_re3tech_com.crt');
    //config.https.options.ca = (function() {
    //    var _i, _len, _results;
    //    _results = [];
    //    for (_i = 0, _len = cafiles.length; _i < _len; _i++) {
    //        cafile = cafiles[_i];
    //        _results.push(fs.readFileSync(cafile));
    //    }
    //    return _results;
    //})();

} else {
    // Development environment setup
    config.mysql.server.host = 'localhost';
    config.http.port = 3000;
    config.https.enabled = false;
}

module.exports = config;

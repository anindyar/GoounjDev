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

module.exports = {
    resources: [
        {
            name: 'survey',
            methods: require('./survey'),
            auth: 'bypass'
        }, {
            name: 'answerSurvey',
            methods: require('./answerSurvey'),
            auth: 'bypass'
        }, {
            name: 'surveyList',
            methods: require('./surveyList'),
            auth: 'bypass'
        }
    ]
};
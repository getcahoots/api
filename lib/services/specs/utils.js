/*
 * cahoots-api-services
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var path = require('path');

var storage = require('cahoots-api-storage');

module.exports.clearDatabase = function clearDatabase (callback) {
    storage.destroy(callback);
};

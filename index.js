/*
 * cahoots-api
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

var api = require('./lib/');
var VError = require('verror');

var pkg = require('./package.json');

module.exports = function instantiate () {
    var app = new Application();

    process.title = pkg.name;

    return {
        boot: app.boot.bind(app),
        shutdown: app.shutdown.bind(app)
    };
};

function Application () {
    this.$api = api();
}

/**
 * Boots the cahoots.pw API.
 *
 * @param {function} callback
 * Will be executed when the whole api has been started. Executed as `callback(err)`.
 *
 */
Application.prototype.boot = function boot (callback) {
    function onBoot (err) {
        if (err) {
            return callback(new VError(err, 'failed to boot %s', pkg.name));
        }

        callback(null);
    }

    callback = callback || function noop () {};

    this.$api.boot(onBoot);
};

/**
 * Shuts a running cahoots.pw API instance down.
 *
 * @param {function} callback
 * Will be executed when the API has been shutted down. Executed as `callback(err)`.
 *
 */
Application.prototype.shutdown = function shutdown (callback) {
    function onShutdown (err) {
        if (err) {
            return callback(new VError(err, 'failed to shutdown %s', pkg.name));
        }

        callback(null);
    }

    this.$api.shutdown(onShutdown);
};

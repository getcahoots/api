/*
 * cahoots-backend
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

var VError = require('verror');

var api = require('cahoots-backend-api');

module.exports = function instantiate () {
    var backend = new Backend();

    return {
        boot: backend.boot.bind(backend),
        shutdown: backend.shutdown.bind(backend)
    };
};

function Backend () {
    this.$apps = {
        api: api()
    };
}

Backend.prototype.boot = function boot (callback) {

    function onBoot (err) {
        if (err) {
            return callback(new VError(err, 'failed to boot the RESTful API.'));
        }

        callback(null);
    }

    callback = callback || function noop () {};

    this.$apps.api.boot(onBoot);
};

Backend.prototype.shutdown = function shutdown (callback) {
    function onShutdown (err) {
        if (err) {
            return callback(new VError(err, 'failed to shutdown the RESTful API.'));
        }

        callback(null);
    }

    this.$apps.shutdown(onShutdown);
};

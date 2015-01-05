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

module.exports = function instantiate () {
    var backend = new CahootsBackend();

    return {
        boot: backend.boot.bind(backend),
        shutdown: backend.shutdown.bind(backend)
    };
};

function CahootsBackend () {}

CahootsBackend.prototype.boot = function boot () {

};

CahootsBackend.prototype.shutdown = function shutdown () {

};

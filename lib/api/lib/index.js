/*
 * cahoots-backend-api
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

var fs = require('fs');
var path = require('path');

var bodyparser = require('body-parser')
var debug = require('debug')('cahoots:backend:api:Main');
var express = require('express');
var VError = require('verror');

module.exports = function instantiate () {
    var api = new API();

    return {
        boot: api.boot.bind(api),
        shutdown: api.shutdown.bind(api)
    };
};

function API () {
    this.$web = null;
    this.$server = null;
}

/**
 * @private
 *
 * Determine all resources which are placed in the current directory. This
 * method is responsible for collecting all available resources.
 *
 * @param {function} callback
 * Will be executed when all possible resources for the RESTful API has been
 * collected. Executed as `callback(err, resources)`.
 *
 */
API.prototype.$resources = function $resources (callback) {
    function onReadDir (err, entries) {
        var resources = [];

        if (err) {
            return callback(new VError(err, 'failed to read directory in order to determine resources'));
        }

        entries.forEach(function onIteration (entry) {
            var resource = null;

            if (!~__filename.indexOf(entry)) {
                resource = require(path.join(__dirname, entry));

                //
                // Instantiate resource
                //
                resources[entry.replace(path.extname(entry), '')] = resource();
            }
        });

        callback(null, resources);
    }

    fs.readdir(__dirname, onReadDir);
};

/**
 * @private
 *
 * Mounts all given resources as RESTful endpoints.
 *
 * @param {array} resources
 * An array with all available resources.
 *
 */
API.prototype.$mount = function $mount (resources) {
    var self = this;
    var name = '';
    var router = null;

    function mountIt (actions) {
        actions.forEach(function onIteration (action) {
            debug('Mounting %s /%s', action.method, name, action.path);
            router[action.method.toLowerCase()](action.path, action.handler);
        });

        self.$web.use('/' + name, router);
    }

    for (name in resources) {
        if (resources.hasOwnProperty(name)) {
            router = express.Router();

            mountIt(resources[name]);
        }
    }
};

/**
 * Boots the RESTful API.
 *
 * @param {number} port
 * The port on which the RESTful API should listen.
 *
 * @param {string} host
 * The port binding (optional; default: 0.0.0.0)
 *
 * @param {function} callback
 * Will be executed when the binding has happened as `callback(err)`.
 *
 */
API.prototype.boot = function boot (port, host, callback) {

    var self = this;

    function onListen (err) {
        if (err) {
            return callback(new VError(err, 'failed to start the cahoots.pw RESTful API'));
        }

        callback(null);
    }

    function onResources (err, resources) {
        if (err) {
            return callback(new VError(err, 'failed to load all RESTful resources.'));
        }

        self.$mount(resources);

        self.$server = self.$web.listen(port, host, onListen);
    }

    if (typeof port === 'function') {
        callback = port;
        port = null;
        host = null;
    } else if (typeof host === 'function') {
        callback = host;
        host = null;
    }

    port = port || process.env.PORT || 8080;
    host = host || process.env.HOST || '0.0.0.0';

    callback = callback || function noop () {};

    this.$web = express();
    this.$web.use(bodyparser.json());
    this.$web.disable('x-powered-by');

    this.$resources(onResources);
};

/**
 * Method for shutting the API down.
 *
 */
API.prototype.shutdown = function shutdown (callback) {
    callback = callback || function noop () {};

    if (this.$server) {
        this.$server.close(callback);
    }
};

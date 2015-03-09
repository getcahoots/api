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

var express = require('express');
var cors = require('cors');
var bodyparser = require('body-parser');
var VError = require('verror');

var debug = require('debug')('cahoots:api');

var pkg = require('../package.json');

var versions = {
    v1: require('./v1')
};

module.exports = function initialize () {
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
 * Mounts all given resources as RESTful endpoints.
 *
 * @param {array} resources
 * An array with all available resources.
 *
 */
API.prototype.$mount = function $mount () {
    if (!this.$web) {
        throw new VError('Please make sure that you\'ve called `boot` before');
    }

    for (let version in versions) {
        let router = express.Router();
        let resources = versions[version]();

        debug('Mounting %s of the API ...', version);

        for (let resource in resources) {
            let action = resources[resource];

            if (action.middlewares) {
                router[action.method.toLowerCase()](action.path, action.middlewares, action.handler);
            } else {
                router[action.method.toLowerCase()](action.path, action.handler);
            }

            debug('Mounted resource "%s %s"', action.method, action.path);
        }

        this.$web.use('/' + version, router);

        debug('Mounted %s of the API.', version);
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

    function onListen (err) {
        if (err) {
            return callback(new VError(err, 'failed to start the cahoots.pw RESTful API'));
        }

        callback(null);
    }

    if (typeof port === 'function') {
        callback = port;
        port = null;
        host = null;
    } else if (typeof host === 'function') {
        callback = host;
        host = null;
    }

    port = port || process.env.PORT || 9090;
    host = host || process.env.HOST || '0.0.0.0';

    callback = callback || function noop () {};

    this.$web = express();
    this.$web.use(bodyparser.json());
    this.$web.disable('x-powered-by');

    this.$web.use(cors());

    this.$web.get('/', function onRoot (req, res) {
        res.status(200).json({
            name: 'cahoots-api',
            info: 'https://github.com/getcahoots/api/wiki',
            version: pkg.version
        });
    });

    if (process.env.NODE_ENV !== 'production') {
        this.$web.set('json spaces', 4);
    }

    this.$mount();

    this.$server = this.$web.listen(port, host, onListen);
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

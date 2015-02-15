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

var api = require('./app/');
var VError = require('verror');

var services = require('cahoots-api-services');

var pkg = require('./package.json');

const SUPERUSER_NAME = (process.env.SUPERUSER_NAME || 'Cahoots Team').split(' ');
const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || 'info@cahoots.pw';

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
 * @private
 *
 * This method ensures that there is one superuser.
 *
 * @param {function} callback
 * Will be executed as `callback(err)`.
 *
 */
Application.prototype.$createSuperuser = function $createSuperuser (callback) {
    var service = services('account');
    var password = service.generatePassword();

    function onFind (err, superuser) {
        if (err) {
            return callback(new VError(err, 'failed to search for the superuser.'));
        }

        if (!superuser) {
            superuser = {
                name: {
                    first: SUPERUSER_NAME[0],
                    last: SUPERUSER_NAME[1]
                },
                email: SUPERUSER_EMAIL,
                password: password,
                superuser: true
            };

            service.register(superuser, onRegister);
        } else {
            callback(null);
        }
    }

    function onRegister (err, superuser) {
        if (err) {
            return callback(new VError(err, 'failed to register the superuser.'));
        }

        console.log('Created superuser: ' + superuser.email + '/' + password);

        callback(null);
    }

    service.findSuperuser(onFind);
};

/**
 * Boots the cahoots.pw API.
 *
 * @param {function} callback
 * Will be executed when the whole api has been started. Executed as `callback(err)`.
 *
 */
Application.prototype.boot = function boot (callback) {
    var self = this;

    function onBoot (err) {
        if (err) {
            return callback(new VError(err, 'failed to boot %s', pkg.name));
        }

        callback(null);
    }

    function onSuperuser (err) {
        if (err) {
            return callback(new VError(err, 'failed to create the superuser.'));
        }

        self.$api.boot(onBoot);
    }

    callback = callback || function noop () {};

    this.$createSuperuser(onSuperuser);
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

/*
 * cahoots-backend-validator
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

var debug = require('debug')('cahoots:backend:validator');
var JSCK = require('jsck');
var mandatory = require('mandatory');
var VError = require('verror');

module.exports = function instantiate (schema) {
    var validator;

    mandatory(schema).is('object', 'Please provide a proper JSON schema.');

    validator = new Validator(schema);

    return {
        check: function check (data, callback) {
            mandatory(data).is('object', 'Please provide a proper data object.');
            mandatory(callback).is('function', 'Please provide a proper callback function.');

            return validator.check(data, callback);
        }
    };
};

function Validator (schema) {
    this.$schema = new JSCK.draft4(schema);
}

Validator.prototype.check = function check (data, callback) {
    var result = this.$schema.validate(data);

    debug('Validation result: %j', result);

    function onTick () {
        if (!result.valid) {
            return callback(new VError('Validation failed: %j', result.errors));
        }

        callback(null);
    }

    process.nextTick(onTick);
};

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

module.exports = function instantiate (schema) {
    var validator;

    mandatory(schema).is('object', 'Please provide a proper JSON schema.');

    validator = new Validator(schema);

    return {
        check: function check (data) {
            return validator.check(data);
        }
    };
};

function Validator (schema) {
    this.$schema = new JSCK.draft4(schema);
}

Validator.prototype.check = function check (data) {
    var result = this.$schema.validate(data);

    debug('Validation result: %j', result);

    return result;
};

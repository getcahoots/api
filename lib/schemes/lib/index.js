/*
 * cahoots-api-schemes
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

var mandatory = require('mandatory');

var schemes = {
    person: require('./person'),
    organization: require('./organization')
};

module.exports = function get (name) {
    var schema = {};

    mandatory(name).is('string', 'Please define a name of the schema you want to grab.');

    schema = schemes[name] || {};

    return schema;
};

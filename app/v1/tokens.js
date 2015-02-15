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

var http = require('http');

var debug = require('debug')('cahoots:api:TokensResource');

var services = require('cahoots-api-services');
var schemes = require('cahoots-api-schemes');
var validator = require('cahoots-api-validator');
var tokenstore = require('cahoots-api-tokenstore');

module.exports = function instantiate () {
    var resource = new TokensResource();

    return [
        {
            method: 'POST',
            path: '/tokens',
            handler: resource.authenticate.bind(resource)
        }
    ];
};

function TokensResource () {
    this.$service = services('account');
    this.$schema = schemes('account');
}

TokensResource.prototype.authenticate = function authenticate (req, res) {
    var self = this;
    var credentials = req.body;
    var schema = this.$schema.credentials;

    function onValidation (err) {
        if (err) {
            debug('Validation of token (authenticate) failed: %j', err);
            return res.status(400).send(http.STATUS_CODES[400]);
        }

        self.$service.authenticate(credentials.email, credentials.password, onAuth);
    }

    function onAuth (err, account) {
        if (err) {
            debug('Error while trying to authenticate the account: %j', err);
            return res.status(500).send(http.STATUS_CODES[500]);
        }

        account.token = tokenstore().put(account);

        res.status(201).json(account);
    }

    validator(schema).check(credentials, onValidation);
};

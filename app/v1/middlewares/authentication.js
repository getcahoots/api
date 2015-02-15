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

var debug = require('debug')('cahoots:api:middlewares:authentication');

var tokenstore = require('cahoots-api-tokenstore');

module.exports = function authentication () {
    var middleware = new AuthenticationMiddleware();

    return middleware.execute.bind(middleware);
};

function AuthenticationMiddleware () {
    this.$tokenstore = tokenstore();
}

AuthenticationMiddleware.prototype.execute = function execute (req, res, next) {
    var token = req.query.token;

    if (!this.$tokenstore.exist(token)) {
        debug('Token not found: 401 Unauthorized');
        return res.status(401).send(http.STATUS_CODES[401]);
    }

    if (this.$tokenstore.valid(token)) {
        debug('Token is valid.');
        return next();
    } else {
        debug('Token is not valid anymore: 403 Forbidden');
        return res.status(403).send(http.STATUS_CODES[403]);
    }
};

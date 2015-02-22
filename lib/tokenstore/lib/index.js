/*
 * cahoots-api-tokenstore
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

var process = require('process');
var crypto = require('crypto');
var mandatory = require('mandatory');

var debug = require('debug')('cahoots:api:tokenstore');

const INSTANCE = new TokenStore();

var DEADLINE_TERM = ((60 * 1000) * 60 * 24) * 5; // 5 days

module.exports = function getInstance (spec) {
    var api = {
        exist: INSTANCE.exist.bind(INSTANCE),
        valid: INSTANCE.valid.bind(INSTANCE),
        put: INSTANCE.put.bind(INSTANCE)
    };

    //
    // If running through a test runner, expose more.
    //
    if (spec) {
        api.$tokens = INSTANCE.$tokens;
        api.$generateHash = INSTANCE.$generateHash;
        DEADLINE_TERM = 200;
    }

    return api;
};

function TokenStore () {
    this.$tokens = {};

    // TODO: Implement token cleaner
}

TokenStore.prototype.$generateHash = function $generateHash (payload) {
    var hashable = '';
    var shasum = '';

    for (let attr in payload) {
        if (payload.hasOwnProperty(attr)) {
            hashable += attr;

            hashable += payload[attr];
        }
    }

    shasum = crypto.createHash('sha1');
    shasum.update(hashable);

    return shasum.digest('hex');
};

TokenStore.prototype.$findTokenBySignature = function $findTokenBySignature (signature) {
    for (let token in this.$tokens) {
        if (this.$tokens.hasOwnProperty(token) && this.$tokens[token].signature === signature) {
            return this.$tokens[token];
        }
    }
};

TokenStore.prototype.put = function put (payload) {
    var id = '';
    var signature = '';
    var hrtime = process.hrtime();

    mandatory(payload).is('object', 'Please provide a proper payload object for the token.');

    id += this.$generateHash(payload);

    signature += this.$generateHash({timestamp: Date.now() + hrtime[0] + hrtime[1] + Math.random()});

    this.$tokens[id] = {};
    this.$tokens[id].id = id;
    this.$tokens[id].payload = payload;
    this.$tokens[id].deadline = Date.now() + DEADLINE_TERM;
    this.$tokens[id].signature = signature;

    debug('Put new token into the store.');

    return signature;
};

TokenStore.prototype.exist = function exist (signature) {
    var token = this.$findTokenBySignature(signature);

    return !!token;
};

TokenStore.prototype.valid = function valid (signature) {
    var token = this.$findTokenBySignature(signature);
    var is = true;

    if (!token) {
        is = false;
    } else if (Date.now() > token.deadline) {
        delete this.$tokens[token.id];

        is = false;
    }

    return is;
};

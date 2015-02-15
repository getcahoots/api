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

var crypto = require('crypto');
var mandatory = require('mandatory');

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
        DEADLINE_TERM = 200;
    }

    return api;
};

function TokenStore () {
    this.$tokens = {};

    // TODO: Implement token cleaner
}

TokenStore.prototype.$generateId = function $generateId (payload) {
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

TokenStore.prototype.put = function put (payload) {
    var id;

    mandatory(payload).is('object', 'Please provide a proper payload object for the token.');

    id = this.$generateId(payload);

    this.$tokens[id] = {};
    this.$tokens[id].id = id;
    this.$tokens[id].payload = payload;
    this.$tokens[id].deadline = Date.now() + DEADLINE_TERM;

    return id;
};

TokenStore.prototype.exist = function exist (id) {
    return !!this.$tokens[id];
};

TokenStore.prototype.valid = function valid (id) {
    var token = this.$tokens[id];
    var is = true;

    if (!token) {
        is = false;
    } else if (Date.now() > token.deadline) {
        delete this.$tokens[id];

        is = false;
    }

    return is;
};

/*
 * cahoots-backend-daos
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

var debug = require('debug')('cahoots:backend:daos:Factory');
var mandatory = require('mandatory');

var GQL = require('pouchdb-gql').gql;
var PouchDB = require('pouchdb');

//
// Registering PouchDB plugins
//
PouchDB.plugin({ gql: GQL });

var db = null;

var daos = {
    person: require('./person')
};

module.exports = function create (type) {
    var dao = daos[type];

    if (!db) {
        db = new PouchDB(process.env.DATABASE_URL);
    }

    mandatory(dao).is('function', 'The DAO "' + type + '" does not exist.');

    debug('Created DAO with type "%s"', type);

    return dao(db);
};

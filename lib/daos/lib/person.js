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

var debug = require('debug')('cahoots:backend:daos:Person');
var VError = require('verror');

module.exports = function initialize (db) {
    var dao = new PersonDAO(db);

    return {
        insert: dao.insert.bind(dao),
        findAll: dao.findAll.bind(dao)
    };
};

function PersonDAO (db) {
    this.$type = 'person';

    this.$db = db;
}

/**
 * Method for inserting new persons.
 *
 * @param {object} person
 * The person object which should be inserted.
 *
 * @param {function} callback
 * The callback which will be executed when the person has been inserted or
 * an error occurred. Will be executed as `callback(err, person)`. Please note
 * that the passed person object will be extended with a new id.
 *
 */
PersonDAO.prototype.insert = function insert (person, callback) {
    person.type = this.$type;

    function onInsert (err, result) {
        if (err) {
            return callback(new VError(err, 'failed to insert a new person'));
        }

        debug('Inserted new person. Id: %s', result.id);

        person.id = result.id;

        callback(null, person);
    }

    this.$db.post(person, onInsert);
};

/**
 * Find all persons.
 *
 * @param {function} callback
 * Will be executed when a list with all persons has been prepared. Executed as
 * `callback(err, persons`.
 *
 */
PersonDAO.prototype.findAll = function findAll (callback) {
    var query = {select: '*', where: 'type=\'' + this.$type + '\''};

    function onFind (err, results) {
        if (err) {
            return callback(new VError(err, 'failed to search for all persons.'));
        }

        callback(null, results.rows);
    }

    this.$db.gql(query, onFind);
};

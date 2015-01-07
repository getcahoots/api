/*
 * cahoots-backend-services
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

var debug = require('debug')('cahoots:backend:services:Person');
var mandatory = require('mandatory');
var VError = require('verror');

var daos = require('cahoots-backend-daos');

module.exports = function instantiate () {
    var service = new PersonService();

    return {
        save: service.save.bind(service),
        list: service.list.bind(service),
        find: service.find.bind(service)
    };
};

function PersonService () {

}

/**
 * Persists a person.
 *
 * @param {object} person
 * The person object that should be persisted.
 *
 * @param {function} callback
 * Will be executed when the person object has been stored. Executed as
 * `callback(err, person)`.
 *
 */
PersonService.prototype.save = function save (person, callback) {
    var dao = null;

    mandatory(person).is('object', 'Please define a person which should be saved.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    dao = daos('person');

    function onInsert (err, person) {
        if (err) {
            return callback(new VError(err, 'failed to persist a new person.'));
        }

        debug('save - Saved person: %j', person);

        callback(null, person);
    }

    dao.insert(person, onInsert);
};

/**
 * Method for finding persons.
 *
 * EARLY STAGE: Please note that it is only possible to search for
 * persons by id at the moment.
 *
 * @param {object} query
 * The query object, e.g. {id: 'foo'} -> Searches for a person with the
 * id 'foo'.
 *
 * @param {function} callback
 * Will be executed when a result has arrived. Executed as
 * `callback(err, person)` whereas `person` CAN be `undefined` when no
 * person has been found.
 *
 */
PersonService.prototype.find = function find (query, callback) {
    var dao = null;

    // TODO: Implement query functionality.

    mandatory(query).is('object', 'Please provide a proper query object.');

    function onFind (err, person) {
        if (err) {
            return callback(new VError(err, 'failed to find a person. Query: %j', query));
        }

        callback(null, person);
    }

    dao = daos('person');

    dao.findById(query.id, onFind);
};

/**
 * Lists all available persons.
 *
 * @param {function} callback
 * Will be executed as `callback(err, persons)`
 *
 */
PersonService.prototype.list = function list (callback) {
    var dao = null;

    mandatory(callback).is('function', 'Please define a proper callback function.');

    dao = daos('person');

    function onFindAll (err, persons) {
        if (err) {
            return callback(new VError(err, 'failed to list all persons.'));
        }

        debug('list - Found %d person(s).', persons.length);

        callback(null, persons);
    }

    dao.findAll(onFindAll);
};

/*
 * cahoots-api-storage
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

var debug = require('debug')('cahoots:api:storage');
var levelup = require('levelup');
var leveldown = require('leveldown');
var mandatory = require('mandatory');
var sublevel = require('level-sublevel');
var jsonquery = require('jsonquery');
var VError = require('verror');

var DB_PATH = process.env.CAHOOTS_DATABASE_PATH;

var database = {
    getInstance: (function init () {
        var instance = null;

        return function getInstance () {
            if (!instance) {
                debug('Create new LevelDB instance.');

                instance = levelup(DB_PATH, {
                    valueEncoding: 'json'
                });
            } else {
                debug('Return the existing LevelDB instance.');
            }

            return instance;
        };
    })()
};

var storage = module.exports = function storage (type) {
    var service = null;
    var db = null;

    mandatory(type).is('string', 'Please define a storage entity type.');

    //
    // Create a sublevel of the LevelDB instance and pass it to
    // the storage service. With this approach it is possible to abstract the
    // whole sublevel aspects away.
    //
    // TODO: The `sublevel` activation can be moved to `database.getInstance` when
    // https://github.com/dominictarr/level-sublevel/issues/78 has been closed.
    //
    db = sublevel(database.getInstance()).sublevel(type);

    service = new StorageService(db);

    return {
        insert: service.insert.bind(service),
        update: service.update.bind(service),
        remove: service.remove.bind(service),
        query: service.query.bind(service)
    };
};

/**
 * Function for destroying the whole storage layer.
 *
 * @param {function} callback
 * Will be executed when the storage layer and the respective database has
 * been destroyed. Executed as `callback(err)`.
 *
 */
storage.destroy = function destroy (callback) {
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onDestroy (err) {
        if (err) {
            return callback(new VError(err, 'failed to destroy the storage layer.'));
        }

        callback(null);
    }

    function onClose () {
        leveldown.destroy(DB_PATH, onDestroy);
    }

    database.getInstance()
        .once('closed', onClose)
        .close();
};

/**
 * The storage abstraction.
 *
 * @param {string} db
 * The database "connection" object.
 *
 */
function StorageService (db) {
    this.$db = db;
}

/**
 * @private
 *
 * Generates an id.
 *
 * @returns {string}
 *
 */
StorageService.prototype.$generateId = function $generateId () {
    var hrtime = process.hrtime();
    var shasum = crypto.createHash('sha1');
    var id = '';

    shasum.update([Date.now(), hrtime[0], hrtime[1], Math.ceil(Math.random() * 10000)].join(''));
    id = shasum.digest('hex');

    debug('Created id: %s', id);

    return id;
};

/**
 * Inserts a data record.
 *
 * Please note that the data record will provide an attribute `id` afterwards.
 *
 * @param {object} record
 * The record which should be inserted.
 *
 * @param {function} callback
 * Will be executed when done as `callback(err, record)`.
 *
 */
StorageService.prototype.insert = function insert (record, callback) {
    var self = this;

    mandatory(record).is('object', 'Please provide a proper "' + this.$type + '" record.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onInsert (err) {
        if (err) {
            return callback(new VError(err, 'failed to insert %s: %s', self.$type, record));
        }

        callback(null, record);
    }

    record.id = this.$generateId();

    this.$db.put(record.id, record, onInsert);
};

/**
 * Possibility to update a data record.
 * Please note that the record has to be persisted before you are able to
 * update it with the help of this method.
 *
 * @param {object} record
 * The data record which should be updated.
 *
 * @param {function} callback
 * Will be executed when done as `callback(err, record)`.
 *
 */
StorageService.prototype.update = function update (record, callback) {
    var self = this;

    mandatory(record).is('object', 'Please provide a proper data record which should be updated.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    if (!record.id) {
        return process.nextTick(function onTick () {
            var err = new VError('failed to update the record. The record does not have an id and therefore does not exist.');
            err.type = 'NotFoundError';

            callback(err);
        });
    }

    function onFind (err, found) {
        if (err) {
            return callback(new VError(err, 'failed to search for the record before updating it.'));
        }

        if (found.length === 0) {
            err = new VError('unable to update a non-existing record.');
            err.type = 'NotFoundError';

            return callback(err);
        }

        self.$db.put(record.id, record, onUpdate);
    }

    function onUpdate (err) {
        if (err) {
            return callback(new VError(err, 'failed to update the record.'));
        }

        callback(null, record);
    }

    this.query({id: record.id}, onFind);
};

/**
 * Remove a data record from the store.
 *
 * @param {string} id
 * The id of the data record which should be removed.
 *
 * @param {function} callback
 * Will be executed when done as `callback(err)`.
 *
 */
StorageService.prototype.remove = function remove (id, callback) {
    mandatory(id).is('string', 'Please provide the id of the record which should be removed.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onDelete (err) {
        if (err) {
            return callback(new VError(err, 'failed to delete the record with the id: %s', id));
        }

        callback(null);
    }

    this.$db.del(id, onDelete);
};

/**
 * Search for respective data records.
 *
 * @param {object} q
 * The query object, e.g.: {id: 'foo', name: 'bar'} Will search for all records
 * that have an id 'foo' and a name 'bar'.
 *
 * @param {function} callback
 * Will be executed when done as `callback(err, records)`.
 *
 */
StorageService.prototype.query = function query (q, callback) {
    var results = [];
    var strom = null;

    mandatory(q).is('object', 'Please provide a proper query object.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    function onData (record) {
        results.push(record);
    }

    function onError (err) {
        callback(new VError(err, 'failed to query the storage layer.'));
    }

    function onEnd () {
        callback(null, results);
    }

    strom = this.$db.createValueStream();

    // If an query has been defined -> pipe it through the 'jsonquery' module.
    if (Object.keys(q).length > 0) {
        strom = strom.pipe(jsonquery(q));
    }

    strom.on('data', onData)
        .once('error', onError)
        .once('end', onEnd);
};

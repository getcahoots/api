/*
 * @getcahoots/api
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

var debug = require('debug')('cahoots:api:v1:PersonsResource');

var provider = require('@getcahoots/provider')('official');

module.exports = function instantiate () {
    var resource = new PersonsResource();

    return [
        {
            method: 'GET',
            path: '/persons',
            handler: resource.list.bind(resource)
        },
        {
            method: 'GET',
            path: '/persons/:id',
            handler: resource.one.bind(resource)
        }
    ];
};

/**
 * The /persons resource.
 *
 */
function PersonsResource () {}

/**
 * GET /persons/:id
 *
 * Finds a person by id.
 *
 */
PersonsResource.prototype.one = function one (req, res) {
    var id = req.params.id;

    function onFindById (err, person) {
        if (err) {
            debug('Error while searching for a person with the id "%s": %j', id, err);

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!person) {
            debug('Tried to find the person with the id "%s". Not available.', id);

            return res.status(404).json({});
        }

        debug('Requested person with the id "%s".', id);

        res.status(200).json(person);
    }

    let service = provider('person');

    service.findById(id, onFindById);
};

/**
 * GET /persons
 *
 * Lists all available persons.
 *
 */
PersonsResource.prototype.list = function list (req, res) {
    function onFindAll (err, persons) {
        if (err) {
            debug('Error while requesting all persons: %j', err);

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!persons.length) {
            debug('Tried to find a list with all persons, but there are no persons.');

            return res.status(404).json(persons);
        }

        debug('Received all persons (Found: %d persons).', persons.length);

        res.status(200).json(persons);
    }

    let service = provider('person');

    debug('Request all persons ...');

    service.findAll(onFindAll);
};

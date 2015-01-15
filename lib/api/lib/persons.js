/*
 * cahoots-backend-api
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

var debug = require('debug')('cahoots:backend:api:PersonsResource');

var services = require('cahoots-backend-services');

module.exports = function instantiate () {
    var resource = new PersonsResource();

    return [
        {path: '/', method: 'GET', handler: resource.list.bind(resource)},
        {path: '/:id', method: 'GET', handler: resource.one.bind(resource)},
        {path: '/', method: 'POST', handler: resource.create.bind(resource)}
    ];
};

/**
 * The /persons resource.
 *
 */
function PersonsResource () {
    this.$service = services('person');
}

/**
 * POST /persons
 *
 * Stores a new person.
 *
 */
PersonsResource.prototype.create = function create (req, res) {
    var person = req.body;

    function onSave (err, person) {
        if (err) {
            debug('Error while saving a new person: %j', err);
            return res.status(500);
        }

        res.status(201).json(person);
    }

    this.$service.save(person, onSave);
};

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

            return res.status(500);
        }

        if (!person) {
            return res.status(404);
        }

        res.status(200).json(person);
    }

    this.$service.findById(id, onFindById);
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

            return res.status(500);
        }

        if (!persons.length) {
            return res.status(404).json(persons);
        }

        res.status(200).json(persons);
    }

    this.$service.findAll(onFindAll);
};

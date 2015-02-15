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

var debug = require('debug')('cahoots:api:PersonsResource');

var services = require('cahoots-api-services');
var schemes = require('cahoots-api-schemes');
var validator = require('cahoots-api-validator');

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
        },
        {
            method: 'POST',
            path: '/persons',
            handler: resource.insert.bind(resource)
        }
    ];
};

/**
 * The /persons resource.
 *
 */
function PersonsResource () {
    this.$service = services('person');
    this.$schema = schemes('person');
}

/**
 * POST /persons
 *
 * Stores a new person.
 *
 */
PersonsResource.prototype.insert = function insert (req, res) {
    var self = this;
    var person = req.body;
    var schema = this.$schema.insert;

    function onValidation (err) {
        if (err) {
            debug('Validation of person (insert) failed: %j', err);
            return res.status(400).send(http.STATUS_CODES[400]);
        }

        self.$service.save(person, onSave);
    }

    function onSave (err, person) {
        if (err) {
            debug('Error while saving a new person: %j', err);
            return res.status(500).send(http.STATUS_CODES[500]);
        }

        res.status(201).json(person);
    }

    validator(schema).check(person, onValidation);
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

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!person) {
            return res.status(404).json({});
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

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!persons.length) {
            return res.status(404).json(persons);
        }

        res.status(200).json(persons);
    }

    this.$service.findAll(onFindAll);
};

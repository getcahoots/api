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

var services = require('cahoots-backend-services');

module.exports = function instantiate () {
    var resource = new PersonsResource();

    return [
        {path: '/', method: 'GET', handler: resource.list.bind(resource)},
        {path: '/', method: 'POST', handler: resource.create.bind(resource)},
    ];
};

/**
 * The /persons resource.
 *
 */
function PersonsResource () {}

/**
 * POST /persons
 *
 * Stores a new person.
 *
 */
PersonsResource.prototype.create = function create (req, res) {
    var service = services('person');
    var person = req.body;

    function onSave (err, person) {
        if (err) {
            return res.status(500);
        }
        
        res.status(201).json(person);
    }
    
    service.save(person, onSave);
};

/**
 * GET /list
 *
 * Lists all available persons.
 *
 */
PersonsResource.prototype.list = function list (req, res) {
    var service = services('person');

    function onList (err, persons) {
        if (err) {
            return res.status(500);
        }

        res.status(200).json(persons);
    }

    service.list(onList);
};

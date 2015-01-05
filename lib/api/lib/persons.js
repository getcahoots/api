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
        {path: '/', method: 'GET', handler: resource.list.bind(resource)}
    ];
};

function PersonsResource () {}

PersonsResource.prototype.list = function list (req, res) {
    var service = services('person');

    function onList (err, persons) {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(persons);
    }

    service.list(onList);
};

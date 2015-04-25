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

var debug = require('debug')('cahoots:api:v1:OrganizationsResource');

var provider = require('@getcahoots/provider')('official');

module.exports = function instantiate () {
    var resource = new OrganizationsResource();

    return [
        {
            method: 'GET',
            path: '/organizations',
            handler: resource.list.bind(resource)
        },
        {
            method: 'GET',
            path: '/organizations/:id',
            handler: resource.one.bind(resource)
        }
    ];
};

/**
 * The /organizations resource.
 *
 */
function OrganizationsResource () {}

/**
 * GET /organizations/:id
 *
 * Finds an organization by id.
 *
 */
OrganizationsResource.prototype.one = function one (req, res) {
    var id = req.params.id;

    function onFindById (err, organization) {
        if (err) {
            debug('Error while request the organization with the id "%s": %j', id, err);

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!organization) {
            return res.status(404).json({});
        }

        debug('Found one organization by id "%s": %j', id, organization);

        res.status(200).json(organization);
    }

    let service = provider('organization');

    service.findById(id, onFindById);
};

/**
 * GET /organizations[?ids=id0, id2]
 *
 * Lists all available organizations or organizations by an array of ids.
 *
 */
OrganizationsResource.prototype.list = function list (req, res) {
    var ids = req.query.ids;

    var service = provider('organization');

    function onFind (err, organizations) {
        if (err) {
            debug('Error while requesting organizations: %j', err);

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!organizations.length) {
            return res.status(404).json(organizations);
        }

        debug('Found %d organization(s).', organizations.length);

        res.status(200).json(organizations);
    }

    if (ids) {
        ids = ids.split(',');

        debug('Requested organizations by specific ids: %s', ids);

        return service.findByIds(ids, onFind);
    }

    service.findAll(onFind);
};

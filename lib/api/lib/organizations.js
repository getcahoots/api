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

var debug = require('debug')('cahoots:backend:api:OrganizationsResource');

var services = require('cahoots-backend-services');

module.exports = function instantiate () {
    var resource = new OrganizationsResource();

    return [
        {path: '/', method: 'GET', handler: resource.list.bind(resource)},
        {path: '/:id', method: 'GET', handler: resource.one.bind(resource)},
        {path: '/', method: 'POST', handler: resource.create.bind(resource)}
    ];
};

/**
 * The /organizations resource.
 *
 */
function OrganizationsResource () {
    this.$service = services('organization');
}

/**
 * POST /organizations
 *
 * Persists a new organization.
 *
 */
OrganizationsResource.prototype.create = function create (req, res) {
    var organization = req.body;

    function onSave (err, organization) {
        if (err) {
            debug('Error while saving a new organization: %j', err);

            return res.status(500);
        }

        res.status(201).json(organization);
    }

    this.$service.save(organization, onSave);
};

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

            return res.status(500);
        }

        if (!organization) {
            return res.status(404);
        }

        res.status(200).json(organization);
    }

    this.$service.findById(id, onFindById);
};

/**
 * GET /organizations[?ids=id0, id2]
 *
 * Lists all available organizations or organizations by an array of ids.
 *
 */
OrganizationsResource.prototype.list = function list (req, res) {
    var ids = req.query.ids;

    function onFind (err, organizations) {
        if (err) {
            debug('Error while requesting organizations: %j', err);

            return res.status(500);
        }

        if (!organizations.length) {
            return res.status(404).json(organizations);
        }

        res.status(200).json(organizations);
    }

    if (ids && ids.indexOf(',') !== -1) {
        ids = ids.split(',');

        return this.$service.findByIds(ids, onFind);
    }

    this.$service.findAll(onFind);
};

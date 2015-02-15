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

var debug = require('debug')('cahoots:api:OrganizationsResource');

var services = require('cahoots-api-services');
var schemes = require('cahoots-api-schemes');
var validator = require('cahoots-api-validator');

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
        },
        {
            method: 'POST',
            path: '/organizations',
            handler: resource.insert.bind(resource)
        }
    ];
};

/**
 * The /organizations resource.
 *
 */
function OrganizationsResource () {
    this.$service = services('organization');
    this.$schema = schemes('organization');
}

/**
 * POST /organizations
 *
 * Persists a new organization.
 *
 */
OrganizationsResource.prototype.insert = function insert (req, res) {
    var self = this;
    var organization = req.body;
    var schema = this.$schema.insert;

    function onValidation (err) {
        if (err) {
            debug('Validation failed. Insert of organization impossible: %j', err);
            return res.status(400).send(http.STATUS_CODES[400]);
        }

        self.$service.save(organization, onSave);
    }

    function onSave (err, organization) {
        if (err) {
            debug('Error while saving a new organization: %j', err);

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        res.status(201).json(organization);
    }

    validator(schema).check(organization, onValidation);
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

            return res.status(500).send(http.STATUS_CODES[500]);
        }

        if (!organization) {
            return res.status(404).json({});
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

            return res.status(500).send(http.STATUS_CODES[500]);
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

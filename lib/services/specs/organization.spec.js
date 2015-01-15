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

var services = require('../');
var expect = require('expect.js');

var utils = require('./utils');

describe('The OrganizationService', function suite () {

    beforeEach(utils.clearDatabase);

    it('should be able to save a new organization', function test (done) {
        var service = services('organization');
        var organization = {};

        organization.name = 'André König';
        organization.info = 'http://andrekoenig.info';
        organization.src = 'http://andrekoenig.info';

        function onSave (err, org) {
            expect(err).to.be(null);

            expect(org.id).not.to.be(undefined);
            expect(org.id.length).to.be(40);

            service.findAll(onFindAll);
        }

        function onFindAll (err, organizations) {
            expect(err).to.be(null);

            expect(organizations.length).to.be(1);

            done();
        }

        service.save(organization, onSave);
    });

    it('should be able to update an organisation', function test (done) {
        var service = services('organization');
        var organization = {};
        var id = '';

        organization.name = 'André König';
        organization.info = 'http://andrekoenig.info';
        organization.src = 'http://andrekoenig.info';

        function onSave (err, org) {
            org.src = 'http://caiifr.de';

            id = org.id;

            service.save(org, onUpdate);
        }

        function onUpdate (err, org) {
            expect(err).to.be(null);
            expect(org.src).to.be('http://caiifr.de');

            expect(org.id).to.be(id);

            service.findAll(onFindAll);
        }

        function onFindAll (err, organizations) {
            expect(err).to.be(null);

            expect(organizations.length).to.be(1);

            done();
        }

        service.save(organization, onSave);
    });

    it('should be able to list all organizations', function test (done) {
        var service = services('organization');

        var organization = {
            name: 'André',
            info: 'http://andrekoenig.info',
            src: 'http://andrekoenig.info'
        };

        function onSave0 (err) {
            expect(err).to.be(null);

            // Delete the created id in order to create a second organization.
            delete organization.id;

            service.save(organization, onSave1);
        }

        function onSave1 (err) {
            expect(err).to.be(null);

            service.findAll(onList);
        }

        function onList (err, organizations) {
            expect(err).to.be(null);

            expect(organizations.length).to.be(2);

            done();
        }

        service.save(organization, onSave0);
    });

    it('should be able to find an organizations by id.', function test (done) {
        var service = services('organization');
        var organization = {
            name: 'André',
            info: 'http://andrekoenig.info',
            src: 'http://andrekoenig.info'
        };

        function onSave (err, organization) {
            service.findById(organization.id, onFind);
        }

        function onFind (err, org) {
            expect(organization.id).to.be(org.id);
            expect(organization.name).to.be(org.name);
            expect(organization.info).to.be(org.info);
            expect(organization.src).to.be(org.src);

            done();
        }

        service.save(organization, onSave);
    });

    it('should be able to find organizations by multiple ids', function test (done) {
        var ids = [];
        var MAX = 20;
        var service = services('organization');
        var runs = 0;

        var organization = {
            name: 'André',
            info: 'http://andrekoenig.info',
            src: 'http://andrekoenig.info'
        };

        function onSave (err, organization) {
            if (ids.length !== MAX) {
                ids.push(organization.id);
            }

            delete organization.id;

            if (runs === 100) {
                return service.findByIds(ids, onFindByIds);
            }

            runs = runs + 1;

            service.save(organization, onSave);
        }

        function onFindByIds (err, organizations) {
            expect(err).to.be(null);
            expect(organizations.length).to.be(MAX);

            done();
        }

        service.save(organization, onSave);
    });

    it('should return an empty array when no organization has been found (search by multiple ids).', function test (done) {
        var service = services('organization');

        function onFind (err, organizations) {
            expect(err).to.be(null);
            expect(organizations.length).to.be(0);

            done();
        }

        service.findByIds(['foo', 'bar', 'zoo'], onFind);
    });

    it('should return an empty result when the organization does not exist', function test (done) {
        var service = services('organization');

        function onFind (err, organization) {
            expect(organization).to.be(undefined);

            done();
        }

        service.findById('foo', onFind);
    });
});

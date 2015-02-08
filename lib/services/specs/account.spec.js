/*
 * cahoots-api-services
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

describe('The AccountService', function suite () {

    beforeEach(utils.clearDatabase);

    it('should be able to register a new account', function test (done) {
        var service = services('account');

        var account = {
            firstName: 'André',
            lastName: 'König',
            email: 'akoenig@posteo.de',
            password: 'test123'
        };

        function onRegister (err, registeredAccount) {
            expect(err).to.be(null);
            expect(registeredAccount.id).not.to.be(undefined);
            expect(registeredAccount.password).to.be(undefined);
            expect(registeredAccount.salt).to.be(undefined);

            expect(registeredAccount.firstName).to.be(account.firstName);
            expect(registeredAccount.lastName).to.be(account.lastName);
            expect(registeredAccount.email).to.be(account.email);

            done();
        }

        service.register(account, onRegister);
    });

    it('should not be able to register a second account with the same email address', function test (done) {
        var service = services('account');

        var account = {
            email: 'akoenig@posteo.de',
            password: 'test123'
        };

        function onRegister0 (err) {
            expect(err).to.be(null);

            service.register(account, onRegister1);
        }

        function onRegister1 (err) {
            expect(err).not.to.be(null);

            done();
        }

        service.register(account, onRegister0);
    });

    it('should be able to verify login credentails', function test (done) {
        var service = services('account');

        var account = {
            firstName: 'André',
            lastName: 'König',
            email: 'akoenig@posteo.de',
            password: 'test123'
        };

        function onLogin (err, loggedInAccount) {
            expect(err).to.be(null);

            expect(loggedInAccount.id).not.to.be(undefined);
            expect(loggedInAccount.password).to.be(undefined);
            expect(loggedInAccount.salt).to.be(undefined);

            expect(loggedInAccount.email).to.be(account.email);

            done();
        }

        function onRegister (err) {
            expect(err).to.be(null);

            service.authenticate(account.email, account.password, onLogin);
        }

        service.register(account, onRegister);
    });

    it('should be able to find a particular account by email address', function test (done) {
        var service = services('account');

        var account = {
            firstName: 'André',
            lastName: 'König',
            email: 'akoenig@posteo.de',
            password: 'test123'
        };

        function onFind (err, found) {
            expect(err).to.be(null);
            expect(found).not.to.be(undefined);
            expect(found.firstName).to.be(account.firstName);

            done();
        }

        function onRegister (err) {
            expect(err).to.be(null);

            service.findByEmail(account.email, onFind);
        }

        service.register(account, onRegister);
    });

    it('should return a falsy value when the account could not be found', function test (done) {
        var service = services('account');

        function onFind (err, account) {
            expect(err).to.be(null);
            expect(account).to.be(undefined);

            done();
        }

        service.findByEmail('foo@bar.de', onFind);
    });

    it('should be able to find all accounts', function test (done) {
        var service = services('account');

        var account = {
            email: 'akoenig@posteo.de',
            password: 'test123'
        };

        function onRegister0 (err) {
            expect(err).to.be(null);

            account.email = 'andre.koenig@posteo.de';

            service.register(account, onRegister1);
        }

        function onRegister1 (err) {
            expect(err).to.be(null);

            service.findAll(onFind);
        }

        function onFind (err, accounts) {
            expect(err).to.be(null);
            expect(accounts.length).to.be(2);

            done();
        }

        service.register(account, onRegister0);
    });
});

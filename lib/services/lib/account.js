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

var crypto = require('crypto');

var debug = require('debug')('cahoots:api:services:Account');
var mandatory = require('mandatory');
var clone = require('lodash.clone');
var omit = require('lodash.omit');
var VError = require('verror');

var storage = require('cahoots-api-storage');

const SALT_LENGTH = process.env.SALT_LENGTH || 2048;

module.exports = function instantiate () {
    var service = new AccountService();

    return {
        register: service.register.bind(service),
        authenticate: service.authenticate.bind(service),
        findAll: service.findAll.bind(service),
        findByEmail: service.findByEmail.bind(service),
        findSuperuser: service.findSuperuser.bind(service)
    };
};

function AccountService () {
    this.$dao = storage('account');
}

/**
 * @private
 *
 * Generates a hash value out of a given password / salt combination.
 *
 * @param {string} password
 * @param {string} salt
 *
 * @returns {string} The generated hash
 *
 */
AccountService.prototype.$hash = function $hash (password, salt) {
    var hash = crypto.createHmac('sha512', salt);

    hash.update(password + salt);

    return hash.digest('hex');
};

/**
 * @private
 *
 * Generates a random cryptographic salt.
 *
 * @returns {string} The generated salt.
 *
 */
AccountService.prototype.$createSalt = function $createSalt () {
    return crypto.randomBytes(SALT_LENGTH).toString('hex');
};

/**
 * Sanitizes an account object by removing sensible information
 * like salts, passwords, etc.
 *
 * @param {object} account
 * The account object that should be sanitized.
 *
 * @returns {object}
 * The sanitized account object.
 *
 */
AccountService.prototype.$sanitize = function $sanitize (account) {
    var ommittables = ['password', 'salt'];

    return omit(account, ommittables);
};

/**
 * Registers the given account.
 *
 * Please note that this method will check if the user exists before registering it.
 *
 * @param {object} account
 * The account which should be registered (attributes `email` and `password` are mandatory).
 *
 * @param {function} callback
 * Will be executed as `callback(err, account)` whereas `account` will contain a valid
 * ID when the registration process has been successful.
 *
 */
AccountService.prototype.register = function register (account, callback) {
    var self;

    mandatory(account).is('object', 'Please provide the account object that should be registered.');
    mandatory(account.email).is('string', 'Please provide an account email address.');
    mandatory(account.password).is('string', 'Please provide an account password.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    self = this;

    // Create a new object with the values of the old account object.
    // Prevents that extending the original object causes security problems due to `passing by reference`.
    // Those security problems could be: exposing salts, etc.
    account = clone(account);

    account.salt = this.$createSalt();
    account.salt = this.$hash(account.salt, account.salt);
    account.password = this.$hash(account.password, account.salt);

    function onFind (err, found) {
        if (found) {
            return callback(new VError('unable to register an account with an existing email address.'));
        }

        self.$dao.insert(account, onInsert);
    }

    function onInsert (err, account) {
        if (err) {
            return callback(new VError(err, 'failed to register the account.'));
        }

        account = self.$sanitize(account);

        debug('Registered new account %j', account);

        callback(null, account);
    }

    this.findByEmail(account.email, onFind);
};

/**
 * Checks the account's login credentials.
 *
 * @param {string} email
 * The account's email address.
 *
 * @param {string} password
 * The plain text password.
 *
 * @param {function} callback
 * Will be executed as `callback(err, account)` whereas `account` will be
 * the complete account object after a successful authentication.
 *
 */
AccountService.prototype.authenticate = function authenticate (email, password, callback) {
    var self;

    mandatory(email).is('string', 'Please provide an email address.');
    mandatory(password).is('string', 'Please provide a password.');
    mandatory(callback).is('function', 'Please provide a proper callback function.');

    self = this;

    function onFind (err, accounts) {
        var account = {};

        if (err) {
            return callback(new VError(err, 'unable to find the account by email address "%s"', email));
        }

        if (accounts.length > 1) {
            return callback(new VError('Hm. Found multiple accounts with the email address "%s" that should not be possible.', email));
        }

        account = accounts[0];

        //
        // Acount not found. Same as wrong credentials.
        //
        if (!account) {
            return callback(null);
        }

        password = self.$hash(password, account.salt);

        if (password !== account.password) {
            return callback(null);
        }

        account = self.$sanitize(account);

        callback(null, account);
    }

    this.$dao.query({email: email}, onFind);
};

/**
 * Finds all available accounts.
 *
 * @param {function} callback
 * Will be executed as `callback(err, accounts)` whereas `accounts` will be an array
 * with all available account object.
 *
 */
AccountService.prototype.findAll = function findAll (callback) {
    var self = this;

    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onFindAll (err, accounts) {
        if (err) {
            return callback(new VError(err, 'failed to find all accounts'));
        }

        for (let i = 0; i < accounts.length; i = i + 1) {
            accounts[i] = self.$sanitize(accounts[i]);
        }

        callback(null, accounts);
    }

    this.$dao.query({}, onFindAll);
};

/**
 * Finds one particular account by a given email address.
 *
 * @param {string} email
 * The email address of the account which should be found.
 *
 * @param {function} callback
 * Will be executed as `callback(err, account)` whereas `account` can be the
 * respective account object or `undefined`.
 *
 */
AccountService.prototype.findByEmail = function findByEmail (email, callback) {
    var self;

    mandatory(email).is('string', 'Please define the user\'s email address.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    self = this;

    function onFind (err, accounts) {
        var account = {};

        if (err) {
            return callback(new VError(err, 'failed to search for an account by email address: %j', email));
        }

        if (accounts.length > 1) {
            return callback(new VError('Hm. Found multiple accounts with the email address "%s" that should not be possible.', email));
        }

        account = accounts[0];

        if (account) {
            account = self.$sanitize(account);
        }

        callback(null, account);
    }

    this.$dao.query({email: email}, onFind);
};

/**
 * Finds the one and only superuser.
 *
 * @param {function} callback
 * Will be executed as `callback(err, superuser)` whereas `superuser` can be the
 * respective superuser account object or `undefined`.
 *
 */
AccountService.prototype.findSuperuser = function findSuperuser (callback) {
    var self;

    mandatory(callback).is('function', 'Please define a proper callback function.');

    self = this;

    function onFind (err, superusers) {
        var account = {};

        if (err) {
            return callback(new VError(err, 'failed to search for the superuser.'));
        }

        if (superusers.length > 1) {
            return callback(new VError('Hm. Found multiple superusers. That is insane! Should be impossible!'));
        }

        account = superusers[0];

        if (account) {
            account = self.$sanitize(account);
        }

        callback(null, account);
    }

    this.$dao.query({superuser: true}, onFind);
};

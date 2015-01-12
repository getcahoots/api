/*
 * cahoots-backend-storage
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

//
// Environment variables for DAO layer configuration.
//
process.env.CAHOOTS_DATABASE_PATH = process.env.CAHOOTS_DATABASE_PATH || require('path').join(process.cwd(), 'database');

module.exports = require('./lib/');

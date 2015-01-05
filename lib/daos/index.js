/*
 * cahoots-backend-daos
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
process.env.DATABASE_URL = process.env.DATABASE_URL || require('path').join(process.cwd(), 'database');

module.exports = require('./lib/');

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

var resources = {
    organizations: require('./organizations'),
    persons: require('./persons')
};

module.exports = function instantiate () {
    var all = [];

    for (let resource in resources) {
        let routes = resources[resource]();

        Array.prototype.push.apply(all, routes);
    }

    return all;
};

/* Chèch Lajan
 *
 * /routes/api/dev.js - express routes for dev api calls
 *
 * started @ 03/11/14
 */

"use strict";

var root = __dirname + "/../..";

var api = require( root + "/core/middlewares/api.js" );

// [get] /api/ping
var doPing = function( oRequest, oResponse ) {
    api.send( oRequest, oResponse, true );
};

// Declare routes
exports.init = function( oApp ) {
    oApp.get( "/api/ping", doPing );
};

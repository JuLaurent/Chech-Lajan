/* Chèch Lajan
 *
 * /core/express.js - express setup
 *
 * started @ 03/11/14
 */

"use strict";

var root = __dirname + "/..";

// retreive configuration
var pkg = require( root + "/../package.json" );

// require stuffs

var express = require( "express" ),
    bodyParser = require( "body-parser" ),
    oMiddlewares = require( root + "/core/middlewares/web.js" );

var oApp = express();

// setup default middlewares (to handle POST requests)
oApp.use( bodyParser.json() );
oApp.use( bodyParser.urlencoded( { extended: true } ) );

// setup log middleware
oApp.use( oMiddlewares.log );

// Configure static files (usualy handled by nginx)
oApp.use( express.static( root + "/../static" ) );

// Set up jade template engine
oApp.set( "view engine", "jade" );
oApp.set( "views", root + "/views" );
oApp.locals.pretty = !pkg.config.express.cache;
oApp.set( "view cache", pkg.config.express.cache );

// require routes
require( root + "/routes/pages.js" ).init( oApp );
require( root + "/routes/api/dev.js" ).init( oApp );
require( root + "/routes/api/banks.js" ).init( oApp );
require( root + "/routes/api/terminals.js" ).init( oApp );

oApp.listen( pkg.config.express.port );

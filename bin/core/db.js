/* Chèch Lajan
 *
 * /core/db.js - MongoDB management singleton
 *
 * started @ 10/11/14
 */

"use strict";

var root = __dirname + "/..";

var Mongoose = require( "mongoose" ),
    MongooseUtils = require( root + "/core/db/utils.js" ),
    pkg = require( root + "/../package.json" );

var oSettings = pkg.config.mongodb;

// Connect to the db server

Mongoose.connect( "mongodb://" + oSettings.host + ":" + oSettings.port + "/" + oSettings.base );

// Init & store connection

var db = Mongoose.connection;
db.on( "error", function() {
    console.error( "MongoDB/Mongoose connection error." );
} );

Mongoose.set( "debug", oSettings.log );

// Declare & instantiate models

var aModels = [
    "Bank",
    "Terminal"
];

var oModels = {};
aModels.forEach( function( sModelName ) {
    var tmpModel = require( root + "/models/" + sModelName.toLowerCase() + ".js" )( db, Mongoose, MongooseUtils );
    oModels[ sModelName ] = tmpModel;
} );

// Exporting instance

exports.instance = db;

// model getter

exports.get = function( sModelName ) {
    return oModels[ sModelName ] || false;
};

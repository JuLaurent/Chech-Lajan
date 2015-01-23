/* Chèch Lajan
 *
 * /routes/api/banks.js - express routes for banks api calls
 *
 * started @ 10/11/14
 */

"use strict";

var root = __dirname + "/../..";

var api = require( root + "/core/middlewares/api.js" ),
    db = require( root + "/core/db.js" );

var Bank = db.get( "Bank" );

// [GET] /api/banks

var list = function( oRequest, oResponse ) {
    Bank
        .find()
        .sort( "name" )
        .exec( function( oError, aBanks ) {
            var aCleanedBanks = [];
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !aBanks ) {
                aBanks = [];
            }
            aBanks.forEach( function( oBank ) {
                aCleanedBanks.push( oBank.clean() );
            } );
            api.send( oRequest, oResponse, aCleanedBanks );
        } );
};

// [GET] /api/banks/:id

var detail = function( oRequest, oResponse ) {
    Bank
        .findById( oRequest.params.id )
        .exec( function( oError, oBank ) {
            if( oError ) {
                return api.error( oRequest, oResponse, oError.type, oError );
            }
            if( !oBank ) {
                return api.error( oRequest, oResponse, "BANK_UNKNOWN", new Error( "BANK_UNKNOWN" ) );
            }
            api.send( oRequest, oResponse, oBank.clean() );
        } );
};

// Declare routes
exports.init = function( oApp ) {
    oApp.get( "/api/banks", list );
    oApp.get( "/api/banks/:id", detail );
};

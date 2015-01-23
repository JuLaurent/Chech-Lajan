/* Chèch Lajan
 *
 * /core/middlewares/web.js - web express middlewares
 *
 * started @ 03/11/14
 */

"use strict";

exports.log = function( oRequest, oResponse, fNext ) {
    console.log( "(" + oRequest.method + ") " + oRequest.url );
    fNext();
};

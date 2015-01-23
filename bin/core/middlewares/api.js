/* Chèch Lajan
 *
 * /core/middlewares/api.js - api express middlewares (end-point)
 *
 * started @ 03/11/14
 */

"use strict";

// send() - send a json with data to the client, for successful requests.
exports.send = function( oRequest, oResponse, mData ) {
    oResponse.json( {
        url: "[" + oRequest.method + "] " + oRequest.originalUrl,
        timestamp: ( new Date() ).getTime(),
        error: false,
        data: mData
    } );
};

// error() - send a json with error message to the client, for errored requests.
exports.error = function( oRequest, oResponse, sMessage, mErrorData ) {
    oResponse.json( {
        url: "[" + oRequest.method + "] " + oRequest.originalUrl,
        timestamp: ( new Date() ).getTime(),
        data: null,
        error: {
            type: sMessage,
            data: mErrorData
        }
    } );
};

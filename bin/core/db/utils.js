/* Chèch Lajan
 *
 * /core/db/utils.js - Mongoose utils for Schema & Models
 *
 * started @ 10/11/14
 */

"use strict";

// Mongoose paranoid plugin
// Implementation of the paranoid behaviour for Mongoose : add 3 date properties to the model, and never allow an effective delete.

exports.paranoid = function( oSchema ) {

    oSchema.set( "autoIndex", false );

    oSchema.add( {
        "createdAt": {
            "type": Date,
            "default": Date.now
        },
        "updatedAt": {
            "type": Date,
            "default": Date.now
        },
        "deletedAt": {
            "type": Date,
            "default": null
        }
    } );

    // The method will execute before each instance save
    oSchema.pre( "save", function( fNext ) {
        if( !this.createdAt ) {
            this.createdAt = new Date();
        }
        this.updatedAt = new Date();
        fNext();
    } );

    // This method will override the destroy method, disallowing the complete deletion of an instance
    oSchema.methods.destroy = function( fNext ) {
        this.deletedAt = new Date();
        this.save( fNext );
    };

    oSchema.virtual( "deleted" ).get( function() {
        return !!this.deletedAt;
    } );

};
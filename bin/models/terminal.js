/* Chèch Lajan
 *
 * /models/terminal.js - Terminals MongoDB Model
 *
 * started @ 10/11/14
 */

"use strict";

var root = __dirname + "/..";

var distance = require( "jeyo-distans" );

module.exports = function( db, Mongoose, MongooseUtils ) {

    var oSchema = Mongoose.Schema( {
        "latitude": {
            "type": Number
        },
        "longitude": {
            "type": Number
        },
        "address": {
            "type": String
        },
        "empty": {
            "type": Boolean,
            "default": false
        },
        "bank": {
            "type": Mongoose.Schema.Types.ObjectId,
            "ref": "Bank"
        }
    } );

    oSchema.plugin( MongooseUtils.paranoid );

    oSchema.methods.clean = function( oPosition ) {
        // cleaning empty state
        if( this.empty ) {
            if( this.updatedAt.getDate() !== ( new Date() ).getDate() ) {
                this.empty = false;
                this.save();
            }
        }
        return {
            "id": this.id,
            "date": this.createdAt,
            "latitude": this.latitude,
            "longitude": this.longitude,
            "address": this.address,
            "empty": this.empty,
            "distance": oPosition ? distance( oPosition, this ) : null,
            "bank": ( this.bank && typeof this.bank.clean === "function" ) ? this.bank.clean() : this.bank
        };
    };

    return db.model( "Terminal", oSchema );

};

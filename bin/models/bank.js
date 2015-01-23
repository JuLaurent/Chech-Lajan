/* Chèch Lajan
 *
 * /models/bank.js - Banks MongoDB Model
 *
 * started @ 10/11/14
 */

"use strict";

var root = __dirname + "/..";

module.exports = function( db, Mongoose, MongooseUtils ) {

    var oSchema = Mongoose.Schema( {
        "name": {
            "type": String
        },
        "color": {
            "type": String
        },
        "icon": {
            "type": String
        },
        "url": {
            "type": String
        },
        "country": {
            "type": String
        }
    } );

    oSchema.plugin( MongooseUtils.paranoid );

    oSchema.methods.clean = function() {
        return {
            "id": this.id,
            "date": this.createdAt,
            "name": this.name,
            "color": this.color,
            "icon": this.icon,
            "url": this.url
        };
    };

    return db.model( "Bank", oSchema );

};

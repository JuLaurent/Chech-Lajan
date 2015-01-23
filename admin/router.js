/* Chèch Lajan
 *
 * /router.js - backbone admin router
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    jeolok = require( "jeolok" );

Backbone.$ = require( "jquery" );

var AdminMainView = require( "./views/main" );
var AdminHeaderView = require( "./views/header" );
var AdminMapView = require ( "./views/map" );

var TerminalsCollection = require( "./collections/terminals" );
var TerminalModel = require( "./models/terminal" );

var oPosition;

module.exports = Backbone.Router.extend( {

    "views": {},

    "routes": {
        "admin": "showAdminMap",
        "admin/map": "showAdminMap"
    },

    "start": function() {
        console.log( "AdminRouter:started" );

        // 1. define & init views
        ( this.views.main = new AdminMainView() ).render();
        this.views.main.initAdminHeader( ( this.views.header = new AdminHeaderView() ).render() );

        // 2. get geoposition of user
        jeolok.getCurrentPosition( { "enableHighAccuracy": true, "timeout": 500 }, function( oError, oGivenPosition ) {
            if( oError || !oGivenPosition ) {
                oPosition = {
                    latitude: 50.84275,
                    longitude: 4.35154
                };
            } else {
                oPosition = oGivenPosition.coords;
            }
            window.app.currentPosition = oPosition;
            // 3. launch router
            Backbone.history.start( {
                "pushState": true
            } );
        } );
    },

    "showAdminMap": function() {
        console.log( "showAdminMap" );

        var that = this;
        this.views.main.loading( true );
        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.map = new AdminMapView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    "data": {
                        "latitude": oPosition.latitude,
                        "longitude": oPosition.longitude
                    },
                    "success": function() {
                        that.views.main.clearContent();
                        that.views.main.initAdminMap( that.views.map.render() );
                        that.views.main.loading( false, "Distributeurs dans un rayon de " );
                    }
                } );
    },

} );
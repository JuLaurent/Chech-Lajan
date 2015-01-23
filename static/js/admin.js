(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Chèch Lajan
 *
 * /app.js - admin entry point
 *
 * started @ 03/12/14
 */

"use strict";

var $ = require( "jquery" ),
    FastClick = require( "fastclick" ),
    router = require( "./router" );

window.app.now = new Date();

$( function() {
    FastClick( document.body );

    window.app.router = new router();
    window.app.router.start();
} );

},{"./router":4,"fastclick":"fastclick","jquery":"jquery"}],2:[function(require,module,exports){
/* Chèch Lajan
 *
 * /collections/terminals.js - backbone collections for terminals
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" );

Backbone.$ = require( "jquery" );

module.exports = Backbone.Collection.extend( {

    "url": "/api/terminals",
    "model": require( "../models/terminal" ),

    "parse": function( oResponse ) {
        // TODO handle errors
        return oResponse.data;
    }

} );

},{"../models/terminal":3,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],3:[function(require,module,exports){
/* Chèch Lajan
*
* /models/terminal.js - backbone model for terminal
*
* started @ 12/12/14
*/

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" );

Backbone.$ = require( "jquery" );

module.exports = Backbone.Model.extend( {

    "urlRoot": "/api/terminals",

    "parse": function( oResponse ) {
        // TODO handle errors
        if( oResponse.data && oResponse.url ) {
            return oResponse.data;
        } else {
            return oResponse;
        }
    }

} );

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],4:[function(require,module,exports){
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
},{"./collections/terminals":2,"./models/terminal":3,"./views/header":5,"./views/main":6,"./views/map":7,"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/admin-header.js - backbone admin header view
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

var _tpl;

module.exports = Backbone.View.extend( {

    "el": "<div />",

    "constructor": function() {
        Backbone.View.apply( this, arguments );

        console.log( "AdminHeaderView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-header" ).remove().text();
        }
    },

    "events": {
        "click #reload": "reloadButtonClicked",
    },

    "render": function() {
        this.$el
            .html( _tpl )
            .find( "#back" )
                .hide()
                .end();

        this.$status = this.$el.find( "#status h3" );

        return this;
    },

    "loading": function( bLoadingState ) {
        this.$el.find( "#status" ).toggleClass( "loading", bLoadingState );
    },

    "getStatus": function() {
        return this.$status.text();
    },

    "setStatus": function( sText ) {
        this.$status.text( sText );
    },

    "reloadButtonClicked": function( e ) {
        e.preventDefault();
        console.log( "reloadButtonClicked" );
    },

} );

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],6:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/main.js - backbone main application view
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

module.exports = Backbone.View.extend( {

    "el": "body",
    "$el": $( "body" ),

    "constructor": function() {
        Backbone.View.apply( this, arguments );

        console.log( "AdminMainView:init()" );

        // TODO : define private accessors to subviews
    },

    "loading": function( bLoadingState, sNewStatus ) {
        if( bLoadingState ) {
            this._status = window.app.router.views.header.getStatus();
            window.app.router.views.header.loading( true );
            window.app.router.views.header.setStatus( sNewStatus || "chargement..." );
        } else {
            window.app.router.views.header.loading( false );
            window.app.router.views.header.setStatus( sNewStatus );
        }
    },

    "initAdminHeader": function( AdminHeaderView ) {
        this.$el.find( "#main" ).append( AdminHeaderView.$el );
    },

    "clearContent": function() {
        // cette methode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find( "#main section:not(#status)" ).remove();
    },

    "initAdminMap": function( AdminMapView ) {
        this.$el.find( "#main" ).append( AdminMapView.$el );
    },

} );

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/map.js - backbone admin map
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

var _tpl;

var TerminalElementView = require( "./terminals" );

module.exports = Backbone.View.extend( {

    "el": "<section />",

    "constructor": function( oTerminalsCollection ) {
        Backbone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "AdminMapView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-list" ).remove().text();
        }

    },

    "events": {
        "click #show": "showList",
        "click #hide": "hideList"
    },

    "render": function() {

        this.$el
            .html( _tpl );

        this.create();

        return this;
    },

    "create": function() {

        this.collection.each( function( oTerminalModel ) {

            var model = oTerminalModel;
            
            var bank = model.get( "bank" ),
                latitude = model.get( "latitude" ),
                longitude = model.get( "longitude" );

            new google.maps.Marker({
                position: new google.maps.LatLng( latitude, longitude ),
                map: myMap,
            });

        } );

        var myLatlng = new google.maps.LatLng(50.8459195, 4.3648563);

        var myOptions = {
            zoom: 10,
            zoomControl: true,
            scrollwheel: false,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var myMap = new google.maps.Map( document.getElementById('gmap'), myOptions );

    },

    "showList": function() {
        this.$el
            .html( _tpl )
            .find( '#show' )
                .attr( 'class', 'hidden' )
                .end() 
            .find( '#hide' )
                .attr( 'class', 'shown' )
                .end() 
            .find( 'ul' )
                .attr( "class", "shown" )
                .end();

        var $list = this.$el.find( "ul" );

        this.collection.each( function( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );
    },

    "hideList": function() {
        this.$el
            .html( _tpl )
            .find( '#show' )
                .attr( 'class', 'shown' )
                .end() 
            .find( '#hide' )
                .attr( 'class', 'hidden' )
                .end() 
            .find( 'ul' )
                .attr( "class", "hidden" )
                .end()
    }

} );
},{"./terminals":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/terminals-list-element.js - backbone terminals list view
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

var _tpl;

module.exports = Backbone.View.extend( {

    "el": "<li />",

    "constructor": function( oTerminalModel ) {
        Backbone.View.apply( this, arguments );

        this.model = oTerminalModel;

        if( !_tpl ) {
            _tpl = $( "#tpl-list-terminals" ).remove().text();
        }
    },

    "events": {
        "click a": "showTerminal"
    },

    "render": function() {
        var oBank = this.model.get( "bank" );

        this.$el
            .html( _tpl )
            .find( ".details" )
                .find( '.left' )
                    .find( "img" )
                        .attr( "src", oBank && oBank.icon ? "/images/banks/" + oBank.icon : "images/banks/unknown.png" )
                        .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                        .end()
                    .find( ".name" )
                        .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                        .text( oBank && oBank.name ? oBank.name : "Inconnu" )
                        .end()
                    .find( "address" )
                        .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                        .text( this.model.get( "address" ) )
                        .end()
                    .end()
                .find( '.right' )
                    .find( '.distance' )
                        .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                        .text( ( parseFloat( this.model.get( "distance" ) ) * 1000 ) + "m" )
                        .end()
                    .end();

        return this;
    },

    "showTerminal": function( e ) {
        e.preventDefault();
        window.app.router.navigate( "terminals/details/" + this.model.get( "id" ), { trigger: true } );
    }

} );
},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);

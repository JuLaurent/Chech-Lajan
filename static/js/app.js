(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Chèch Lajan
 *
 * /app.js - client entry point
 *
 * started @ 03/12/14
 */

"use strict";

var $ = require( "jquery" ),
    FastClick = require( "fastclick" ),
    Router = require( "./router" );

window.app.now = new Date();

$( function() {
    FastClick( document.body );

    console.log( window.app );
    console.log( "ready." );

    window.app.router = new Router();
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
 * /router.js - backbone router
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    jeolok = require( "jeolok" );

Backbone.$ = require( "jquery" );

var MainView = require( "./views/main" );
var HeaderView = require( "./views/header" );
var TerminalsCollection = require( "./collections/terminals" );
var TerminalModel = require( "./models/terminal" );
var TerminalsListView = require( "./views/terminals-list" );
var TerminalDetailsView = require( "./views/terminal-details" );

var oPosition;

module.exports = Backbone.Router.extend( {

    "views": {},

    "routes": {
        "terminals/list": "showTerminalsList",
        "terminals/map": "showTerminalsMap",
        "terminals/details/:id": "showTerminalDetails",
        "": "showTerminalsList"
    },

    "start": function() {
        console.log( "Router:started" );

        // 1. define & init views
        ( this.views.main = new MainView() ).render();
        this.views.main.initHeader( ( this.views.header = new HeaderView() ).render() );

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

    "showTerminalsList": function() {
        console.log( "showTerminalsList" );
        var that = this;
        this.views.main.loading( true );
        var oTerminalsCollection = new TerminalsCollection();
        ( this.views.list = new TerminalsListView( oTerminalsCollection ) )
            .collection
                .fetch( {
                    "data": {
                        "latitude": oPosition.latitude,
                        "longitude": oPosition.longitude
                    },
                    "success": function() {
                        that.views.main.clearContent();
                        that.views.main.initList( that.views.list.render() );
                        that.views.main.loading( false, oTerminalsCollection.length + " distributeurs à proximité" );
                    }
                } );
    },

    "showTerminalsMap": function() {
        console.log( "showTerminalsMap" );
    },

    "showTerminalDetails": function( sTerminalID ) {
        console.log( "showTerminalDetails:", sTerminalID );
        var that = this;
        this.views.main.loading( true );
        var oTerminal = new TerminalModel( { id: sTerminalID } );
        ( this.views.details = new TerminalDetailsView( oTerminal ) )
            .model
                .fetch( {
                    "success": function() {
                        that.views.main.clearContent();
                        that.views.main.initDetails( that.views.details.render() );
                        that.views.main.loading( false );
                    }
                } );
    },

} );

},{"./collections/terminals":2,"./models/terminal":3,"./views/header":5,"./views/main":6,"./views/terminal-details":7,"./views/terminals-list":9,"backbone":"backbone","jeolok":"jeolok","jquery":"jquery","underscore":"underscore"}],5:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/header.js - backbone header view
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

        console.log( "HeaderView:init()" );

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

        console.log( "MainView:init()" );

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

    "initHeader": function( HeaderView ) {
        this.$el.find( "#main" ).append( HeaderView.$el );
    },

    "clearContent": function() {
        // cette methode sert à vider les vues avant d'en rajouter de nouvelles
        this.$el.find( "#main section:not(#status)" ).remove();
    },

    "initList": function( TerminalsListView ) {
        this.$el.find( "#main" ).append( TerminalsListView.$el );
    },

    "initDetails": function( TerminalDetailsView ) {
        this.$el.find( "#main" ).append( TerminalDetailsView.$el );
    },

} );

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],7:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/terminal-details.js - backbone terminal details view
 *
 * started @ 19/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" ),
    jeyodistans = require( "jeyo-distans" );

Backbone.$ = require( "jquery" );

var _tpl;

module.exports = Backbone.View.extend( {

    "el": "<section />",

    "constructor": function( oTerminalModel ) {
        Backbone.View.apply( this, arguments );

        this.model = oTerminalModel;

        console.log( "TerminalDetailsView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-details" ).remove().text();
        }
    },

    "events": {
        "click .problems a": "toggleEmptyState"
    },

    "render": function() {

        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        this.$el
            .html( _tpl )
            .attr( "id", "details" )
            .show()
            .find( "h3" )
                .find( "img" )
                    .attr( "src", oBank && oBank.icon ? "/images/banks/" + oBank.icon : "images/banks/unknown.png" )
                    .attr( "alt", oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .find( "span" )
                    .css( "color", "#" + ( oBank && oBank.color ? oBank.color : "333" ) )
                    .text( oBank && oBank.name ? oBank.name : "Inconnu" )
                    .end()
                .end()
            .find( "address" )
                .text( this.model.get( "address" ) )
                .end()
            .find( ".empty" )
                .toggle( this.model.get( "empty" ) )
                .end()
            .find( ".infos" )
                .css( "position", "relative" )
                .css( "right", "auto" )
                .css( "top", "auto" )
                .find( "> span" )
                    .text( ( jeyodistans( oTerminalPosition, window.app.currentPosition ) * 1000 ) + "m" )
                    .end()
                .end()
            .find( ".problems" )
                .toggle( !this.model.get( "empty" ) )
                .end()
            .find( ".confirm_problem" )
                .hide();

        return this;
    },

    "toggleEmptyState": function( e ) {
        e.preventDefault();
        var that = this;
        this.model.set( "empty", false );
        this.model.save( null, {
            "url": "/api/terminals/" + this.model.get( "id" ) + "/empty",
            "success": function() {
                that.$el
                    .find( "empty" )
                        .show()
                        .end()
                    .find( ".problems" )
                        .hide();
            }
        } );
    }

} );

},{"backbone":"backbone","jeyo-distans":"jeyo-distans","jquery":"jquery","underscore":"underscore"}],8:[function(require,module,exports){
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

        // en faisant comme ceci, on écrase le template à chaque fois, il ne faut l'affecter qu'une seule fois
        // _tpl = $( "#tpl-result-list-elt" ).remove().text();
        if( !_tpl ) {
            _tpl = $( "#tpl-result-list-elt" ).remove().text();
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

},{"backbone":"backbone","jquery":"jquery","underscore":"underscore"}],9:[function(require,module,exports){
/* Chèch Lajan
 *
 * /views/terminals-list.js - backbone terminals list view
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

var TerminalElementView = require( "./terminals-list-element" );

var _tpl;

module.exports = Backbone.View.extend( {

    "el": "<section />",

    "constructor": function( oTerminalsCollection ) {
        Backbone.View.apply( this, arguments );

        this.collection = oTerminalsCollection;

        console.log( "TerminalsListView:init()" );

        if( !_tpl ) {
            _tpl  = $( "#tpl-result-list" ).remove().text();
        }
    },

    "events": {},

    "render": function() {

        this.$el
            .attr( "id", "result" )
            .html( _tpl );

        var $list = this.$el.find( "ul" );

        this.collection.each( function( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );

        return this;
    },

} );
},{"./terminals-list-element":8,"backbone":"backbone","jquery":"jquery","underscore":"underscore"}]},{},[1]);

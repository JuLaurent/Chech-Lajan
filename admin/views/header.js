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

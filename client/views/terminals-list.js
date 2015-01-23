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
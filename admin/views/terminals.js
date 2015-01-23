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
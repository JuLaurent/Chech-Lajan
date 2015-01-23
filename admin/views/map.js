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
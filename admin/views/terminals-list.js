/* Chèch Lajan
 *
 * /views/terminals-list.js - backbone admin terminals list
 *
 * started @ 12/12/14
 */

"use strict";

var _ = require( "underscore" ),
    Backbone = require( "backbone" ),
    $ = require( "jquery" );

Backbone.$ = require( "jquery" );

var _tpl;

var TerminalElementView = require( "./terminals-list-element" );

module.exports = Backbone.View.extend( {

    "el": "<section />",

    "constructor": function( oPosition, oTerminalsCollection ) {
        Backbone.View.apply( this, arguments );

        //console.log(latitude);

        this.collection = oTerminalsCollection;
        this.position = oPosition;

        console.log( "AdminTerminalsListView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-list" ).remove().text();
        }

    },

    "events": {
        "click #show": "showList",
        "click #hide": "hideList",
    },

    "render": function() {

        $( '#back' ).hide();

        this.$el
            .html( _tpl );

        this.create();

        return this;
    },

    "create": function() {

        var myLatlng = new google.maps.LatLng(this.position.latitude, this.position.longitude);

        var myOptions = {
            zoom: 11,
            zoomControl: true,
            scrollwheel: false,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var myMap = new google.maps.Map( document.getElementById('gmap'), myOptions );

        var myMarker = new google.maps.Marker({
            position: myLatlng,
            title: 'Ma position',
            map: myMap,
            icon: 'images/markers/me_marker.png',
            zIndex: 2
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<div>'+ myMarker.title + '</div>'
        });

        google.maps.event.addListener( myMarker, 'click', function(e) {
            infowindow.open(myMap, myMarker);
        });

        this.collection.each( function( oTerminalModel ) {

            var model = oTerminalModel;
            
            var bank = model.get( "bank" ),
                latitude = model.get( "latitude" ),
                longitude = model.get( "longitude" );

            var myMarker = new google.maps.Marker({
                position: new google.maps.LatLng( latitude, longitude ),
                title: model.get( 'bank' ).name,
                map: myMap,
                icon: '/images/markers/terminal_marker.png',
                zIndex: 1
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<div>'+ myMarker.title + '</div>'
            });

            google.maps.event.addListener( myMarker, 'click', function(e) {
                infowindow.open(myMap, myMarker);
            });

        } );
        

    },

    "showList": function(e) {
        
        e.preventDefault();

        this.$el
            .html( _tpl )
            .find( '#show' )
                .attr( 'class', 'hidden' )
                .end() 
            .find( '#hide' )
                .attr( 'class', 'shown' )
                .end() 
            .find( 'ul' )
                .slideDown()
                .end();

        var $list = this.$el.find( "ul" );

        this.collection.each( function( oTerminalModel ) {
            ( new TerminalElementView( oTerminalModel ) ).render().$el.appendTo( $list );
        } );
    },

    "hideList": function(e) {
        e.preventDefault();

        this.$el
            .html( _tpl )
            .find( '#show' )
                .attr( 'class', 'shown' )
                .end() 
            .find( '#hide' )
                .attr( 'class', 'hidden' )
                .end() 
            .find( 'ul' )
                .slideUp()
                .end()
    }

} );
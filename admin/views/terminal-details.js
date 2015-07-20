/* Chèch Lajan
 *
 * /views/terminal-details.js - backbone admin terminal details view
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

    "constructor": function( oPosition, oTerminalModel ) {
        Backbone.View.apply( this, arguments );

        this.model = oTerminalModel;
        this.position = oPosition;

        console.log( "TerminalDetailsView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-details" ).remove().text();
        }
    },

    "events": {
        "click .problems a": "toggleEmptyState",
        "click #back": "backList"
    },

    "render": function() {

        $( '#back' ).show();

        var oBank = this.model.get( "bank" );

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

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
                        .text( '+- ' + ( +( jeyodistans( oTerminalPosition, this.position ) * 1000 ) + "m" ) )
                        .end()
                    .end();

        this.create();

        return this;
    },

    "create": function() {

        var myLatlng = new google.maps.LatLng(this.position.latitude, this.position.longitude);

        var myOptions = {
            zoom: 15,
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
            
        var bank = this.model.get( "bank" ),
                latitude = this.model.get( "latitude" ),
                longitude = this.model.get( "longitude" );

        var bankMarker = new google.maps.Marker({
            position: new google.maps.LatLng( latitude, longitude ),
            title: this.model.get( 'bank' ).name,
            map: myMap,
            icon: '/images/markers/terminal_marker.png',
            zIndex: 1
        });

        var infowindow2 = new google.maps.InfoWindow({
            content: '<div>'+ bankMarker.title + '</div>'
        });

        google.maps.event.addListener( bankMarker, 'click', function(e) {
            infowindow2.open(myMap, bankMarker);
        });
        
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
    },

    "backList": function( e ) {
        e.preventDefault();
        
        console.log('back');
    }

} );

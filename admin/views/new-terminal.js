/* Chèch Lajan
 *
 * /views/new-terminal.js - backbone admin new terminal view
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

    "constructor": function( oPosition ) {
        Backbone.View.apply( this, arguments );

        this.position = oPosition;

        console.log( "NewTerminalView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-newDistrib" ).remove().text();
        }
    },

    "events": {

    },

    "render": function() {

        $( '#back' ).show();

        var oTerminalPosition = {
            "latitude": this.model.get( "latitude" ),
            "longitude": this.model.get( "longitude" )
        };

        /*this.$el
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
                        .text( '+- ' + ( +( jeyodistans( oTerminalPosition, this.position ) ) + "km" ) )
                        .end()
                    .end();

        if( this.model.get( 'empty' ) == true ) {
            this.$el
                .find( '#empty' )
                    .show()
                    .end()
                .find ( '#fullTerminal' )
                    .css( 'display', 'block' )
                    .end()
                .find( '#emptyTerminal' )
                    .hide()
                    .end()
        }*/

        // this.create();

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
            icon: '/images/markers/me_marker.png',
            zIndex: 2
        });
            
        var bank = this.model.get( "bank" ),
            latitude = this.model.get( "latitude" ),
            longitude = this.model.get( "longitude" );

        var bankMarker = new google.maps.Marker({
            position: new google.maps.LatLng( latitude, longitude ),
            title: this.model.get( 'bank' ).name,
            map: myMap,
            icon: '/images/markers/terminal_marker.png',
            animation: google.maps.Animation.BOUNCE,
            zIndex: 1,
            draggable: true
        });

        bankMarker.set( 'model', this.model );

        google.maps.event.addListener( bankMarker, 'dragstart', function() {
            
            bankMarker.setAnimation(null);

        });

        google.maps.event.addListener( bankMarker, 'dragend', function() {

            geocodePosition( bankMarker.getPosition() );

        });

        function geocodePosition( position ) {
            var geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ latLng: position }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    var address = results[0].formatted_address,
                        latitude = position.G,
                        longitude = position.K;

                    bankMarker.get( 'model' ).save( null, {
                        'url': '/api/terminals/' + bankMarker.get( 'model' ).get( 'id' ) + '/' + address + '/' + latitude + '/' + longitude + '/changeposition',
                        'success': function() {
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }
                    } ); 

                } 
            } );
        }

    },


} );
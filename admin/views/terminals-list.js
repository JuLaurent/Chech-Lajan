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

    "constructor": function( oPosition, oTerminalsCollection, oRadius ) {
        Backbone.View.apply( this, arguments );

        //console.log(latitude);

        this.collection = oTerminalsCollection;
        this.position = oPosition;
        this.radius = oRadius ;

        if( this.radius == null ) {
            this.radius = 5;
        }

        console.log( "AdminTerminalsListView:init()" );

        if( !_tpl ) {
            _tpl = $( "#tpl-list" ).remove().text();
        }

    },

    "events": {
        "click #show": "showList",
        "click #hide": "hideList",
        "click #addTerminal": "addTerminal",
        "change #radius": "changeRadius"
    },

    "render": function() {

        $( '#back' ).hide();

        this.$el
            .html( _tpl )
                .find( '#radius' )
                    .attr( 'value', this.radius )
                    .end()
                .find( '#radiusValue' )
                    .text( this.radius + 'km' )
                    .end();

        this.create( this.radius );

        return this;
    },

    "create": function( radius ) {

        var myLatlng = new google.maps.LatLng(this.position.latitude, this.position.longitude);

        var myOptions = {
            zoom: 8,
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
            zIndex: 2,
            draggable: true
        });

        google.maps.event.addListener( myMarker, 'dragend', function() {
            
            console.log(myMarker.getPosition());

            //window.app.router.navigate( "admin/list/" + radius + '/' + myMarker.getPosition().G + '/' + myMarker.getPosition().K, { trigger: true } );

        });

        var myCircle = new google.maps.Circle({
            strokeColor: '#000c20',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#ffffff',
            fillOpacity: 0.4,
            map: myMap,
            center: myLatlng,
            radius: this.radius * 1000
        });

        this.collection.each( function( oTerminalModel ) {

            var model = oTerminalModel;
            
            var bank = model.get( "bank" ),
                latitude = model.get( "latitude" ),
                longitude = model.get( "longitude" );

            var myMarker = new google.maps.Marker({
                position: new google.maps.LatLng( latitude, longitude ),
                map: myMap,
                icon: '/images/markers/terminal_marker.png',
                zIndex: 1
            });

        } );
        

    },

    "showList": function(e) {
        
        e.preventDefault();


        this.$el
            .html( _tpl )
                .find( '#radius' )
                    .attr( 'value', this.radius )
                    .end()
                .find( '#radiusValue' )
                    .text( this.radius + 'km' )
                    .end()
                .find( '#show' )
                    .attr( 'class', 'hidden' )
                    .end() 
                .find( '#hide' )
                    .attr( 'class', 'shown' )
                    .end() 
                .find( 'ul' )
                    .show()
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
                .find( '#radius' )
                    .attr( 'value', this.radius )
                    .end()
                .find( '#radiusValue' )
                    .text( this.radius + 'km' )
                    .end()
                .find( '#show' )
                    .attr( 'class', 'shown' )
                    .end() 
                .find( '#hide' )
                    .attr( 'class', 'hidden' )
                    .end() 
                .find( 'ul' )
                    .hide()
                    .end()
    },

    "changeRadius": function( e ){
        e.preventDefault();

        var radius = $( '#radius' ).val(); 

        window.app.router.navigate( "admin/list/" + radius, { trigger: true } );
    },

    "addTerminal": function( e ){
        e.preventDefault();

        window.app.router.navigate( "admin/newterminal", { trigger: true } );
    },

} );
( function( $ ){

	"use strict";

	var gMap,
		$map,
		gMyPosition;

	var _initMap = function() {
		// create the map
		gMap = new google.maps.Map( $map[ 0 ], {
			"center" : gMyPosition,
			"disableDefaultUI" : true,
			"mapTypeId": google.maps.MapTypeId.HYBRID,
			"scrollwheel" : false,
			"zoomControl":true,
			"zoom" : 14
		} );

		// position a marker on me 
		new google.maps.Marker( {
			"map": gMap,
			"position": gMyPosition,
		} )

	};

	var _getPositionSuccess = function( oPosition ){
		gMyPosition = new google.maps.LatLng( oPosition.coords.latitude, oPosition.coords.longitude );
		_initMap();
	};

	$( function() {

		$map = $( '#gmap' );

		// _initMap();

		navigator.geolocation && navigator.geolocation.getCurrentPosition( _getPositionSuccess, console.error, { 
			"enableHighAccuracy": true
		} );

	} );

} )( jQuery );
var map = new GMap2(document.getElementById("map_canvas"));
var geocoder = new GClientGeocoder();

var address = "1600 Amphitheatre Parkway, Mountain  View";
geocoder.getLatLng(address, function(point) {
		 var latitude = point.y;
		 var longitude = point.x;  

		 console.log(longitude, latitude);
		 // do something with the lat lng
});
var STORYLINE = {

	setPhoneNumber: function() {
		if(!window.localStorage.getItem('Storyline:phonenumber')) {
			$('#number-form').on('submit', function(e) {
				e.preventDefault();
				window.localStorage.setItem('Storyline:phonenumber', $('#number-input').val());
				$('#phonenumber').remove();
			});
		} else {
			$('#phonenumber').remove();
		}
	},
	getPhoneNumber: function() {
		return window.localStorage.getItem('Storyline:phonenumber');
	},
	makePhoneCall: function(songID) {
		var phonenumber = STORYLINE.getPhoneNumber();
		console.log('make phone call');
		console.log('number is: ' + phonenumber);
		console.log('song is: ' + songID);
		$('#event-box').addClass('is-visible');
		//$.post( "app.js", {song: songID, number: phonenumber});
		//window.open('http://storyline-geekettes.herokuapp.com', '_blank');
		window.blur();
		window.focus();
	},
	getCurrentPosition: function() {
		var pos = [];
		navigator.geolocation.getCurrentPosition(function(position) {
			pos.push(position.coords.latitude);
			pos.push(position.coords.longitude);
			//console.log(pos);
			return pos;
		});
	},
	createMap: function() {
		navigator.geolocation.watchPosition(function(position) {
			var mapOptions = {
				center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			//return map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			return map;
		});
		
	},
	setUserMarker: function(map, latlng) {
		var myMarker = new google.maps.Marker({
			position: latlng,
			map: map,
			icon: "http://lisapassing.de/storyline/img/DropPinStyle1.png",
			title:"That's you",
			animation: google.maps.Animation.DROP
		});
	},
	setFakeMarker: function(map, latlng) {
		var fakeData = {
			item1: {
				id: 102413184,
				lat: 52.5010,
				lng: 13.4525
			},
			item2: {
				id: 13158665,
				lat: 52.5011,
				lng: 13.4520
			},
			item3: {
				id: 92461827,
				lat: 52.5031,
				lng: 13.459
			}
		};

		$.each(fakeData, function(index, value) {
			var fakeLatlng = new google.maps.LatLng(value.lat, value.lng);
			var fakeMarker = new google.maps.Marker({
				position: fakeLatlng,
				map: map,
				icon: "http://lisapassing.de/storyline/img/DropPinStyle2.png",
				title:"That's you",
				animation: google.maps.Animation.DROP,
			});
			circle = new google.maps.Circle({
				map: map,
				clickable: false,
				// metres
				radius: 15,
				fillColor: '#fff',
				fillOpacity: .6,
				strokeColor: '#313131',
				strokeOpacity: .4,
				strokeWeight: .8
			});	
			circle.bindTo('center', fakeMarker, 'position');
			var bounds = circle.getBounds();
			if(bounds.contains(latlng) === true) {
				//console.log(value);
				STORYLINE.makePhoneCall(value.id);
			}
		});
	},
	updateLocation: function(myMap, myLatlng) {
		STORYLINE.setUserMarker(myMap, myLatlng);
		STORYLINE.setFakeMarker(myMap, myLatlng);
	}
};

$(document).ready(function() {

	STORYLINE.setPhoneNumber();
	$('#phonenumber .input[type=submit]').on('click', function() {
		$('#phonenumber').remove();
	});

	$('#event-box').removeClass('is-visible');
	$('#event-box .close').on('click', function() {
		if($('#event-box').hasClass('is-visible')) {
			$('#event-box').remove();
		}
	});

	navigator.geolocation.watchPosition(function(position) {

		var mapOptions = {
			center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var myMap = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
		var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		//setInterval(STORYLINE.updateLocation, 1000);
		STORYLINE.updateLocation(myMap, myLatlng);
	});

});









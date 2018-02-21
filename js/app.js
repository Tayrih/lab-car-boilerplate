window.addEventListener('load', function() {
  var map;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var btnRuta = document.getElementById('btn-ruta');
  var originVal = /** @type {!HTMLInputElement} */(
    document.getElementById('origin-value'));
  var destinationVal = /** @type {!HTMLInputElement} */(
    document.getElementById('destination-value'));
  var markers = [];
  initMap();

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -12.045738,
        lng: -77.030594
      },
      zoom: 15
    });

    var infoWindow = new google.maps.InfoWindow({map: map});

    // HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // geocoder inverso

        let geocoder = new google.maps.Geocoder;
        geocoder.geocode({
          'location': pos
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              console.log(results[1].formatted_address);
              originVal.value = results[1].formatted_address;
            }
          }
        });

        // posicion generada porgeolocalizacion
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon: 'https://user-images.githubusercontent.com/32286691/36465402-d9f5fd12-16a2-11e8-9ac0-28f4ca4bbd9f.png'
        });

        map.setCenter(pos);

        // autocompletado
        var origin = document.getElementById('origin-value');
        var autocompleteOrigin = new google.maps.places.Autocomplete(origin);
        autocompleteOrigin.bindTo('bounds', map);

        // autocompletado de destino
        var destination = document.getElementById('destination-value');
        var autocompleteDestination = new google.maps.places.Autocomplete(destination);
        autocompleteDestination.bindTo('bounds', map);
        directionsDisplay.setMap(map);
      });
    } else {
    // Browser doesn't support Geolocation
      alert('Su navegador no soporta Geolocalización');
    }
  }

  btnRuta.addEventListener('click', function(event) {
    event.preventDefault();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: originVal.value,
      destination: destinationVal.value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    directionsDisplay.setMap(map);
  }
});
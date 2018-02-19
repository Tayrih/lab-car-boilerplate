var map = null;
var directionsDisplay, directionsService;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), { // ubicación del mapa en general
    zoom: 15, 
    center: { lat: -12.045916, 
      lng: -77.030583 }, // ubicacion inicial
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: false
  });

  var infoWindow = new google.maps.InfoWindow({map: map});
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You Are Here!');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //   //  marker clusterer
  //   var markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  // }


  // autocompletado de origen
  var origin = document.getElementById('origin');
  var autocompleteOrigin = new google.maps.places.Autocomplete(origin);
  autocompleteOrigin.bindTo('bounds', map);

  // autocompletado de destino
  var destino = document.getElementById('destino');
  var autocompleteDestino = new google.maps.places.Autocomplete(destino);
  autocompleteDestino.bindTo('bounds', map);

  directionsDisplay = new google.maps.DirectionsRenderer(/* {suppressMarkers: true}*/);
  directionsService = new google.maps.DirectionsService();

  directionsDisplay.setMap(map);
};

var onRutaClick = function() {
  console.log('Click en ruta');
  calculateAndDisplayRoute(directionsService, directionsDisplay);
};

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destino').value,
    travelMode: 'DRIVING'
  }, (response, status) => {
    console.log('Response : ' + JSON.stringify(response) + ' STATUS > ' + status);
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Falló el cáculo de ruta ' + status);
    }
  });
}

function limpiar() {
  for (let i in markers) {
    markers[i].setMap(null);
  }
  markers.length = 0;

  directionsDisplay.setMap(null);
  directionsDisplay = new google.maps.DirectionsRenderer(/* {suppressMarkers: true}*/);
  directionsDisplay.setMap(map);
}

function buscar() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
  }
}

var funcionExito = function(posicion) {
  latitud = posicion.coords.latitude;
  longitud = posicion.coords.longitude;

  var miUbicacion = new google.maps.Marker({
    position: { lat: latitud,
      lng: longitud },
    animation: google.maps.Animation.DROP,
    // draggable:true, //con esto puedo mover mi icono donde yo quiera
    // title:"Drag me!",
    map: map
  });

  markers.push(miUbicacion);

  map.setZoom(17);
  map.setCenter({ lat: latitud,
    lng: longitud });
};

var funcionError = function(error) {
  alert('Tenemos problemas encontrando tu ubicación');
};
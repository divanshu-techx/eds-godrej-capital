import styles from './google-map-styles.js';

let map;

function createMap(lat, long, mapCanvasID, icons) {
  const pointA = new google.maps.LatLng(lat, long);
  let infowindow = new google.maps.InfoWindow({ maxWidth: 205 });
  const pos = {
    lat: Number(lat),
    lng: Number(long),
  };
  const myOptions = {
    center: pointA,
    zoom: 10,
    styles,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById(mapCanvasID), myOptions);

  const marker = new google.maps.Marker({
    position: pointA,
    icon: icons,
    map,
  });

  map.setOptions({
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: false,
    zoomControl: true,
  });

  marker.setPosition(pos);

  google.maps.event.addListener(
    marker,
    'click',
    (function () {
      return function () {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(
          this.getPosition().lat(),
          this.getPosition().lng(),
        );
        geocoder.geocode({ latLng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const address = results[3].formatted_address;
            const string = `<div><p style="color:black">${address}</p></div>`;
            infowindow.setContent(string);
          }
        });
        // infowindow.setContent(content);
        infowindow.open(map, marker);
      };
    }(marker)),
  );
}

export default createMap;

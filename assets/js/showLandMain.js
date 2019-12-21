var kku = {
  lat: 14.9780154,
  lng: 102.1029185
};
var drawingManager;
var controlUI;
var saveEditBt;
var clearBt;
var countButton = 0;
var geocoder;
var infowindow;
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: kku,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  getLatLngDB();


}

function getAllLandsAPI(ownerId) {
  var url = "https://rocky-gorge-34614.herokuapp.com/lands/" + ownerId;
  return Promise.resolve(
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      contentType: "application/json"
    })
  );
}

function getLatLngDB() {
  var ownerId = "5dfcabe6666c642250d2ec59";
  var getAllLands = getAllLandsAPI(ownerId);
  getAllLands.then(
    docs => {
      var centerLat = 0;
      var centerLng = 0;
      var countPoint = 0;
      var polygonLands = [];
      for (let i = 0; i < docs.length; i++) {
        var latlngArr = [];
        var points = docs[i].land.points;
        for (let j = 0; j < points.length; j++) {
          var obj = {
            lat: points[j].lat,
            lng: points[j].lng
          };
          centerLat += points[j].lat;
          centerLng += points[j].lng;
          countPoint++;
          latlngArr.push(obj);
        }
        polygonLands.push(latlngArr);
      }
      centerLat = centerLat / countPoint;
      centerLng = centerLng / countPoint;

      for (let i = 0; i < polygonLands.length; i++) {
        new google.maps.Polygon({
          paths: polygonLands[i],
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        }).setMap(map);
      }

      map.setCenter({ lat: centerLat, lng: centerLng });
     // test[0].setMap(map);
      // drawArea1.setMap(map);
      // drawArea2.setMap(map);
    },
    function(e) {
      console.log(e.responseText);
    }
  );
}

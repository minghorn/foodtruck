$.get("https://data.sfgov.org/resource/rqzj-sfat.json?$select=applicant,address,fooditems,latitude,longitude,schedule&Status=approved&FacilityType=truck", function(data){
  app(data);
});


var app = function(data){

  for (var i = data.length - 1; i >= 0; i--) {
          data[i].id = i + 1;
          data[i].latitude = Number(data[i].latitude);
          data[i].longitude = Number(data[i].longitude);
  };

  function distance(a1, b1, a2, b2){
          var distance = Math.sqrt(((a1 - a2) * (a1 - a2)) + ((b1 - b2) * (b1 - b2)));
          return distance;
  };

  function ltg(a,b){
    return a-b;
  };   

  function findNearest(lat, lon, amt){
          var nearest = [];
          var all = [];
          var hold = [];
          for (var i = 0; i < data.length; i++) {
            if(data[i].longitude != undefined){
              all[i] = distance(data[i].longitude, data[i].latitude, lon, lat);
            }
          }
          for(var m = 0; m < all.length; m++){
            hold[m] = all[m];
          }
          hold.sort(ltg);
          for(var j = 0; j < amt; j++){
            for (var k = 0; k < all.length; k++) {
              if(hold[j] == all[k]){
                  nearest[nearest.length] = k;
                }
              };      
          }
          var result = [];
          nearest.forEach(function(value){
            result.push(data[value]);
          });
          return result;
  };

  function addMarker(lat, lon, contentString) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon),
        map: map
      });

    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

	  google.maps.event.addListener(marker, 'click', function() {
	    infoWindow.open(map,marker);
	   });
    console.log(lat, lon, contentString);
  };

  var nearestFoodTruckMarkers = findNearest(data[1].latitude, data[1].longitude, 5);
  console.log('truck', nearestFoodTruckMarkers);

  nearestFoodTruckMarkers.forEach(function(truckData){
    var infoWindowContent = '<b>'+ truckData.applicant + '</b> <br/>'+ truckData.address + '<br/>' + truckData.foodItems;
    addMarker(truckData.latitude, truckData.longitude, infoWindowContent);
  });

}

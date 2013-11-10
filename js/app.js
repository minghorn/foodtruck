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
  }
  function ltg(a,b){
    return a-b;
  }        

  function findNearest(lat, lon, amt){
          var nearest = [];
          var all = [];
          var hold = [];
          for (var i = 0; i < data.length; i++) {
          if(data[i].longitude != undefined){
                  all[i] = distance(data[i].longitude, data[i].latitude, lon, lat);
          }
          };
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
          return nearest;
  }

  function addMarker(lat, lon) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon),
      });
      for(var h = data.length-1; h>=0; h--){
	  var infowindow = new google.maps.InfoWindow({
	  content: contentString
	  });

	google.maps.event.addListener(marker, 'click', function() {
	  infowindow.open(map,marker);
	  });
	};
         marker.setMap(map);
}

  var ids = findNearest(data[1].latitude, data[1].longitude, 5);
  for (var i = ids.length - 1; i >= 0; i--) {
          addMarker(data[ids[i]].latitude, data[ids[i]].longitude);
        var name = data[ids[i]].applicant;
	  	var address = data[ids[i]].address;
	  	var menu = data[ids[i]].fooditems;
	  	var contentString = '<b>'+ name + '</b> <br/>'+ address + '<br/>' + menu;
  };
}

// import json file with food truck data, get the name, address, food, lat, long, and schedule and push to data array
$.get("https://data.sfgov.org/resource/rqzj-sfat.json?$select=applicant,address,fooditems,latitude,longitude,schedule&Status=approved&FacilityType=truck", function(data){
  app(data);
});

//create function app that loads the data from json file as a parameter
var app = function(data){

//lat long for every data point
  for (var i = data.length - 1; i >= 0; i--) {
          data[i].id = i + 1;
          data[i].latitude = Number(data[i].latitude);
          data[i].longitude = Number(data[i].longitude);
  };

//calculate distance to specific food truck
  function distance(a1, b1, a2, b2){
          var distance = Math.sqrt(((a1 - a2) * (a1 - a2)) + ((b1 - b2) * (b1 - b2)));
          return distance;
  };

//function to find the nearest food trucks and log them in an array
  function findNearest(lat, lon, amt){
          var nearest = [];
          var all = [];
          var hold = [];
          //trying to remove duplicates from the dataset DOESNT WORK YET
          for(var i = 0; i < data.length; i++){
            for(var j = 1; j < data.length; j++){
              if(data[i].applicant == data[j].applicant){
                data.remove(i)
              }              
            }

          }
          //for each truck find the distance from your position to the truck if longitude exists
          for (var i = 0; i < data.length; i++) {
            if(data[i].longitude != undefined && data[i].latitude != undefined){
              all[i] = distance(data[i].longitude, data[i].latitude, lon, lat);
            }
          }
          //duplicate all array to hold array
          for(var m = 0; m < all.length; m++){
            hold[m] = all[m];
          }
          //sorts the hold array from lowest to highest
          hold.sort(function(a,b){return a-b});

          //compares the hold array to the all array. the amt is the number of results wanted. push the 
          for(var j = 0; j < amt; j++){
            nearest.push(hold[j]); 
          }

          //create result array, from the nearest array for each element push the data value to the result array. basically the nearest array is replicated to the result array but the result array holds the information about the truck
          var result = [];
          nearest.forEach(function(value){
            result.push(data[value]);
          });
          return result;
  };

  var nearestFoodTruckMarkers = findNearest(data[1].latitude, data[1].longitude, 5);

  //implement all the functions and update the info window for the sidebar
    nearestFoodTruckMarkers.forEach(function(truckData){
      var infoWindowContent = '<b>'+ truckData.applicant + '</b> <br/>'+ truckData.address + '<br/>';
      $("#sidebar").append(infoWindowContent);
      addMarker(truckData.latitude, truckData.longitude, infoWindowContent);
    });
  //add google maps marker
    function addMarker(lat, lon, contentString) {
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat,lon),
          map: map
        });
  //create info windows for the markers on the map
      var infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
  //open the info window when the marker is clicked
  	  google.maps.event.addListener(marker, 'click', function() {
  	    infoWindow.open(map,marker);
  	   });
    };
}

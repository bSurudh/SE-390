      var map;
      var initialLocation;
      var features = [];
      var markers = [];
      var pidIDSelected = "null";

      function removeAllMarkers() {
        for(var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        features = [];
      }

      function initMap() {
		    initialLocation = new google.maps.LatLng(43.4731225, -80.5436897);
        if (navigator.geolocation) {
     		navigator.geolocation.getCurrentPosition(function (position) {
	         	initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	         	map.setCenter(initialLocation);
 			});
 		}

     	map = new google.maps.Map(document.getElementById('map'), {
      		zoom: 16,
      		center: initialLocation,
      		mapTypeId: 'roadmap'
    	});

        var modal = document.getElementById('myModal');
        var modalImg = document.getElementById("img01");
        var rating = document.getElementById("caption");
        var span = document.getElementsByClassName("close")[0];
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() { 
		  modal.style.display = "none";
      pidIDSelected = "null";
		}

        // initialize features using jquery
        addAllPictures();
        // end of init map
    }

    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01");
    var rating = document.getElementById("caption");

    jQuery("input:radio").click(function() {
      var userID = getCookie("id_token");
      var val = parseInt(this.id.substr(this.id.length - 1));
      console.log("RATING VAL: " + val);
      var picID = pidIDSelected;
      if(picID != "null") {
        jQuery.ajax({
          url: "https://geopix-bengineering.rhcloud.com/ratings/" + picID,
          type: "POST",
          dataType: "json",
          contentType: "text/plain",
          data: {"rating" : val},
          beforeSend: function(request) {
            // request.withCredentials = true;
            var value = "Bearer: " + userID;
            request.setRequestHeader("Authorization", value);
            console.log("request headers set.");
          },
          success: function(data) {
            console.log("Successfully updated rating! " + data);
          },
          error: function(e) {
            console.log("AJAX request failed: " + e);
          }
        });
      }
    });

    function addMarker(feature) {
        var marker = new google.maps.Marker({
          position: feature.position,
          // icon: icons[feature.type].icon,
          icon: feature.icon,
          map: map,
          rating: feature.stars
        });
        markers.push(marker);
        marker.addListener('click', function() {
          pidIDSelected = feature.id;
          console.log("PICIDSELECTED: " + pidIDSelected);
          modal.style.display = "block";
          modalImg.src = feature.icon.url;
          var ratingString = "#star"+this.rating;
          jQuery(ratingString).attr('checked', 'checked');
        });
    }

    function addAllPictures() {
        removeAllMarkers();
        var request = jQuery.ajax({
          url: "https://geopix-bengineering.rhcloud.com/images/all",
          type: "GET",
          dataType: "JSON",
          contentType: "text/plain",
          success: function(data) {
            console.log(JSON.parse(JSON.stringify(data)));
            var baseURL = "https://geopix-bengineering.rhcloud.com/images/";
            // work with json data to create features
            for(var i = 0; i < data.length; i++) {
              var currImage = data[i];
              var lat = currImage["location"]["coordinates"][0];
              console.log(lat);
              var lng = currImage["location"]["coordinates"][1];
              var imgPath = currImage["filePath"];
                    var rating = currImage["rating"];
              var name = currImage["_id"];
              // get the filepath of the image
              console.log(baseURL+name);
              // nestedAjaxCall(baseURL+name);
              features.push({
                position: new google.maps.LatLng(lat, lng),
                icon: {
                  url: baseURL+name,
                  scaledSize: new google.maps.Size(30,30),
                  origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
                },
                stars: rating,
                id: name
              });
            }
            console.log("features length: " + features.length);
            for (var i = 0, feature; feature = features[i]; i++) {
                addMarker(feature);
            }
          },
          error: function(e) {
            console.log("AJAX request failed: " + e);
          }
        });

      }


      // Function that filters the images based on who they were uploaded by.
      function filterByFriend() {
        removeAllMarkers();
        var userID = getCookie("id_token");
        console.log("filtering by friend...");
        var friendName = document.getElementById('pac-input').value;
        var baseURL = "https://geopix-bengineering.rhcloud.com/images/user/";
        console.log(baseURL + friendName);
        var request = jQuery.ajax({
          url: baseURL + friendName,
          type: "GET",
          dataType: "JSON",
          contentType: "text/plain",
          beforeSend: function(request) {
            // request.withCredentials = true;
            var value = "Bearer: " + userID;
            request.setRequestHeader("Authorization", value);
            console.log("request headers set.");
          },
          success: function(data) {
            var baseURL = "https://geopix-bengineering.rhcloud.com/images/";
            console.log(JSON.parse(JSON.stringify(data)));
            // work with json data to create features
            // removeAllMarkers();
            for(var i = 0; i < data.length; i++) {
              // iterate over data, comparing ids
              var currImage = data[i];
              var lat = currImage["location"]["coordinates"][0];
              console.log(lat);
              var lng = currImage["location"]["coordinates"][1];
              var imgPath = currImage["filePath"];
                    var rating = currImage["rating"];
              var name = currImage["_id"];
              // get the filepath of the image
              console.log(baseURL+name);
              // nestedAjaxCall(baseURL+name);
              features.push({
                position: new google.maps.LatLng(lat, lng),
                icon: {
                  url: baseURL+name,
                  scaledSize: new google.maps.Size(30,30),
                  origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
                },
                stars: rating,
                id: name
              });
            }
            console.log("features length: " + features.length);
            for (var i = 0, feature; feature = features[i]; i++) {
                addMarker(feature);
            }
          },
          error: function(e) {
            console.log("AJAX request failed: " + e);
          }
        });
      }


      function getCookie(cname) {
          var name = cname + "=";
          var ca = document.cookie.split(';');
          for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length,c.length);
              }
          }
          return "";
      }
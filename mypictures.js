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
      
var imagesURL = "https://geopix-bengineering.rhcloud.com/images/user";
var userID = getCookie("id_token");
var photos = "";
var picturesTableBody = document.getElementById("picturesTableBody");
jQuery.ajax({
    url: imagesURL,
    type: "GET",
    dataType: "JSON",
    beforeSend: function(xhr) {
        xhr.setRequestHeader("authorization", "Bearer: " + userID);
    },
    success: function(data) {
        console.log(JSON.parse(JSON.stringify(data)));
        var baseURL = "https://geopix-bengineering.rhcloud.com/images/";
        for(var i = 0; i < data.length; i++) {
            var curImage = data[i];
            if(!curImage.hasOwnProperty("rating") || !curImage.hasOwnProperty("_id") || !curImage.hasOwnProperty("timestamp")) {
                continue;
            }
            var imageRating = curImage["rating"];
            var imageId = curImage["_id"];
            var imageDate = new Date(curImage["timestamp"]);
            var dateDisplayStr = imageDate.toDateString() + " " + imageDate.toLocaleTimeString();
            var newRow = picturesTableBody.insertRow(0);
            var pictureCell = newRow.insertCell(0);
            var timestampCell = newRow.insertCell(1);
            var ratingCell = newRow.insertCell(2);
            var buttonCell = newRow.insertCell(3);
            
            var pictureImage = new Image(150, 200);
            pictureImage.src = baseURL + imageId;
            var deleteButton = document.createElement("BUTTON");
            deleteButton.className = "btn btn-primary";
            deleteButton.type = "button";
            deleteButton.innerHTML = "Delete";
            console.log("Creating event listener for image number: " + i + " out of " + data.length + " images. With id: " + imageId);
            deleteButton.addEventListener("click", (function(innerImageId) { return function() {
                console.log("Deleting image with id: " + innerImageId);
                makeDeleteRequest(innerImageId);
            } })(imageId), false);

            pictureCell.appendChild(pictureImage);
            pictureCell.className = "table-cell";
            timestampCell.innerHTML = dateDisplayStr;
            timestampCell.className = "table-cell";
            ratingCell.innerHTML = imageRating;
            ratingCell.className = "table-cell";
            buttonCell.appendChild(deleteButton);
            buttonCell.className = "table-cell";
        }
    },
    error: function(e,t) {
        console.log("AJAX friends request failed: " + t + " " + e);
    }
});

function makeDeleteRequest(imageId) {
    console.log("Deleting picture: " + imageId);
    var userID = getCookie("id_token");
    jQuery.ajax({
        url: "https://geopix-bengineering.rhcloud.com/images/" + imageId,
        type: "DELETE",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("authorization", "Bearer: " + userID);
        },
        success: function(data) {
            location.reload(true);
        },
        error: function(e,t, m) {
            console.log("AJAX delete picture request failed: " + t + " " + e + " " + m);
        }
    });
}
function addFriend() {
        var friendName = document.getElementById('search').value;
        var baseURL = "https://geopix-bengineering.rhcloud.com/friends/";
        var userID = getCookie("id_token");
        jQuery.ajax({
            url: baseURL+friendName,
            asnyc: false,
            type: "POST",
            dataType: "json",
            contentType: "text/plain",
            beforeSend: function(request) {
                // request.withCredentials = true;
                var value = "Bearer: " + userID;
                request.setRequestHeader("Authorization", value);
                console.log("request headers set.");
            },
            success: function(data) {
                console.log("successfully posted data");
                location.reload();
            },
            error: function(e,t) {
                console.log("AJAX friends request failed: " + t + " " + e);
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

        function generateFriendHTML(friendName) {
            var friendEntry = '<li href="#" class="list-group-item text-left"><img class="img-thumbnail" src="http://bootdey.com/img/Content/User_for_snippets.png"><label class="name">';
            friendEntry += friendName + '<br>';
            friendEntry += '</label><div class="break"></div></li>';
            jQuery("#friend-list").append(friendEntry);
        }

        function getFriendName(friendID) {
            var baseURL = "https://geopix-bengineering.rhcloud.com/users/";
            var realURL = baseURL+friendID;
            jQuery.ajax({
                url: realURL,
                async: false,
                type: "GET",
                dataType: "JSON",
                contentType: "text/plain",
                success: function(data) {
                    // for now just log the name to see if it works
                    // console.log(JSON.parse(JSON.stringify(data)));
                    console.log("data[name] = " + data["name"]);
                    generateFriendHTML(data["name"]);
                },
                error: function(e,t) {
                    console.log("AJAX friends request failed: " + t + " " + e);
                }
            });
        } 

        var baseURL = "https://geopix-bengineering.rhcloud.com/friends";
        var userID = getCookie("id_token");
        console.log("userID: " + userID);
        var friendsList = "";
        console.log(baseURL+userID);


        var myFriends = jQuery.ajax({
            url: baseURL,
            async: false,
            type: "GET",
            dataType: "json",
            beforeSend: function(request) {
                // request.withCredentials = true;
                var value = "Bearer: " + userID;
                request.setRequestHeader("Authorization", value);
                console.log("request headers set.");
            },
            success: function(data) {
                console.log(JSON.parse(JSON.stringify(data)));
                // list of json objects
                // parse it to get a name
                // fill field with name
                for(var i = 0; i < data.length; i++) {
                    var currFriendID = data[i]["uidTwo"];
                    console.log(JSON.parse(JSON.stringify(currFriendID)));
                    getFriendName(currFriendID);
                    // so this gets the name of every friend, and when the friend is loaded,
                    // the friend's name is added to the table
                    // console.log("FRIEND NAME: " + name);
                }   
            },
            error: function(e,t) {
                console.log("AJAX friends request failed: " + t + " " + e);
            }
        });
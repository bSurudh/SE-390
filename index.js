var done = "false";
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    console.log('IDToken: ' + googleUser.getAuthResponse().id_token);
    document.cookie = 'id_token=' + googleUser.getAuthResponse().id_token+';';
    var request = jQuery.ajax({
        url: "https://geopix-bengineering.rhcloud.com/users",
        type: "POST",
        data: '{"name":"'+profile.getName()+'","email":"'+profile.getEmail()+'", "token": "' + googleUser.getAuthResponse().id_token + '"}',
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if(done == "false") {
                window.location.href = "https://bsurudh.github.io/map.html";
                done = "true";
            } 
        },
        error: function(data) {
            console.log("Error when sending Sign-In to server");
        }
    });
}

function onSignInFailure(error) {
    console.log(error);
}

var socket = io();
/* storing the socket in a variable  */
/* we are initiating a request from the browser to the server telling it to open a socketIo for us  */

socket.on('connect', function () {
    console.log("we are connected to the server")
});
socket.on('disconnect', function () {
    console.log('the server is down');
});
socket.on('newUserMessage', function (newMessage) {
    console.log("new Message", newMessage);
    var li = jQuery('<li></li>');
    li.text(newMessage.from + ":" + newMessage.text)
    jQuery('#message').append(li);
});
socket.on('newUserMessage', function (newUserMessage) {
    console.log('welcome message', newUserMessage)
})


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();//prevent refreshin process
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {
        //aknoledgment function
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (navigator.geolocation) {
        var location_timeout = setTimeout("geolocFail()", 10000);
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            clearTimeout(location_timeout)
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function (error) {
            clearTimeout(location_timeout);
            geolocFail();
        },  {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
        
    }
    else {
        geolocFail();
    }
})

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current Location</a>')
    //target blank is used to open the link in new tab
    li.text(message.from + ":")
    a.attr('href', message.url)
    li.append(a)
    jQuery('#message').append(li);
});
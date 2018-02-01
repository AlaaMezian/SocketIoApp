
var socket = io();
/* storing the socket in a variable  */
/* we are initiating a request from the browser to the server telling it to open a socketIo for us  */



//auto scroll functionality 
function scrollToBottom() {
    var messages = jQuery('#messages');
    var newMessage=messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight');
    var newMessameHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessameHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}


socket.on('connect', function () {
   var params =jQuery.deparam(window.location.search);
   socket.emit('join', params, function(err){
       if(err){
          window.location.href ='/index.html'
       }else{
       console.log('no errors')
       }
   })
});
socket.on('disconnect', function () {
    console.log('the server is down');
});
socket.on('newUserMessage', function (newMessage) {
    var formattedTime = moment(newMessage.createdAt).format('MMM YY, hh:mm a');
    var li = jQuery('<li></li>');
    li.text(newMessage.from + " {" + formattedTime + "}" + ":" + newMessage.text)
    jQuery('#message').append(li);
    scrollToBottom();
});
socket.on('newUserMessage', function (newUserMessage) {
    console.log('welcome message', newUserMessage)
})

var messageTextBox = jQuery('[name=message]');
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();//prevent refreshin process
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')
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
        });

    }
    else {
        geolocFail();
    }
})

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('MMM YY, hh:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current Location</a>')
    //target blank is used to open the link in new tab
    li.text(message.from + "{" + formattedTime + "}" + ":")
    a.attr('href', message.url)
    li.append(a)
    jQuery('#message').append(li);
    scrollToBottom();
});
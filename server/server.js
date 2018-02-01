const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //we are telling the  socket to uwse our server


const port = process.env.PORT || 8000;
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');
    //this is create the event from server side 
    socket.emit('newUserMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app'
    })
    socket.broadcast.emit('newUserMessage',{
        from : 'Admin',
        text : 'New User Joined',
        createdAt: new Date().getTime()
    })
  
    socket.on('createMessage', (message, callback) => {
        console.log("message from the browser", message);
        io.emit('newUserMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        })
        callback('this is from the server');

    });//the data going to be sent along when the email event occurs 

    socket.on('createLocationMessage', function(coords){
        io.emit('newLocationMessage',{
            from:'Admin',
            url : 'https://www.google.com/maps?q='+ coords.longitude + ","+coords.latitude ,
            createdAt: new Date().getTime()  
        });
    }) 
   
    socket.on('disconnect', () => {
        console.log('user was disconnected');
    })
    
})


server.listen(port, () => {
    console.log("server is up on port " + port);
})

//notes 
//socket .io emmit the event to a single connection 
//io.emit emmit the event to  every single connection

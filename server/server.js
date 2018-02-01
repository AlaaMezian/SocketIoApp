const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment');
const isRealString = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //we are telling the  socket to uwse our server


const port = process.env.PORT || 5001;
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('fill all required field')
        }
        socket.join(params.room);
        //this is create the event from server side 
        socket.emit('newUserMessage', {
            from: 'Admin',
            text: 'Welcome to the chat app'
        })
        socket.broadcast.to(params.room).emit('newUserMessage', {
            from: 'Admin',
            text: 'New User Joined',
            createdAt: moment().valueOf()
        })
        callback();
    });
    socket.on('createMessage', (message, callback) => {
        console.log("message from the browser", message);
        io.emit('newUserMessage', {
            from: message.from,
            text: message.text,
            createdAt: moment().valueOf()
        })
        callback('this is from the server');

    });//the data going to be sent along when the email event occurs 

    socket.on('createLocationMessage', function (coords) {
        io.emit('newLocationMessage', {
            from: 'Admin',
            url: 'https://www.google.com/maps?q=' + coords.longitude + "," + coords.latitude,
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

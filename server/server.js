const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //we are telling the  socket to uwse our server


const port = process.env.PORT || 8080;
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
  
    socket.on('createMessage', (message) => {
        console.log("message from the browser", message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        })

    });//the data going to be sent along when the email event occurs 
    socket.on('disconnect', () => {
        console.log('user was disconnected');
    })

    // // socket.broadcast.emit('newMessage',{
        // // from:message.from,
        // // text:message.text,
        // // createdAt:new Date().getTime()
    // // })mean that the user who emited the function won't recive anything even if listining to th event
})


server.listen(port, () => {
    console.log("server is up on port " + port);
})

//notes 
//socket .io emmit the event to a single connectio 
//io.emit emmit the event to  every single connection
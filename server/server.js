const path = require('path');
const http = require('http');
const express = require('express');
const socketIO =require('socket.io');

const publicPath = path.join(__dirname,'../public');
var app = express();
var server =http.createServer(app);
var io =socketIO(server); //we are telling the  socket to uwse our server


const port=process.env.PORT || 8080;
app.use(express.static(publicPath));
 
io.on('connection',(socket) => 
{
    console.log('new user connected');

socket.on('disconnect',()=>{
    console.log('user was disconnected');
})

})
server.listen(port,()=>
{
    console.log("server is up on port " + port);
}) 
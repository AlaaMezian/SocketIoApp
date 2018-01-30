
    var socket = io();
 /* storing the socket in a variable  */
 /* we are initiating a request from the browser to the server telling it to open a socketIo for us  */
   
   socket.on('connect', function()  {
       console.log("we are connected to the server")
   });
   socket.on('disconnect',function (){
       console.log('the server is down');
   });
   socket.on('newMessage', function(newMessage) {
       console.log("new Message", newMessage );
   })
   socket.on('newUserMessage',function(newUserMessage){
       console.log ('welcome message' , newUserMessage)
   })

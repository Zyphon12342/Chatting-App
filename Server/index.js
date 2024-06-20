const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

//Connection confirmation 
io.on('connection', (socket) => {
  console.log('A User connected');
  socket.on("disconnect", ()=>{
    console.log("A User Disconnected"); 
  });
});

//checking ID of client connection 
io.on("connection" , (socket)=>{
  console.log(socket.id); 
}); 

//Displaying message on serverside terminal with id 
io.on("connection", (socket) => {
    socket.on("Chat message", (msg) =>{
        console.log("Message: " + msg + "By " + socket.id); 
    });
});

//Sending recieved message to all clients at the same time using emit 
io.on("connection", (socket)=>{
  socket.on("Chat message", (msg)=>{
      io.emit("Chat message",msg); 
  }); 
}); 


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
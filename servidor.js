//Para ocupar la consola del sistema operativo
const path = require('path');

//Para el servidor
const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();
app.set('port',process.env.PORT || 3000);
app.use(express.static('public'));
//Configuracion del Servidor https
const server = https.createServer( {
  cert : fs.readFileSync("Certificados/cert.pem"),
  key : fs.readFileSync("Certificados/key.pem")
} , app ).listen( app.get('port') , function() {
  console.log('Servidor https corriendo en puerto' , app.get('port'));
});

///Configutracion de los sockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

let connectedUsers = [];

// Called whend a client start a socket connection
io.on('connection', (socket) => {
  // It's necessary to socket knows all clients connected
  connectedUsers.push(socket.id);

  // Emit to myself the other users connected array to start a connection with each them
  const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  socket.emit('other-users', otherUsers);

  // Send Offer To Start Connection
  socket.on('offer', (socketId, description) => {
    socket.to(socketId).emit('offer', socket.id, description);
  });

  // Send Answer From Offer Request
  socket.on('answer', (socketId, description) => {
    socket.to(socketId).emit('answer', description);
  });

  // Send Signals to Establish the Communication Channel
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  // Remove client when socket is disconnected
  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  });
});

// Return Index HTML when access root route
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

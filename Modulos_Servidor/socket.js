//Módulo local servidor.js
const ser = require('./servidor.js');

//Módulo SocketIO que permite crear aplicaciones web en tiempo real.
//Permite la comunicación bidireccional en tiempo real entre el cliente y el servidor web.
const SocketIO = require('socket.io');

//Implementacion de SocketIO en el Servidor
const io = SocketIO(ser.server);

let connectedUsers = [];

// Llamada cuando un cliente inicia una conexión de socket
io.on('connection', (socket) => {
  // Es necesario que el socket conozca a todos los clientes conectados
  connectedUsers.push(socket.id);

  // Emitirme los otros usuarios conectados a la matriz para iniciar una conexión con cada uno de ellos.
  const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  socket.emit('other-users', otherUsers);

  // Enviar oferta para iniciar la conexión
  socket.on('offer', (socketId, description) => {
    socket.to(socketId).emit('offer', socket.id, description);
  });

  // Enviar respuesta de solicitud de oferta
  socket.on('answer', (socketId, description) => {
    socket.to(socketId).emit('answer', description);
  });

  // Enviar señales para establecer el canal de comunicación
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  // Eliminar cliente cuando el socket está desconectado
  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  });
});

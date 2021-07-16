//Módulo local servidor.js
const servidor = require('./servidor.js');

//Módulo SocketIO que permite crear aplicaciones web en tiempo real.
//Permite la comunicación bidireccional en tiempo real entre el cliente y el servidor web.
const SocketIO = require('socket.io');

//Implementacion de SocketIO en el Servidor
const io = SocketIO(servidor.server);

let usuariosConectados = [];

// Llamada cuando un cliente inicia una conexión de socket
io.on('connection', (socket) => {
  // Es necesario que el socket conozca a todos los clientes conectados
  usuariosConectados.push(socket.id);

  // Emitirme los otros usuarios conectados a la matriz para iniciar una conexión con cada uno de ellos.
  // El metodo "filter" crea un nuevo array con los elementos que cumpla la condicion implementada
  // Ejemplo 1:    [Arreglo que contiene objetos].filter( condicion )  --->  retorna un arreglo con los elementos que cumplan la condicion
  // Ejemplo 2:    [Arreglo que contiene objetos].filter( funcion )    --->  retorna un arreglo con los elementos que cumplan la condicion
  const otrosUsuarios = usuariosConectados.filter(socketId => socketId !== socket.id);
  socket.emit('other-users', otrosUsuarios);

  // Enviar oferta para iniciar la conexión
  socket.on('offer', (socketId, descripcion) => {
    socket.to(socketId).emit('offer', socket.id, descripcion);
  });

  // Enviar respuesta de solicitud de oferta
  socket.on('answer', (socketId, descripcion) => {
    socket.to(socketId).emit('answer', descripcion);
  });

  // Enviar señales para establecer el canal de comunicación
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  // Eliminar cliente cuando el socket está desconectado
  socket.on('disconnect', () => {
    usuariosConectados = usuariosConectados.filter(socketId => socketId !== socket.id);
  });
});

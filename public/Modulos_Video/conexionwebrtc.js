import {messageInput,sendButton,remoteVideo,logMessage} from './identificadores.js';

export const initConnection = (stream) => {
  const socket = io('/');
  let localConnection;
  let remoteConnection;
  let localChannel;
  let remoteChannel;

  // Inicie una RTCPeerConnection para cada cliente
  socket.on('other-users', (otherUsers) => {
    // Ignorar cuando no exista otros usuarios conectados.
    if (!otherUsers || !otherUsers.length) return;

    const socketId = otherUsers[0];

    // Iniciar conexión entre pares
    localConnection = new RTCPeerConnection();

    // Agregar todas las pistas de la transmisión a la conexión entre pares
    stream.getTracks().forEach(track => localConnection.addTrack(track, stream));

    // Enviar candidatos para establecer un canal de comunicación para enviar flujo y datos
    localConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit('candidate', socketId, candidate);
    };

    // Reciba la transmisión desde el cliente remoto y agregue al área de video remoto
    localConnection.ontrack = ({ streams: [ stream ] }) => {
      remoteVideo.srcObject = stream;
    };

    // Inicie el canal para charlar
    localChannel = localConnection.createDataChannel('chat_channel');

    // Llamada a función que recibe un mensaje en el canal
    localChannel.onmessage = (event) => logMessage(`Receive: ${event.data}`);
    // Function Called When Channel is Opened
    localChannel.onopen = (event) => logMessage(`Channel Changed: ${event.type}`);
    // Function Called When Channel is Closed
    localChannel.onclose = (event) => logMessage(`Channel Changed: ${event.type}`);

    // Crear oferta, establecer descripción local y enviar oferta a otros usuarios conectados
    localConnection
      .createOffer()
      .then(offer => localConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit('offer', socketId, localConnection.localDescription);
      });
  });

  // Recibir oferta de otro cliente
  socket.on('offer', (socketId, description) => {
    // Iniciar conexión entre pares
    remoteConnection = new RTCPeerConnection();

    // Add all tracks from stream to peer connection
    stream.getTracks().forEach(track => remoteConnection.addTrack(track, stream));

    // Agregar todas las pistas de la transmisión a la conexión entre pares
    remoteConnection.onicecandidate = ({ candidate }) => {
      candidate && socket.emit('candidate', socketId, candidate);
    };

    // Reciba la transmisión desde el cliente remoto y agregue al área de video remoto
    remoteConnection.ontrack = ({ streams: [ stream ] }) => {
      remoteVideo.srcObject = stream;
    };

    // Chanel recibido
    remoteConnection.ondatachannel = ({ channel }) => {
      // Store Channel
      remoteChannel = channel;

      // Llamada a funcion que recibe un mensaje en el canal
      remoteChannel.onmessage = (event) => logMessage(`Receive: ${event.data}`);
      // Función llamada cuando se abre el canal
      remoteChannel.onopen = (event) => logMessage(`Channel Changed: ${event.type}`);
      // Función llamada cuando el canal está cerrado
      remoteChannel.onclose = (event) => logMessage(`Channel Changed: ${event.type}`);
    }

    // Establecer descripción local y remota y crear respuesta
    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then(answer => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit('answer', socketId, remoteConnection.localDescription);
      });
  });

  // Recibir respuesta para establecer conexión entre pares
  socket.on('answer', (description) => {
    localConnection.setRemoteDescription(description);
  });

  // Reciba candidatos y agregue a la conexión entre pares
  socket.on('candidate', (candidate) => {
    // GET Conexión local o remota
    const conn = localConnection || remoteConnection;
    conn.addIceCandidate(new RTCIceCandidate(candidate));
  });

  // Asigne el clic del botón de mensaje
  sendButton.addEventListener('click', () => {
    // GET mensaje de entrada
    const message = messageInput.value;
    // Limpiar entrada
    messageInput.value = '';
    // Mensaje de registro como enviado
    logMessage(`Send: ${message}`);

    // GET el canal (puede ser local o remoto)
    const channel = localChannel || remoteChannel;
    // Enviar mensaje. El otro cliente recibirá este mensaje en la función 'onmessage' del canal
    channel.send(message);
  });
}

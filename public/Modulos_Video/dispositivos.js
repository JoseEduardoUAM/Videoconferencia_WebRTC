import { videoGrid , localVideo } from './identificadores.js';
import {initConnection} from './conexionwebrtc.js';

// Abrir la capara para capturar audio y video
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    // Show My Video
    videoGrid.style.display = 'grid';
    localVideo.srcObject = stream;
    // Start a Peer Connection to Transmit Stream
    initConnection(stream);
}).catch(error => console.log(error));

console.log("Entro al modulo de dispositivos");

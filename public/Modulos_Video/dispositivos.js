import { videoGrid , localVideo } from './identificadores.js';
import {initConnection} from './conexionwebrtc.js';

// Abrir la capara para capturar audio y video
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    // Mostrar mi Video
    videoGrid.style.display = 'grid';
    localVideo.srcObject = stream;
    // Inicie una conexión de pares para transmitir la transmisión
    initConnection(stream);
}).catch(error => console.log(error));

console.log("Entro al modulo de dispositivos");

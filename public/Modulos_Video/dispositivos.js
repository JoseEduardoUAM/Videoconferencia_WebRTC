import { contenedorVideo , videoLocal } from './identificadores.js';
import {iniciarConexion} from './conexionwebrtc.js';

// Abrir la capara para capturar audio y video
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    // Mostrar mi Video
    contenedorVideo.style.display = 'grid';
    videoLocal.srcObject = stream;
    // Inicie una conexión de pares para transmitir la transmisión
    iniciarConexion(stream);
}).catch(error => console.log(error));

console.log("Entro al modulo de dispositivos");

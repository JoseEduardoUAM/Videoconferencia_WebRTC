//Identificadores de elementos HTML
export const contenedorVideo = document.getElementById('contenedor-video');

const contenedorMensajes = document.querySelector('.mensajes');

export const entradaMensaje = document.getElementById('entrada-mensaje');

export const botonEnviar = document.getElementById('boton-mensaje');

export const videoLocal = document.getElementById('video-local');

export const videoRemoto = document.getElementById('video-remoto');

export const registrarMensaje = (msg) => {
  const nuevoMensaje = document.createElement('div');
  nuevoMensaje.innerText = msg;
  contenedorMensajes.appendChild(nuevoMensaje);
};

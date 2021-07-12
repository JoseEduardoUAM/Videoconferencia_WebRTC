//Identificadores de elementos HTML
export const videoGrid = document.getElementById('video-grid');

const messagesEl = document.querySelector('.messages');

export const messageInput = document.getElementById('message-input');

export const sendButton = document.getElementById('message-button');

export const localVideo = document.getElementById('local-video');

export const remoteVideo = document.getElementById('remote-video');

export const logMessage = (message) => {
  const newMessage = document.createElement('div');
  newMessage.innerText = message;
  messagesEl.appendChild(newMessage);
};

console.log("Entro al modulo identificadores");

const chatform = document.getElementById('chat-form'),
      messages = document.getElementById('msg'),
      chatmessages = document.querySelector('.chat');

const socket = io.connect();


socket.on('message', (message) => {
  outputMessage(message);

  chatmessages.scrollTop = chatmessages.scrollHeight;
});

chatform.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    msg.trim();
  
    if (!msg){
        return false;
    }

    socket.emit('chatmessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});      

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML += `${message.message} <br><span class="name-and-time">${message.name} : ${message.date} • ${message.time}</span>`;
  document.querySelector('.current').appendChild(div);
};

const socket = io('http://localhost:8000');

//get dom elements in repective js variable
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const chatBox = document.querySelector('.chat-box');

//Audio that will play on recieving messages
var audio = new Audio('../files/iphone_text_message.mp3');


//function which will append event to the container
const mappend = (message, position) =>{
    const messageElement = `<div class="chat ${position}">
    <div class="details">
        <p>${message}</p>
    </div>
</div>`;
    chatBox.innerHTML += messageElement;
    if(position =='incoming'){
        audio.play();
    }
}



//Ask new user for his/her name and let the server know
var username = prompt("Enter your name to join");

socket.emit('new-user-joined', username);


//if a new user joins receive his/her name from the server 
socket.on('user-joined', username=> {
    // append(`${username} joined the chat`,'incoming')
    mappend(`${username} joined the chat`, 'incoming');
})

//if server sends a message , receive it
socket.on('receive', data => {
    mappend(`${data.name}:${data.message} `, 'incoming')
})

//if a user leaves the chate append the info to the chatbox
socket.on('left', username => {
    mappend(`${username} left the chat `, 'incoming')
})


//if the form get submitted,send server the message
form.addEventListener('submit',(e) =>{
    e.preventDefault();
    const message = messageInput.value;
    mappend(`You: ${message}`,'outgoing');
    socket.emit('send',message);
    messageInput.value = '';
})

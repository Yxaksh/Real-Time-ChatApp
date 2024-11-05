// Establish a connection to the server at localhost:8000
const socket = io('http://localhost:8000');

// Select DOM elements for the form, message input, and message container
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Create a new audio object for message notifications
var audio = new Audio('ting.mp3');

// Function to append messages to the message container
const append = (message, position) => {
    // Create a new div element to hold the message
    const messageElement = document.createElement('div');
    
    // Set the message text and add the 'message' class
    messageElement.innerText = message;
    messageElement.classList.add('message');
    
    // Add the position class ('left' or 'right') to style the message accordingly
    messageElement.classList.add(position);
    
    // Append the message to the container
    messageContainer.append(messageElement);
    
    // Play a sound if the message is from another user (position is 'left')
    if (position === 'left') {
        audio.play();
    }
}

// Prompt the user to enter their name and emit an event to notify the server
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// Event listener to handle form submission and send messages
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form default behavior (page reload)
    
    // Get the message input value and append it to the chat
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    
    // Emit the 'send' event to the server with the message
    socket.emit('send', message);
    
    // Clear the message input field after sending the message
    messageInput.value = '';
});

// Listen for the 'user-joined' event from the server
socket.on('user-joined', userName => {
    // Notify all users that a new user has joined
    append(`${userName} joined the chat`, 'right');
});

// Listen for incoming messages from the server
socket.on('receive', data => {
    // Append the received message to the chat
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for the 'left' event to notify when a user leaves the chat
socket.on('left', userName => {
    // Notify all users when someone leaves the chat
    append(`${userName} left the chat`, 'left');
});

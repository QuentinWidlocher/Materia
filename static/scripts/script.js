const socket = io.connect('http://' + document.domain + ':' + location.port);
const messages = [];

socket.onopen = () => {
    socket.send('connect');
};

socket.on('message', (message) => {
    addMessage(JSON.parse(message));
});

function sendMessage() {
    const messageBox = document.querySelectorAll('#messageBox')[0];

    const message = {
        from: "/users/1",
        to: "/users/1",
        body: messageBox.value,
        date_sent: Date.now(),
    };

    socket.emit('message', JSON.stringify(message), (response) => {
        addMessage(message);
        messageBox.value = "";
    });
}

function addMessage(messageToAdd) {
    const messageList = document.querySelectorAll('#messageList')[0];
    
    messages.push(messageToAdd);

    while (messageList.firstChild) {
        messageList.removeChild(messageList.firstChild);
    }

    messages.forEach(message => {
        let node = document.createElement("LI"); // Create a <li> node
        let textnode = document.createTextNode('(' + message.datetime + ') : ' + message.message);
        node.appendChild(textnode); // Append the text to <li>
        messageList.appendChild(node); // Append <li> to <ul> with id="myList"
    });

}
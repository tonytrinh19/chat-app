const socket = io()
const form = document.querySelector('#form-message')
const message = document.querySelector('#message-input')
socket.on('welcome', (welcome) => {
    console.log(welcome)
})

// document.querySelector('#incButn').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })

form.addEventListener('submit', (e) => {
    e.preventDefault()

    socket.emit('sendMessage', message.value)
    message.value = ''
})

socket.on('receivedMessage', (message) => {
    console.log(message)
})
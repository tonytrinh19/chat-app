const socket = io()
const form = document.querySelector('#form-message')
socket.on('message', (welcome) => {
    console.log(welcome)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // e is the form, selecting message element of form
    const message = e.target.elements.message

    socket.send(message.value)

    message.value = ''
})

socket.on('receivedMessage', (message) => {
    console.log(message)
})
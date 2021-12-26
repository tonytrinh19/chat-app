const socket = io()
const form = document.querySelector('#form-message')
const sendLocationButton = document.querySelector('#send-location')

// Classic request-response
// server/client (emit) -> client/server (receive) --acknowledgement--> server/client

socket.on('message', (welcome) => {
    console.log(welcome)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // e is the form, selecting message element of form
    const message = e.target.elements.message
    // acknowledgement is the last param.
    // The function is called when the server called callback() function
    socket.send(message.value, (msg) => {
        console.log(`${msg}`)
    })

    message.value = ''
})

socket.on('receivedMessage', (message) => {
    console.log(message)
})

sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // Not supporting promise or async, using callback
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        })
    })
})
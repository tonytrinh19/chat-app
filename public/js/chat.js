const socket = io()

// Elements
const $form = document.querySelector('#form-message')
const $sendMessageButton = document.querySelector('#send-msg-btn')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Classic request-response using acknowledgement
// server/client (emit) -> client/server (receive) --acknowledgement--> server/client
socket.on('message', (welcome) => {
    console.log(welcome)
})

socket.on('receivedMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {
        location: url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    // e is the form, selecting message element of form
    const messageInput = e.target.elements.message
    $sendMessageButton.setAttribute('disabled', true)

    // acknowledgement is the last param.
    // The function is called when the server called callback() function
    socket.send(messageInput.value, (error, msg) => {
        messageInput.value = ''
        $sendMessageButton.removeAttribute('disabled')
        messageInput.focus()
        if (error) {
            return console.log(`${error}`)
        }
        console.log(`${msg}`)
    })
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', true)

    // Not supporting promise or async, using callback
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('shareLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})
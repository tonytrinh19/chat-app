const socket = io()

// Elements
const $form                 = document.querySelector('#form-message')
const $sendMessageButton    = document.querySelector('#send-msg-btn')
const $sendLocationButton   = document.querySelector('#send-location')
const $messages             = document.querySelector('#messages')
var $sidebar                = document.querySelector('#sidebar')

// Templates
const messageTemplate       = document.querySelector('#message-template').innerHTML
const locationTemplate      = document.querySelector('#location-template').innerHTML
const sidebarTemplate       = document.querySelector('#sidebar-template').innerHTML

// Options
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
const getStyles = (curUsername) => {
    var style = 'row'
    var bgColor = 'gray'
    var textAlign = 'left'
    if (username.toLowerCase() === curUsername) {
        style = 'row-reverse'
        bgColor = '#0070CC'
        textAlign = 'right'
    }
    return {
        style,
        bgColor,
        textAlign
    }
}

// Scrolls the screen if the user is looking at the lastest message only
const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Classic request-response using acknowledgement
// server/client (emit) -> client/server (receive) --acknowledgement--> server/client

socket.on('roomData', ({
    room,
    users
}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})

socket.on('message', (message) => {
     const options = getStyles(message.username)

    // Uses moment library to manipulate time output
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A'),
        username: message.username,
        ...options
    })



    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const options = getStyles(message.username)

    const html = Mustache.render(locationTemplate, {
        location: message.url,
        createdAt: moment(message.createdAt).format('hh:mm A'),
        username: message.username,
        ...options
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.emit('joinRoom', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
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
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

// Needs the original http because express set http behind the scene and we don't have access to http anymore
// Do it this way to pass express to server and then create a socket server
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {
    createMessage,
    createLocationMessage
} = require('./utils/messages')

const port = process.env.PORT
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))


// On a new connection occur, built-in event
io.on('connection', (socket) => {
    console.log('New web socket connection.')

    socket.emit('message', createMessage('Welcome!'))

    socket.broadcast.emit('message', createMessage('A new user has joined'))

    socket.on('message', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        if (!message) {
            return callback('Cannot send an empty message')
        }
        io.emit('receivedMessage', createMessage(message))
        callback('', 'Message delivered!')
    })

    socket.on('shareLocation', (coords, callback) => {
        io.emit('locationMessage', createLocationMessage({
            lat: coords.lat,
            lon: coords.lon
        }))
        callback()
    })

    // Built-in event
    socket.on('disconnect', (reason) => {
        io.emit('message', createMessage('A user has left'))
        console.log('Client disconnected')
    })

})



server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
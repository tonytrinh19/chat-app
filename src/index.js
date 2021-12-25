const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

// Needs the original http because express set http behind the scene and we don't have access to http anymore
// Do it this way to pass express to server and then create a socket server
const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))


// On a new connection occur, built-in event
io.on('connection', (socket) => {
    console.log('New web socket connection.')

    socket.emit('message', 'Welcome!')

    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('message', (message) => {
        io.emit('receivedMessage', message)
    })

    socket.on('shareLocation', (coords) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.lat},${coords.lon}`)
    })

    // Built-in event
    socket.on('disconnect', (reason) => {
        io.emit('message', 'A user has left')
        console.log('Client disconnected')
    })

})



server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
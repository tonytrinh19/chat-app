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


// On a new connection occur
io.on('connection', (socket) => {
    console.log('New web socket connection.')

    socket.emit('welcome', 'Welcome!')

    // socket.on('increment', () => {
    //     count++
    //     // socket.emit('countUpdated', count) 
    //     io.emit('countUpdated', count)
    // })

    socket.on('sendMessage', (message) => {
        io.emit('receivedMessage', message)
    })
})



server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
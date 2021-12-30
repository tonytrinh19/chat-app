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

const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users')

const port = process.env.PORT
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))


// On a new connection occur, built-in event
io.on('connection', (socket) => {
    console.log('New web socket connection.')

    

    socket.on('joinRoom', ( { username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)
        
        socket.emit('message', createMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message', createMessage(`${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
         
        socket.on('message', (message, callback) => {
            const filter = new Filter()
    
            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed')
            }
            if (!message) {
                return callback('Cannot send an empty message')
            }
            io.to(user.room).emit('message', createMessage(message, user.username))
            callback('', 'Message delivered!')
        })

        socket.on('shareLocation', (coords, callback) => {
            io.to(user.room).emit('locationMessage', createLocationMessage({
                lat: coords.lat,
                lon: coords.lon
            }, user.username))
            callback()
        })

        callback()
    })

    // Built-in event
    socket.on('disconnect', (reason) => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', createMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})



server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
// Generates objects to emit back to the client
const createMessage = (text, username = 'Admin') => {
    return {
        username,
        text,
        createdAt: new Date().getTime()        
    }
}

const createLocationMessage = (coords, username) => {
    return {
        username,
        url: `https://www.google.com/maps?q=${coords.lat},${coords.lon}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    createMessage,
    createLocationMessage
}
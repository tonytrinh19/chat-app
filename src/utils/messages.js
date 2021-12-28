// Generates objects to emit back to the client
const createMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const createLocationMessage = (coords) => {
    return {
        url: `https://www.google.com/maps?q=${coords.lat},${coords.lon}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    createMessage,
    createLocationMessage
}
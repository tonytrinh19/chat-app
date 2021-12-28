// Generates objects to emit back to the client
const createMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    createMessage
}
const WebSocket = require('ws');

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            console.log(`Received message => ${message}`);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
};

module.exports = setupWebSocket;
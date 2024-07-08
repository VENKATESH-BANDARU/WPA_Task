const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const passport = require('./config/passport');
const { sequelize } = require('./models/index.model');
const indexRoutes = require('./routes/index');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(passport.initialize());

app.use('/api/v1', indexRoutes);


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

const clients = {}; // Store clients by userId
const postSubscriptions = {}; // Store subscriptions by postId

// Handle WebSocket connections
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const { type, userId, postId } = data;

        switch (type) {
            case 'subscribeUser':
                if (!clients[userId]) {
                    clients[userId] = [];
                }
                clients[userId].push(ws);
                break;

            case 'subscribePost':
                if (!postSubscriptions[postId]) {
                    postSubscriptions[postId] = [];
                }
                postSubscriptions[postId].push(ws);
                break;

            default:
                console.log('Unknown subscription type');
                break;
        }
    });

    ws.on('close', () => {
        for (const userId in clients) {
            clients[userId] = clients[userId].filter(client => client !== ws);
        }
        for (const postId in postSubscriptions) {
            postSubscriptions[postId] = postSubscriptions[postId].filter(client => client !== ws);
        }
    });
});


const notifyClients = (type, data) => {
    const { userId, postId } = data;

    if (type === 'userActivity' && clients[userId]) {
        clients[userId].forEach(client => client.send(JSON.stringify(data)));
    }

    if (type === 'postActivity' && postSubscriptions[postId]) {
        postSubscriptions[postId].forEach(client => client.send(JSON.stringify(data)));
    }
};

module.exports = {
    notifyClients,
    clients,
    postSubscriptions
};
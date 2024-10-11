import express from 'express'
import mongoose from "mongoose";
import { LoverController } from './controllers/index.js';
import cors from 'cors';
import timeout from "connect-timeout";
import rateLimit from "express-rate-limit";
import {Eureka} from "eureka-js-client";
import { createServer } from 'http';
import { Server } from 'socket.io';
// import startGrpcServer from './grpcServer.js';

const app = express();
const server = createServer(app);
const io = new Server(server);
const lobbies = {};

const client = new Eureka({
    instance: {
        instanceId: `lover:${Math.random().toString(36).substr(2, 16)}`,
        app: 'lover',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3001,
            '@enabled': 'true',
        },
        vipAddress: 'lover',
        homePageUrl: 'http://localhost:3001/',
        statusPageUrl: 'http://localhost:3001/status',
        register: 'http://localhost:3001/lover/create',
        order: 'http://localhost:3001/lover/order',
        giveOrder: 'http://localhost:3001/lover/giveOrder/:id',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8008,
        servicePath: '/eureka/apps/'
    }
});

client.start(error => {
    console.log('Eureka client started with error:', error);
});

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(express.json());
app.use(cors());
app.use(timeout('1s'));

function haltOnTimeOut(req, res, next) {
    if (!req.timedout) next();
}
app.use(haltOnTimeOut);

mongoose.connect('mongodb://localhost:27017/MyDatabase').then(() => {
    console.log("DB ok");
}).catch((err) => console.log('DB error', err))

app.post('/lover/create', LoverController.create);

app.post('/lover/order', LoverController.order);

app.post('/lover/giveOrder/:id', LoverController.giveOrder);

app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        message: 'Service is running',
        timestamp: new Date().toISOString(),
    });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Create or join a lobby (room)
    socket.on('joinLobby', (lobbyName, username) => {
        // If the lobby doesn't exist, create it
        if (!lobbies[lobbyName]) {
            lobbies[lobbyName] = {
                users: []
            };
        }

        // Add user to the lobby's list
        lobbies[lobbyName].users.push(username);

        // Join the Socket.IO room
        socket.join(lobbyName);
        socket.currentLobby = lobbyName;

        // Notify the lobby about the new user
        io.to(lobbyName).emit('userJoined', {
            username,
            message: `${username} has joined the lobby ${lobbyName}.`
    });

        // Send the updated list of users in the lobby
        io.to(lobbyName).emit('lobbyUsers', {
            lobbyName,
            users: lobbies[lobbyName].users
        });

        console.log(`${username} joined lobby: ${lobbyName}`);
    });

    // Leave the lobby
    socket.on('leaveLobby', (username) => {
        const lobbyName = socket.currentLobby;
        if (lobbyName && lobbies[lobbyName]) {
            // Remove the user from the lobby's list
            lobbies[lobbyName].users = lobbies[lobbyName].users.filter(user => user !== username);

            // Leave the Socket.IO room
            socket.leave(lobbyName);

            // Notify the lobby about the user leaving
            io.to(lobbyName).emit('userLeft', {
                username,
                message: `${username} has left the lobby ${lobbyName}.`
        });

            // Send updated list of users in the lobby
            io.to(lobbyName).emit('lobbyUsers', {
                lobbyName,
                users: lobbies[lobbyName].users
            });

            console.log(`${username} left lobby: ${lobbyName}`);
        }
    });

    // Messaging inside the lobby
    socket.on('message', (message, username) => {
        const lobbyName = socket.currentLobby;
        if (lobbyName) {
            io.to(lobbyName).emit('message', {
                username,
                message
            });
            console.log(`${username}: ${message}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// startGrpcServer();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

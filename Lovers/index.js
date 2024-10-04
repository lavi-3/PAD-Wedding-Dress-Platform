import express from 'express'
import mongoose from "mongoose";
import { LoverController } from './controllers/index.js';
import cors from 'cors';
import timeout from "connect-timeout";
import rateLimit from "express-rate-limit";
import {Eureka} from "eureka-js-client";

const app = express();

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
// Start Eureka client
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

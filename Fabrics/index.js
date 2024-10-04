import express from 'express'
import mongoose from "mongoose";
import { FabricController } from './controllers/index.js';
import cors from 'cors';
import timeout from "connect-timeout";
import rateLimit from "express-rate-limit";
import {Eureka} from "eureka-js-client";

const app = express();

const client = new Eureka({
    instance: {
        instanceId: `fabric:${Math.random().toString(36).substr(2, 16)}`,
        app: 'fabric',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3000,
            '@enabled': 'true',
        },
        vipAddress: 'fabric',
        homePageUrl: 'http://localhost:3000/',
        statusPageUrl: 'http://localhost:3000/status',
        register: 'http://localhost:3001/fabric/create',
        findOrderId: 'http://localhost:3001/fabric/findOrder/:id',
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

mongoose.connect('mongodb://localhost:27018/MyDatabase').then(() => {
    console.log("DB ok");
}).catch((err) => console.log('DB error', err))

app.post('/fabric/create', FabricController.create);

app.post('/fabric/findOrder/:id', FabricController.findOrder);

app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        message: 'Service is running',
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

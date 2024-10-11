import express from 'express';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { order } from '../controllers/loverController.js';
import * as chai from 'chai';
const { expect } = chai;

const app = express();
app.use(express.json());
app.post('/lover/order', order);

before(async () => {
    await mongoose.connect('mongodb://localhost:27017/MyDatabase');
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Order API', () => {
    it('should create a new order and return it', async () => {
        const newOrder = {
            dress: "Elegant dress",
            material: "Cotton",
            price: 500,
            date: "04/10/2024"
        };

        const res = await supertest(app) // Use supertest to make requests
            .post('/lover/order')
            .send(newOrder);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.include(newOrder);
    });

    // it('should return an error if order creation fails', async () => {
    //     const res = await supertest(app)
    //         .post('/lover/order')
    //         .send({});
    //
    //     expect(res.status).to.equal(500);
    //     expect(res.body).to.have.property('message', 'Error: Book was not created');
    // });
});

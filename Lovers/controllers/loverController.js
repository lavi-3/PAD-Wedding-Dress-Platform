import LoverModel from "../models/Lover.js";
import OrderModel from "../models/Order.js";
import * as redis from "redis";

const redisClient = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379,
    },
});
redisClient.connect().catch(console.error);

export const create = async (req, res) => {
    try {
        const doc = new LoverModel({
            name: req.body.name, location: req.body.location, orderId: req.body.orderId,
        });
        const book = await doc.save();
        res.json(book);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Book was not created'
        })
    }
}


export const order = async (req, res) => {
    try {
        const doc = new OrderModel({
            dress: req.body.dress, material: req.body.material, price: req.body.price, date: req.body.date
        });
        const order = await doc.save();
        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Book was not created'
        })
    }
}

export const giveOrder = async (req, res) => {
    try {
        const loverId = req.params.id;
        const lover = await LoverModel.findById(loverId)

        const cachedOrder = await redisClient.get(`order:${lover.orderId}`);

        if (cachedOrder) {
            console.log("order from Redis");
            return res.json(JSON.parse(cachedOrder));
        }

        const orderId = lover.orderId;
        const order = await OrderModel.findById(orderId);

        await redisClient.set(`order:${orderId}`, JSON.stringify(order), { EX: 3600 });

        return res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error: Something went wrong'
        })
    }
}


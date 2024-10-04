import mongoose from "mongoose";

// Database Object structure
const OrderSchema = new mongoose.Schema({
    dress: {
        type: String,
    },
    material: {
        type: String,
    },
    price: {
        type: Number,
    },
    date: {
        type: String,
    },
});

export default mongoose.model('order', OrderSchema);

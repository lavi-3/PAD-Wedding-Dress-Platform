import mongoose from "mongoose";

// Database Object structure
const LoverSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
    },

});

export default mongoose.model('lover', LoverSchema);

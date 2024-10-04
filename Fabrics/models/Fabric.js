import mongoose from "mongoose";

// Database Object structure
const FabricSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },

});

export default mongoose.model('fabric', FabricSchema);

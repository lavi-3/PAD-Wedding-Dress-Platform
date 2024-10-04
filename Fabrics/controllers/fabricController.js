import FabricModel from "../models/Fabric.js";
import axios from "axios";


export const create = async (req, res) => {
    try {
        const doc = new FabricModel({
            name: req.body.name, location: req.body.location, descriptiopn: req.body.description
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

export const findOrder = async (req, res) => {
    try {
        const loverId = req.params.id;
        const response = await axios.post(`http://localhost:3001/lover/giveOrder/${loverId}`);

        return res.json(response.data);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
}




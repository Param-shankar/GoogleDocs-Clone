import mongoose from "mongoose";

const DocSchema = new mongoose.Schema({
    _id: String,
    data:Object,
})

const DocModel = mongoose.model('docmodel', DocSchema);
export default DocModel;

const mongoose = require("mongoose");
const Vaccination = new mongoose.Schema({
    id: { type: String, required: true },
    desc: { type: String, required: false },
    title: { type: String, required: true },
    district: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    registered: { type: Number, default: 0 },
    location: { type: String, required: true },
    funds: { type: Number, default: 0 },
    organizer: { type: String, required: true },

})
module.exports = mongoose.model("Vaccination", Vaccination)
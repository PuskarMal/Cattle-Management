const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    districtName: { type: String, required: true },
    Type: { type: String, enum: ['Rural', 'Urban'], required: true },
    EXCBMale: { type: Number, default: 0 },
    EXCBFemale: { type: Number, default: 0 },
    EXCBInMilk: { type: Number, default: 0 },
    IndigMale: { type: Number, default: 0 },
    IndigFemale: { type: Number, default: 0 },
    IndigInMilk: { type: Number, default: 0 },
    BuffaloMale: { type: Number, default: 0 },
    BuffaloFemale: { type: Number, default: 0 },
    BuffaloInMilk: { type: Number, default: 0 }
});

module.exports = mongoose.model('stateDistrict', districtSchema);
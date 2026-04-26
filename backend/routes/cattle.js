const Cattle = require("../models/cattle");
const router = require("express").Router();
const User = require("../models/user");
const Dist = require("../models/district");

router.get("/my-cattle", async (req, res) => {
  
  const userId = req.headers.id;
  const user = await User.findOne({ user_id: userId });
  const cattle = await Cattle.find({
    owner_id: user._id
    });
  
  res.json(cattle);
});

router.get("/all-districts", async (req, res) => {
  const districts = await Dist.find();
  res.json(districts);
});

router.get("/district-analysis/:district", async (req, res) => {
  const district = req.params.district;
  const type = req.headers.type
  if(type!="Total"){
    const districtData = await Dist.findOne({ districtName:district, Type:type });  
    res.json(districtData);
  }
  else{
    const districtData = await Dist.find({districtName: district}, '-_id -__v');
    res.json(districtData);
  }
  
});

module.exports = router;

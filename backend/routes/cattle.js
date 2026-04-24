const Cattle = require("../models/cattle");
const router = require("express").Router();
const User = require("../models/user");

router.get("/my-cattle", async (req, res) => {
  
  const userId = req.headers.id;
  const user = await User.findOne({ user_id: userId });
  const cattle = await Cattle.find({
    owner_id: user._id
    });
  
  res.json(cattle);
});

module.exports = router;

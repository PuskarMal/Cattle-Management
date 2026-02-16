const router = require('express').Router();

const Cattle = require("../models/cattle")
const {buildFamilyTree} = require("../utils/FamilyTree")


router.patch("/link-parents/:id", async (req, res) => {
  const { sire_id, dam_id } = req.body;

  const cattle = await Cattle.findOne({unique_id : req.params.id});

  if (dam_id) {
    const dam = await Cattle.findOne({unique_id: dam_id});
    const sire = await Cattle.findOne({unique_id: sire_id});
    const children = await Cattle.find({$or: [{sire_id: sire._id}, {dam_id: dam._id}]});
    
    if (dam.gender !== "Female") {
      return res.status(400).json({ error: "Dam must be female" });
    
    }
    cattle.sire_id = sire._id;
  cattle.dam_id = dam._id;
  cattle.children = children.map(child => child._id);
  }
  

  

  await cattle.save();
  res.json({ message: "Parents linked successfully" });
});
router.get("/cattle-family-tree/:id", async (req, res) => {
  try {
    
    const tree = await buildFamilyTree(req.params.id, 4);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ err});
    console.log(err)
  }
});

module.exports = router

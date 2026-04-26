const Vaccination = require("../models/vaccination");
const router = require("express").Router();
const User = require("../models/user");
router.post("/create-vEvent", async (req, res) => {
    try {
        const newEvent = new Vaccination(req.body);
        console.log(newEvent)
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/get-vEvents/:district", async (req, res) => {
    try {
        
        const events = (((await Vaccination.find()).filter((e) => e.district === req.params.district)));
        res.status(200).json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/update-vEvents/:id", async (req, res) => {
    try {
        console.log(req.body)
        const updatedEvent = await Vaccination.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/delete-vEvents/:id", async (req, res) => {
    try {
        await Vaccination.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;

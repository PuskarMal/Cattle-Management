const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct, getProducts } = require('../controllers/productController');
const Marketplace = require('../models/Marketplace');
// Setup storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Routes
router.post('/add', upload.single('image'), addProduct);
router.get('/all', getProducts);
router.get('/:id', async (req, res) => {
    try {
        const product = await Marketplace.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
});


module.exports = router;
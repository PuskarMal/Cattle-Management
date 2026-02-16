const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addProduct, getProducts } = require('../controllers/productController');

// Setup storage for images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Routes
router.post('/add', upload.single('image'), addProduct);
router.get('/all', getProducts);

module.exports = router;
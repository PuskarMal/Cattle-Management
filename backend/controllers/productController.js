const Marketplace = require('../models/Marketplace');

exports.addProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    // Image is required
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const {
      breed_name,
      listing_type,
      price_or_fee,
      description,
      species
    } = req.body;

    // Basic validation
    if (!breed_name || !listing_type || !price_or_fee || !description) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const product = new Marketplace({
      breed_name,
      listing_type,
      price_or_fee: Number(price_or_fee),
      description,
      species,
      image: req.file.path
    });

    await product.save();

    res.status(201).json({
      message: 'Product added successfully',
      data: product
    });

  } catch (error) {
    console.error('ADD PRODUCT ERROR:', error);
    res.status(500).json({
      error: 'Failed to add product',
      details: error.message
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Marketplace.find().sort({ created_at: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    res.status(500).json({
      error: 'Failed to fetch products'
    });
  }
};
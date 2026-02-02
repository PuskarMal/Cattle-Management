import React, { useState, useEffect } from 'react';

const SAMRIDHI_MARKETPLACE = () => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]); // State for live products
  const [loading, setLoading] = useState(true);

  const backendURL = "http://localhost:3000"; // Your server URL

  // 1. Fetch products from MongoDB on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendURL}/api/products/all`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.breed_name || product.name} added to cart!`);
  };

  // 2. Filter logic (works with MongoDB field names)
  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.listing_type === activeCategory || p.category === activeCategory);

  return (
    <div className='p-5 min-h-screen'>
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Marketplace
        </h2>
    </div>
  )
}

export default SAMRIDHI_MARKETPLACE;
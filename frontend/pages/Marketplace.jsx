import React, { useState, useEffect } from 'react';

const SAMRIDHI_MARKETPLACE = () => {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]); // State for live products
  const [loading, setLoading] = useState(true);

  const backendURL = "https://cattle-management-ptz0.onrender.com"; // Your server URL
  const categories = ['All','Nutrition', 'Health', 'Hardware', 'Breeding']

  // 1. Fetch products from MongoDB on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendURL}/api/products/all`);
        const data = await response.json();
        console.log(data)
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
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        Marketplace
      </h2>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm border ${
              activeCategory === cat
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-center">Loading products...</p>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-gray-500 text-center">
          No products available in this category.
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {!loading &&
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border p-4 flex flex-col"
            >
              <img
                src={`https://cattle-management-ptz0.onrender.com${product.image}`}
                alt={product.name || product.breed_name}
                className="h-40 object-cover rounded-md mb-3"
              />

              <h3 className="font-semibold text-lg">
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 mb-2">
                {product.description || "No description available"}
              </p>

              <p className="font-bold text-green-600 mb-3">
                ₹ {product.price_or_fee}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-auto bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SAMRIDHI_MARKETPLACE;

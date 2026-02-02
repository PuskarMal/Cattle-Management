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
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        <h2 className="text-[#0b4d61] font-bold text-xl uppercase tracking-tight">Samridhi Store</h2>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-[#0b4d61] hover:bg-gray-100 rounded-full">
            <span className="font-bold uppercase tracking-tight">Cart ({cart.length})</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {["All", "Nutrition", "Health", "Hardware", "Breeding", "Maintenance"].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all 
                ${activeCategory === cat ? 'bg-[#0b4d61] text-white shadow-md' : 'bg-white text-gray-600 border'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading live marketplace...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                  {/* 3. Handle Live Images from Backend vs Static placeholders */}
                  {p.image ? (
                    <img 
                      src={`${backendURL}/${p.image}`} 
                      className="h-full w-full object-cover" 
                      alt={p.breed_name} 
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                  
                  <div className="absolute top-2 left-2 bg-[#0b4d61] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {p.listing_type || p.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                    {p.breed_name || p.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">
                    {p.description || p.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-[#0b4d61]">
                      ₹{p.price_or_fee || p.price}
                    </span>
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-[#0b4d61] hover:bg-[#083a4a] text-white p-2 rounded-lg text-xs transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SAMRIDHI_MARKETPLACE;
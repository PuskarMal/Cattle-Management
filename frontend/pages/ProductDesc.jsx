import React from "react";
import { useParams } from "react-router-dom";

const ProductDesc = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 min-h-screen">
        No product data available
      </div>
    );
  }

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 py-8 bg-gray-100 min-h-screen">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Top Section */}
        <div className="max-w-6xl mx-auto p-6 md:p-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-6 md:p-8">

            {/* ================= IMAGE SECTION ================= */}
            <div className="relative group">

              {/* Glow */}
              <div className="absolute -inset-1  blur-2xl opacity-30 transition duration-500 rounded-2xl"></div>

              <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.breed_name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              {/* Thumbnails */}



              {/* Status badge */}
              <span
                className={`absolute top-4 left-4 px-3 py-1 text-xs rounded-full font-semibold shadow-md
        ${product.status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  }`}
              >
                {product.status}
              </span>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full 
                      bg-gradient-to-r from-green-50 to-emerald-100
                      text-green-700 border border-green-200
                      hover:scale-105 hover:shadow-sm
                      transition cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Ratings */}
              <div className="mt-2">★★★★★ (24)</div>

              {/* Stock */}
              <p className="mt-2 text-green-600">In Stock</p>

              {/* Delivery */}
              <p className="text-xs text-gray-500">Delivery in 3-5 days</p>
            </div>

            {/* ================= DETAILS SECTION ================= */}
            <div className="flex flex-col justify-between space-y-6">

              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.breed_name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">
                    {product.listing_type}
                  </span>
                  <span>Brand: <b>{product.brand}</b></span>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">

                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-green-700">
                    ₹ {product.price_or_fee.toLocaleString()}
                  </p>
                </div>

                <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                  {product.unit}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Specifications
                </h3>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(product.medical_info || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 border rounded-xl p-3 hover:shadow-sm transition"
                    >
                      <p className="text-gray-500 text-xs capitalize">{key}</p>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 border-t pt-3">
                <p><b>ID:</b> {product.animal_id}</p>
                <p><b>Species:</b> {product.species}</p>
                <p>
                  <b>Added:</b>{" "}
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* CTA Button */}
              <button className="w-full mt-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg">
                Add to cart
              </button>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDesc;
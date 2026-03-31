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
      <div className="p-10 text-center text-gray-500">
        No product data available
      </div>
    );
  }

  return (
    <main className="w-full px-4 sm:px-6 md:px-10 py-8 bg-gray-100 min-h-screen">
      
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          
          {/* Image */}
          <div className="w-full h-[250px] sm:h-[300px] md:h-full rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.breed_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                {product.breed_name}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>

              <p className="text-sm text-gray-500">
                Category: {product.listing_type}
              </p>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-green-600">
              ₹ {product.price_or_fee.toLocaleString()}
              <span className="text-sm text-gray-500 ml-2">
                ({product.unit})
              </span>
            </div>

            {/* Status */}
            <span
              className={`inline-block w-fit px-3 py-1 text-xs rounded-full font-medium
              ${
                product.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {product.status}
            </span>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Metadata */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>Animal ID: {product.animal_id}</p>
              <p>Species: {product.species}</p>
              <p>
                Added on:{" "}
                {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="border-t px-6 md:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(product.specifications || {}).map(
              ([key, value], i) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl bg-gray-50"
                >
                  <p className="text-xs text-gray-500 uppercase">
                    {key.replace("_", " ")}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {value}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProductDesc;
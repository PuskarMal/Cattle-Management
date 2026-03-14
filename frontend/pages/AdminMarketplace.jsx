import React, { useState } from 'react';

const AdminMarketplace = () => {
  const [formData, setFormData] = useState({
    name: '', category: 'Nutrition', price: '', description: '', imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setPreviewUrl(URL.createObjectURL(file)); // Creates a local temporary link for the preview
    }
  };

 const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('breed_name', formData.name);
    data.append('listing_type', formData.category);
    data.append('price_or_fee', formData.price);
    data.append('description', formData.description);
    data.append('image', formData.imageFile);

    try {
        const response = await fetch('https://cattle-management-ptz0.onrender.com/api/products/add', {
            method: 'POST',
            body: data,
        });
        if (response.ok) alert("Product Added!");
    } catch (err) {
        console.error(err);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Form */}
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border">
          <h2 className="text-2xl font-bold text-[#0b4d61] mb-6">Inventory Management</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="Product Name" className="w-full p-4 bg-gray-50 border rounded-2xl" 
                   value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            
            <select className="w-full p-4 bg-gray-50 border rounded-2xl"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option>Nutrition</option><option>Health</option><option>Hardware</option><option>Breeding</option>
            </select>

            <input type="number" placeholder="Price in ₹" className="w-full p-4 bg-gray-50 border rounded-2xl"
                   value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />

            {/* NEW: Image Upload Section */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Product Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <textarea placeholder="Product Description" className="w-full p-4 bg-gray-50 border rounded-2xl" rows="4"
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>

            <button type="submit" className="w-full bg-[#0b4d61] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all">
              Add Product to Database
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="w-full md:w-80 flex flex-col items-center">
          <p className="text-gray-400 uppercase text-xs font-black tracking-widest mb-4">Card Preview</p>
          <div className="bg-white rounded-3xl border shadow-2xl overflow-hidden w-full">
            <div className="h-44 w-full bg-gray-200">
               {previewUrl ? (
                 <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
               ) : (
                 <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">No Image Selected</div>
               )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg">{formData.name || "Product Name"}</h3>
              <p className="text-[#0b4d61] font-black text-2xl mt-4">₹{formData.price || "0"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplace;
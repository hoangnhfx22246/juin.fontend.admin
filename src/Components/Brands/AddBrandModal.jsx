import React, { useState } from "react";

const AddBrandModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!brandName.trim()) {
      setError("Brand name is required.");
      return;
    }
    setError("");
    onSave(brandName.trim());
    // Optionally clear name after save if modal stays open for another add
    // setBrandName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Add New Brand
        </h3>
        <div>
          <label
            htmlFor="newBrandName"
            className="block text-sm font-medium text-gray-700"
          >
            Brand Name
          </label>
          <input
            type="text"
            id="newBrandName"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value);
              if (error) setError("");
            }}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter brand name"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Brand"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandModal;

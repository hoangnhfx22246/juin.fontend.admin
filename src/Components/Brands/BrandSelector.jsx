import React, { useState, useMemo } from "react";
// Assuming you'll use an icon for delete
import { CiTrash } from "react-icons/ci";

const BrandSelector = ({
  value,
  onChange,
  brands,
  name,
  error,
  onAddBrand, // Callback to open "Add Brand" modal/UI
  onDeleteBrand, // Callback to delete a brand (brandId) => void
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredBrands = useMemo(() => {
    if (!searchTerm) {
      return brands || [];
    }
    return (brands || []).filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  const selectedBrandName = useMemo(() => {
    return brands?.find((brand) => brand._id === value)?.name || "Select Brand";
  }, [brands, value]);

  const handleSelect = (brandId) => {
    onChange({ target: { name: name, value: brandId } });
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleDeleteClick = (e, brandId) => {
    e.stopPropagation(); // Prevent dropdown from closing or brand from being selected
    onDeleteBrand(brandId);
    // Optionally, close dropdown if desired after delete action, or let it stay open
    // setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-left px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } ${isOpen ? "ring-1 ring-indigo-500 border-indigo-500" : ""}`}
      >
        {selectedBrandName}
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 01.53.22l3.992 4.004a.75.75 0 01-.014 1.054l-4.004 3.992a.75.75 0 01-1.042-.014l-4.004-3.992a.75.75 0 01.014-1.054l3.992-4.004A.75.75 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="px-2 py-1 sticky top-0 bg-white z-10 border-b">
            <input
              type="text"
              placeholder="Search brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
            />
          </div>

          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <div
                key={brand._id}
                className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm cursor-pointer ${
                  value === brand._id
                    ? "text-white bg-indigo-600"
                    : "text-gray-900 hover:bg-indigo-100 hover:text-indigo-900"
                }`}
                onClick={() => handleSelect(brand._id)}
              >
                <span>{brand.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, brand._id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                  title={`Delete ${brand.name}`}
                >
                  <CiTrash className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No brands found matching "{searchTerm}".
              <button
                type="button"
                onClick={() => {
                  onAddBrand(); // Trigger the callback to open add brand UI
                  setIsOpen(false);
                }}
                className="block w-full text-center mt-2 text-indigo-600 hover:text-indigo-800 font-medium p-2 rounded hover:bg-indigo-50"
              >
                + Add New Brand
              </button>
            </div>
          )}
        </div>
      )}
      <input type="hidden" name={name} value={value || ""} />
    </div>
  );
};

export default BrandSelector;

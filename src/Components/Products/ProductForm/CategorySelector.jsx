import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CategoryForm from "../../Categories/CategoryForm";
export default function CategorySelector({
  value,
  onChange,
  categories,
  name,
  error,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Control dropdown visibility

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return categories || [];
    }
    return (categories || []).filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Find the name of the currently selected category
  const selectedCategoryName = useMemo(() => {
    return (
      categories?.find((cat) => cat._id === value)?.name || "Select Category"
    );
  }, [categories, value]);

  const handleSelect = (categoryId) => {
    // Simulate the event object expected by the parent's handleChange
    onChange({ target: { name: name, value: categoryId } });
    setIsOpen(false); // Close dropdown after selection
    setSearchTerm(""); // Clear search term after selection
  };

  return (
    <>
      <div className="relative">
        {/* Display selected category or search input */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-left px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } ${isOpen ? "ring-1 ring-indigo-500 border-indigo-500" : ""}`}
        >
          {selectedCategoryName}
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

        {/* Dropdown with Search */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {/* Search Input */}
            <div className="px-2 py-1 sticky top-0 bg-white z-10">
              <input
                type="text"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
              />
            </div>

            {/* Category List */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleSelect(cat._id)}
                  className={`w-full text-left px-4 py-2 text-sm cursor-pointer ${
                    value === cat._id
                      ? "text-white bg-indigo-600"
                      : "text-gray-900 hover:bg-indigo-100 hover:text-indigo-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))
            ) : (
              // "Not Found" and "Add Category" Link
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No categories found matching "{searchTerm}".
              </div>
            )}
          </div>
        )}
        {/* Hidden input to hold the actual value for the form */}
        <input type="hidden" name={name} value={value || ""} />
      </div>
    </>
  );
}

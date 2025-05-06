import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, updateCategory } from "../../redux/categorySlice";

const CategoryForm = ({ editData, onClose, isLoading }) => {
  const dispatch = useDispatch();
  const { categories, parentCategories } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        description: editData.description,
        parentId: editData.parentId?._id || "",
      });
      setImagePreview(editData.image?.url);
    }
  }, [editData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    if (formData.parentId) {
      form.append("parentId", formData.parentId);
    }
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      if (editData) {
        await dispatch(
          updateCategory({ id: editData._id, formData: form })
        ).unwrap();
      } else {
        await dispatch(createCategory(form)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Parent Category
        </label>
        <select
          value={formData.parentId}
          onChange={(e) =>
            setFormData({ ...formData, parentId: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">None</option>
          {formData.parentId &&
            editData &&
            parentCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          {!editData &&
            parentCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 w-32 object-cover rounded-md"
          />
        )}
      </div>

      <div className="flex justify-end space-x-3">
        {!isLoading && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          } transition-all duration-200`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : editData ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;

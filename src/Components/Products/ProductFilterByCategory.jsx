import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/productSlice";
import { showNotification } from "../../util/notification";
import { categoryAPI } from "../../api/category";

const ProductFilterByCategory = () => {
  const dispatch = useDispatch();

  const { filters } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]); // Placeholder for categories

  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    // Fetch categories from the store or API
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();

        setCategories(
          response.categories
            ?.filter((cat) => cat.parentId)
            .map((cat) => ({
              _id: cat._id,
              name: cat.name,
            })) || []
        );
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    fetchCategories();
  }, []);
  const handleFilter = (e) => {
    const selectedCategoryId = e.target.value || null;
    setSelectedCategory(
      categories.find((category) => category._id === selectedCategoryId) || null
    );
    dispatch(setFilter({ ...filters, categoryId: selectedCategoryId }));
  };

  // Optional: đảm bảo categoryId được giữ khi reload (nếu dùng redux-persist hoặc cần preload)
  useEffect(() => {
    if (!filters.categoryId) return;
    dispatch(setFilter({ ...filters, categoryId: filters.categoryId }));
  }, []);

  return (
    <div className="max-w-xs">
      <select
        value={filters.categoryId || ""}
        onChange={handleFilter}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Tất cả danh mục</option>
        {filters.categoryId && selectedCategory && (
          <option value={filters.categoryId}>{selectedCategory.name}</option>
        )}
        {categories
          .filter((category) => category._id !== filters.categoryId)
          .map((category, index) => (
            <option
              key={category._id || `fallback-${index}`}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProductFilterByCategory;

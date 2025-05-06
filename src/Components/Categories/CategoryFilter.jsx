import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/categorySlice";

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const { categories, parentCategories, filters } = useSelector(
    (state) => state.categories
  );

  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const handleParentFilter = (e) => {
    const selectedParentId = e.target.value || null;
    setSelectedCategory(
      parentCategories.find((category) => category._id === selectedParentId) ||
        null
    );
    dispatch(setFilter({ ...filters, parentId: selectedParentId }));
  };

  // Optional: đảm bảo parentId được giữ khi reload (nếu dùng redux-persist hoặc cần preload)
  useEffect(() => {
    if (!filters.parentId) return;
    dispatch(setFilter({ ...filters, parentId: filters.parentId }));
  }, []);

  return (
    <div className="max-w-xs">
      <select
        value={filters.parentId || ""}
        onChange={handleParentFilter}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Tất cả danh mục</option>
        {filters.parentId && selectedCategory && (
          <option value={filters.parentId}>{selectedCategory.name}</option>
        )}
        {parentCategories
          .filter((category) => category._id !== filters.parentId)
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

export default CategoryFilter;

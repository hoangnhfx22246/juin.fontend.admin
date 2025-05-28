import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, setSort } from "../../redux/categorySlice";
import SortIcon from "../Layouts/SortIcon";

const CategoryTable = ({ categories, onEdit }) => {
  const dispatch = useDispatch();
  const sort = useSelector((state) => state.categories.sort);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSort = (field) => {
    const newOrder =
      sort.field === field && sort.order === "asc" ? "desc" : "asc";

    dispatch(setSort({ field, order: newOrder }));
  };

  const renderSortableHeader = (field, label) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon field={field} sort={sort} />
      </div>
    </th>
  );
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderSortableHeader("name", "Danh mục")}
            {renderSortableHeader("parentId", "Thuộc danh mục")}
            {renderSortableHeader("description", "Mô tả")}
            {renderSortableHeader("createdAt", "Ngày Tạo")}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category, index) => (
            <tr
              key={category._id || `fallback-${index}`}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={category.image?.url}
                    alt={category.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.parentId?.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="truncate max-w-xs">{category.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(category.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchProducts,
  patchProduct,
  setSort,
} from "../../redux/productSlice";
import SortIcon from "../Layouts/SortIcon";
import { useNavigate } from "react-router-dom";

const ProductTable = ({ products }) => {
  const dispatch = useDispatch();
  const sort = useSelector((state) => state.products.sort);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleActive = async (id) => {
    try {
      await dispatch(patchProduct(id)).unwrap();
    } catch (error) {
      console.error("Error:", error);
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
  const onEdit = (product) => {
    navigate(`/products/edit/`, {
      state: { productData: product }, // 👈 Gửi data qua state
    });
  };
  // lấy giá nhỏ nhất
  function getDisplayPrice(product) {
    if (!product.hasVariations) {
      // Không có biến thể
      const price =
        product.priceSale && product.priceSale > 0
          ? product.priceSale
          : product.price;
      return price ? `₫${price.toLocaleString("vi-VN")}` : "";
    }
    // Có biến thể
    const prices = product.variantCombinations.map((v) =>
      v.priceSale && v.priceSale > 0 ? v.priceSale : v.price
    );
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₫${min.toLocaleString("vi-VN")}`;
    return `₫${min.toLocaleString("vi-VN")} - ₫${max.toLocaleString("vi-VN")}`;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">Ảnh</div>
            </th>
            {renderSortableHeader("name", "Sản Phẩm")}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">Danh mục</div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">Thương hiệu</div>
            </th>
            {renderSortableHeader("priceSale", "Giá bán")}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">Tồn kho</div>
            </th>
            {renderSortableHeader("createdAt", "Ngày Tạo")}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
              <div className="flex items-center">Ẩn/hiện</div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr
              key={product._id || `fallback-${index}`}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    src={product.images?.length > 0 && product.images[0]?.url}
                    alt={product.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {product.categoryId?.name || product.category?.name || ""}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {product.brandId?.name || product.brand?.name || ""}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getDisplayPrice(product)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.hasVariations
                    ? product.variantCombinations.reduce(
                        (sum, item) => sum + item.stock,
                        0
                      )
                    : product.stock}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </td>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      checked={product.status === "active"}
                      onChange={() => handleActive(product._id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative transition-all duration-300">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-4" />
                    </div>
                  </label>
                </div>
              </th>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {
                    onEdit(product);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
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

export default ProductTable;

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setSort,
  setPage,
  setFilter,
} from "../../redux/productSlice";
import ProductSearch from "../Products/ProductSearch";
import SortIcon from "../Layouts/SortIcon";

const DEFAULT_FILTERS = { categoryId: "", brandId: "", search: "" };
const DEFAULT_SORT = { field: "createdAt", order: "desc" };
const DEFAULT_PAGINATION = { page: 1, limit: 10 };
export default function ProductSelectPopup({
  selected,
  onSelect,
  onClose,
  maxSelect,
  handleAdd,
}) {
  console.log("selected", selected);

  const dispatch = useDispatch();
  const { products, filters, pagination, sort } = useSelector(
    (state) => state.products
  );
  const activeProducts = [...products.filter((p) => p.status === "active")];
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (isFirstLoad) {
      dispatch(setFilter(DEFAULT_FILTERS));
      dispatch(setSort(DEFAULT_SORT));
      dispatch(setPage(DEFAULT_PAGINATION.page));
      setIsFirstLoad(false);
    }
  }, [dispatch, isFirstLoad]);

  const loadProducts = useCallback(() => {
    dispatch(
      fetchProducts({
        page: pagination.page,
        limit: pagination.limit,
        categoryId: filters.categoryId,
        brandId: filters.brandId,
        search: filters.search,
        sortField: sort.field,
        sortOrder: sort.order,
      })
    );
  }, [
    dispatch,
    filters.search,
    pagination.page,
    pagination.limit,
    sort.field,
    sort.order,
    filters.categoryId,
    filters.brandId,
  ]);
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
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
  const handleCheck = (id) => {
    if (selected.find((s) => s._id === id)) {
      // Bỏ chọn nếu đã chọn
      onSelect(selected.filter((s) => s._id !== id));
    } else {
      // Nếu đã đủ max thì không cho chọn thêm
      if (selected.length >= maxSelect) return;
      onSelect([...selected, activeProducts.find((p) => p._id === id)]);
    }
  };
  // Handle page change from ReactPaginate
  const handlePageClick = (event) => {
    // event.selected is 0-indexed, our Redux state for page is 1-indexed
    dispatch(setPage(event.selected + 1));
  };
  // Hàm handler riêng cho checkbox "chọn tất cả" trang hiện tại
  const handleSelectAllCurrentPage = (checked) => {
    if (checked) {
      // Thêm tất cả sản phẩm trang này (nếu chưa đủ maxSelect)
      const toAdd = activeProducts.filter(
        (p) => !selected.find((s) => s._id === p._id)
      );
      const canAdd = Math.max(0, maxSelect - selected.length);
      onSelect([...selected, ...toAdd.slice(0, canAdd)]);
    } else {
      // Bỏ chọn tất cả sản phẩm trang này
      onSelect(
        selected.filter((s) => !activeProducts.some((p) => p._id === s._id))
      );
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-4xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          Đóng
        </button>
        <h2 className="text-lg font-semibold mb-2">Chọn sản phẩm</h2>
        <ProductSearch />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={
                      activeProducts.length > 0 &&
                      activeProducts.every((p) =>
                        selected.find((s) => s._id === p._id)
                      )
                    }
                    onChange={(e) =>
                      handleSelectAllCurrentPage(e.target.checked)
                    }
                    disabled={activeProducts.length === 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">Ảnh</div>
                </th>
                {renderSortableHeader("name", "Sản Phẩm")}
                {renderSortableHeader("priceSale", "Giá bán")}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                  <div className="flex items-center">Số lượng</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeProducts.map((product, index) => (
                <tr
                  key={product._id || `fallback-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selected.find((s) => s._id === product._id) || false
                      }
                      onChange={() => handleCheck(product._id)}
                      disabled={
                        !selected.find((s) => s._id === product._id) &&
                        selected.length >= maxSelect
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          product.images?.length > 0 && product.images[0]?.url
                        }
                        alt={product.name}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="text-sm font-medium text-gray-900 max-w-[300px] truncate"
                        title={product.name}
                      >
                        {product.name}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.total > pagination.limit && (
          <div className="mt-8 flex justify-center">
            <ReactPaginate
              previousLabel={"< Previous"}
              nextLabel={"Next >"}
              breakLabel={"..."}
              pageCount={pagination.total / pagination.limit}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3} // Show 3 page numbers in the middle
              onPageChange={handlePageClick}
              containerClassName={
                "flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              }
              pageClassName={"px-1"}
              pageLinkClassName={
                "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              }
              previousClassName={"px-1"}
              previousLinkClassName={
                "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              }
              nextClassName={"px-1"}
              nextLinkClassName={
                "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
              }
              breakClassName={"px-1"}
              breakLinkClassName={"px-3 py-2 rounded-md text-gray-700"}
              activeClassName={"bg-blue-500 rounded-md"}
              activeLinkClassName={"!text-white hover:!bg-blue-600"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
              // forcePage is 0-indexed, pagination.page is 1-indexed
              forcePage={pagination.page - 1}
            />
          </div>
        )}
        <div className="inset-0 flex items-end justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto mb-8">
            <button
              type="button"
              className={`${
                selected.length === 0 ? "bg-indigo-200" : "bg-indigo-600"
              } text-white px-4 py-2 rounded`}
              onClick={handleAdd}
              disabled={selected.length === 0}
            >
              {selected.length === 0
                ? "Hãy chọn sản phẩm trước"
                : "Thêm vào Flash Sale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

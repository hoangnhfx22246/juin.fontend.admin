import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setPage } from "../redux/productSlice";
import ProductTable from "../Components/Products/ProductTable";
import ProductSearch from "../Components/Products/ProductSearch";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import ProductFilterByCategory from "../Components/Products/ProductFilterByCategory";
import ProductFilterByBrand from "../Components/Products/ProductFilterByBrand";
import { setFilter, setSort } from "../redux/categorySlice";
import { AiOutlinePlus, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

const DEFAULT_FILTERS = { categoryId: "", brandId: "", search: "" };
const DEFAULT_SORT = { field: "createdAt", order: "desc" };
const DEFAULT_PAGINATION = { page: 1, limit: 10 };

const ProductManager = () => {
  const dispatch = useDispatch();
  const { products, isLoading, filters, pagination, sort } = useSelector(
    (state) => state.products
  );
  const navigate = useNavigate();
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

  // Handle page change from ReactPaginate
  const handlePageClick = (event) => {
    // event.selected is 0-indexed, our Redux state for page is 1-indexed
    dispatch(setPage(event.selected + 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              navigate("/products/add");
            }}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <AiOutlinePlus className="mr-2" />
            Thêm sản phẩm
          </button>

          <button
            onClick={() => {
              navigate("/stock-entry/add");
            }}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <AiOutlineLogin className="mr-2" />
            Nhập kho
          </button>

          <button
            onClick={() => {
              navigate("/stock-exit");
            }}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <AiOutlineLogout className="mr-2" />
            Xuất kho
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductSearch />
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductFilterByCategory />
          <ProductFilterByBrand />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 ">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-lg" />
          Loading...
        </div>
      ) : (
        <>
          <ProductTable products={products} />
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
        </>
      )}
    </div>
  );
};

export default ProductManager;

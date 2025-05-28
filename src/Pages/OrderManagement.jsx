import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, setPage } from "../redux/orderSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { setFilter, setSort } from "../redux/categorySlice";
import OrderTable from "../Components/Orders/OrderTable";
import OrderSearch from "../Components/Orders/OrderSearch";
import OrderFilterByStatus from "../Components/Orders/OrderFilterByStatus";
import OrderFilterByPaymentMethod from "../Components/Orders/OrderFilterByPaymentMethod";

const DEFAULT_FILTERS = { categoryId: "", brandId: "", search: "" };
const DEFAULT_SORT = { field: "createdAt", order: "desc" };
const DEFAULT_PAGINATION = { page: 1, limit: 10 };

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, filters, pagination, sort } = useSelector(
    (state) => state.orders
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

  const loadOrders = useCallback(() => {
    dispatch(
      fetchOrders({
        page: pagination.page,
        limit: pagination.limit,
        paymentMethod: filters.paymentMethod,
        status: filters.status,
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
    filters.paymentMethod,
    filters.status,
  ]);
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle page change from ReactPaginate
  const handlePageClick = (event) => {
    // event.selected is 0-indexed, our Redux state for page is 1-indexed
    dispatch(setPage(event.selected + 1));
  };

  const handleChangeOrderStatus = (order) => {
    // Xử lý đổi trạng thái ở đây, ví dụ mở popup, gọi API, v.v.
    console.log("Đổi trạng thái cho đơn:", order);
  };

  const handleEditOrder = (order) => {
    // Ví dụ: chuyển hướng sang trang chi tiết đơn hàng
    navigate(`/orders/${order._id}`);
    // Hoặc mở popup chỉnh sửa, v.v.
  };

  console.log("orders", orders);
  console.log("pagination", pagination);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <OrderSearch />
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderFilterByStatus />
          <OrderFilterByPaymentMethod />
          {/* <OrderFilterByBrand /> */}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 ">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-lg" />
          Loading...
        </div>
      ) : (
        <>
          <OrderTable orders={orders} onEdit={handleEditOrder} />
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

export default OrderManagement;

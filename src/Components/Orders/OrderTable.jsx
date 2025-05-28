import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SortIcon from "../Layouts/SortIcon";
import { setSort } from "../../redux/orderSlice";

const OrderTable = ({ orders, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sort = useSelector((state) => state.orders.sort);

  // Hiển thị trạng thái với màu sắc nổi bật
  const renderStatus = (status) => {
    let color = "bg-gray-200 text-gray-700";
    let label = "Chờ xử lý";
    if (status === "pending") {
      color = "bg-yellow-100 text-yellow-800";
      label = "Chờ xác nhận";
    } else if (status === "confirmed") {
      color = "bg-blue-100 text-blue-700";
      label = "Đã xác nhận";
    } else if (status === "shipping") {
      color = "bg-indigo-100 text-indigo-700";
      label = "Đang giao";
    } else if (status === "completed") {
      color = "bg-green-100 text-green-700";
      label = "Hoàn thành";
    } else if (status === "cancelled") {
      color = "bg-red-100 text-red-700";
      label = "Đã hủy";
    }
    return (
      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${color}`}>
        {label}
      </span>
    );
  };

  // Hiển thị phương thức thanh toán
  const renderPayment = (method) => {
    if (!method) return "Không rõ";
    if (method === "cod") return "Thanh toán khi nhận hàng";
    if (method === "bank") return "Chuyển khoản";
    if (method === "momo") return "Ví MoMo";
    return method;
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
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã đơn
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khách hàng
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số điện thoại
            </th>
            {renderSortableHeader("totalPrice", "Tổng tiền")}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phương thức thanh toán
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            {renderSortableHeader("createdAt", "Ngày tạo")}
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, idx) => (
            <tr key={order._id || idx} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap font-mono text-sm">
                {order.code || order._id}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {order.customer?.fullName || "Ẩn"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {order.customer?.phone || order.phone || ""}
              </td>
              <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-700">
                {order.totalPrice
                  ? `₫${order.totalPrice.toLocaleString("vi-VN")}`
                  : "₫0"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {renderPayment(order.paymentMethod)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {renderStatus(order.status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("vi-VN")
                  : ""}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() =>
                    onEdit ? onEdit(order) : navigate(`/orders/${order._id}`)
                  }
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-gray-400 py-4">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;

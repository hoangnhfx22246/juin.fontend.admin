import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/orderSlice";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const OrderFilterByStatus = () => {
  const { filters } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setFilter({ status: e.target.value }));
  };

  return (
    <div className="max-w-xs">
      <select
        value={filters.status || ""}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderFilterByStatus;

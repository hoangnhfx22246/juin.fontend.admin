import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/orderSlice";

const PAYMENT_METHOD_OPTIONS = [
  { value: "", label: "Tất cả phương thức" },
  { value: "COD", label: "Thanh toán khi nhận hàng" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "MOMO", label: "Ví MoMo" },
  { value: "VNPAY", label: "Ví VNPAY" },
];

const OrderFilterByPaymentMethod = () => {
  const { filters } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setFilter({ paymentMethod: e.target.value }));
  };

  return (
    <div className="max-w-xs">
      <select
        value={filters.paymentMethod || ""}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {PAYMENT_METHOD_OPTIONS.map((method) => (
          <option key={method.value} value={method.value}>
            {method.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderFilterByPaymentMethod;

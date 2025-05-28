import React from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "../../redux/orderSlice";

const OrderSearch = () => {
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    dispatch(setFilter({ search: e.target.value }));
  };

  return (
    <div className="max-w-lg">
      <input
        type="text"
        placeholder="TÌm kiếm theo mã đơn hàng, tên khách hàng, Số điện thoại..."
        onChange={handleSearch}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default OrderSearch;

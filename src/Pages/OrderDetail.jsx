import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showNotification } from "../util/notification";
import { orderAPI } from "../api/order";

const STATUS_OPTIONS = [
  { value: "pending", label: "🕒 Chờ xác nhận" },
  { value: "confirmed", label: "✅ Đã xác nhận" },
  { value: "shipping", label: "🚚 Đang giao" },
  { value: "completed", label: "🎉 Hoàn thành" },
  { value: "cancelled", label: "❌ Đã hủy" },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getOrder(id);
        setOrder(res.order);
        setStatus(res.order.status);
      } catch {
        showNotification.error("Không thể tải đơn hàng");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const getEffectivePrice = (item) => {
    return item.flashSalePrice ?? item.priceSale ?? item.price;
  };
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    try {
      const res = await orderAPI.updateOrderStatus(id, { status: newStatus });
      setOrder(res.order);

      showNotification.success("Cập nhật trạng thái thành công!");
    } catch {
      showNotification.error("Cập nhật trạng thái thất bại!");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-2xl font-bold text-blue-600">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20 text-2xl text-red-500 font-bold">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-2xl p-12 mt-10">
      <button
        className="mb-6 text-blue-700 hover:underline text-lg font-semibold flex items-center"
        onClick={() => navigate(-1)}
      >
        <span className="text-2xl mr-2">←</span> Quay lại
      </button>

      <h2 className="text-4xl font-extrabold mb-10 text-blue-800 tracking-wide drop-shadow">
        Chi tiết đơn hàng #{order.code || order._id}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 text-gray-800">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <span>👤</span> Khách hàng
          </h3>
          <p className="mb-2 text-lg">
            <span className="font-semibold">Tên:</span>{" "}
            {order.customer?.fullName}
          </p>
          <p className="mb-2 text-lg">
            <span className="font-semibold">SĐT:</span>{" "}
            {order.customer?.phone || order.phone}
          </p>
          <p className="mb-2 text-lg">
            <span className="font-semibold">Email:</span>{" "}
            {order.customer?.email || "Không có"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
            <span>🚚</span> Giao hàng
          </h3>
          <p className="mb-2 text-lg">
            <span className="font-semibold">Địa chỉ:</span> {order.address}
          </p>
          <p className="mb-2 text-lg">
            <span className="font-semibold">Ngày tạo:</span>{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
          <p className="mb-2 text-lg">
            <span className="font-semibold">Phương thức thanh toán:</span>{" "}
            <span className="uppercase">{order.paymentMethod}</span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto mb-12">
        <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
          <span>🛒</span> Sản phẩm
        </h3>
        <table className="min-w-full text-lg border rounded-2xl overflow-hidden shadow">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-4 border">Ảnh</th>
              <th className="p-4 border">Sản phẩm</th>
              <th className="p-4 border">Phân loại</th>
              <th className="p-4 border">Số lượng</th>
              <th className="p-4 border">Giá</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx} className="text-center border-b hover:bg-blue-50">
                <td className="p-4">
                  <img
                    src={item.image || "/no-image.png"}
                    alt={item.product?.name || item.name}
                    className="w-16 h-16 object-cover rounded shadow mx-auto"
                  />
                </td>
                <td className="p-4">{item.product?.name || item.name}</td>
                <td className="p-4">{item.variantName}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4 text-red-600 font-bold">
                  {item.price
                    ? `${getEffectivePrice(item).toLocaleString("vi-VN")}₫`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <label className="font-semibold text-xl text-gray-700 mr-4">
            Trạng thái đơn hàng:
          </label>
          <select
            value={status}
            onChange={handleStatusChange}
            disabled={updating}
            className="border-2 border-blue-400 px-4 py-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {updating && (
            <span className="ml-4 text-blue-500 animate-pulse text-lg">
              Đang cập nhật...
            </span>
          )}
        </div>
        <div className="text-2xl font-extrabold text-green-700 bg-green-50 px-6 py-3 rounded-xl shadow">
          Tổng cộng: {order.totalPrice?.toLocaleString("vi-VN") || 0}₫
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

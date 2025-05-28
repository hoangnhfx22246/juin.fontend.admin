import { useNavigate } from "react-router-dom";
import { featuredProductAPI } from "../../api/featuredProduct";
import { showNotification } from "../../util/notification";

export default function FlashSaleTable({ featuredProducts, onDelete }) {
  const navigate = useNavigate();
  const handlerEdit = (featuredProduct) => {
    navigate(`/featured-products/edit/`, {
      state: { featuredProductData: featuredProduct }, // 👈 Gửi data qua state
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khung giờ
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm tham gia
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {featuredProducts.map((featuredProduct, index) => (
            <tr
              key={featuredProduct._id || `fallback-${index}`}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900 text-center">
                  {featuredProduct.timeFrame}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {featuredProduct.products?.length} Sản phẩm đã tham gia
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 text-center">
                <div
                  className={
                    "inline-block px-3 py-1 rounded-full font-semibold " +
                    (featuredProduct.status === "active"
                      ? "bg-green-100 text-green-700"
                      : featuredProduct.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-200 text-gray-600")
                  }
                >
                  {featuredProduct.status === "active"
                    ? "Đang diễn ra"
                    : featuredProduct.status === "upcoming"
                    ? "Sắp diễn ra"
                    : "Đã kết thúc"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  onClick={() => handlerEdit(featuredProduct)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(featuredProduct._id)}
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
}

import React, { useEffect, useState } from "react";
import ProductSelectPopup from "../Popups/ProductSelectPopup";
import BulkEditBar from "./BulkEditBar";
import ProductTable from "./ProductTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { featuredProductAPI } from "../../api/featuredProduct";
import { showNotification } from "../../util/notification";

const TIME_FRAMES = [
  "0h-9h",
  "9h-12h",
  "12h-15h",
  "15h-17h",
  "17h-21h",
  "21h-0h",
];
const STATUS_OPTIONS = [
  { value: "upcoming", label: "Sắp diễn ra" },
  { value: "active", label: "Đang diễn ra" },
  { value: "ended", label: "Đã kết thúc" },
];

export default function FeaturedProductForm() {
  const location = useLocation();
  const initialData = location.state?.featuredProductData;

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkPriority, setBulkPriority] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          products: [
            ...initialData.products.map((p) => ({
              ...p.productId,
              priority: p.priority,
            })),
          ],
        }
      : {
          timeFrame: "",
          status: "upcoming",
          isActive: true,
          products: [],
        }
  );

  const [popupSelected, setPopupSelected] = useState(
    initialData
      ? [
          ...initialData.products.map((p) => ({
            ...p.productId,
            priority: p.priority,
          })),
        ]
      : []
  );
  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await featuredProductAPI.getFeaturedProducts();
        setFeaturedProducts(response.featuredProducts);
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    fetchFeaturedProduct();
  }, []);
  // Thêm sản phẩm từ popup
  const handleAddProducts = () => {
    let newToAdd = popupSelected.slice(0, 10); // chỉ lấy tối đa 10 sản phẩm
    const newProducts = newToAdd.map((p) => {
      return {
        ...p,
      };
    });
    setForm((prev) => ({
      ...prev,
      products: newProducts,
    }));
    setShowPopup(false);
  };

  // Xóa sản phẩm khỏi flash sale
  const handleRemoveProduct = (idx) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== idx),
    }));
    setSelectedRows((prev) => prev.filter((i) => i !== idx));
  };

  // Chọn checkbox từng dòng hoặc tất cả
  const handleSelectRow = (idx) => {
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(form.products.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  // Thay đổi giá/tồn kho từng sản phẩm
  const handleProductChange = (idx, field, valueOrObj) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((p, i) => {
        if (i !== idx) return p;
        return { ...p, [field]: valueOrObj };
      }),
    }));
  };
  // Thay đổi hàng loạt
  const handleBulkChange = () => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        return {
          ...p,
          priority: bulkPriority !== 0 ? bulkPriority : p.priority,
        };
      }),
    }));
    setBulkPriority("");
  };
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form", form);

    if (!form.timeFrame || form.products.length === 0) return;

    // Chuyển đổi dữ liệu về đúng schema
    const products = form.products.map((p) => {
      return {
        productId: p._id,
        priority: p.priority,
      };
    });

    const submitData = {
      products,
      timeFrame: form.timeFrame,
      status: form.status,
    };

    console.log(submitData);
    // Gửi submitData lên server hoặc gọi onSubmit(submitData)
    try {
      if (initialData) {
        await featuredProductAPI.updateFeaturedProducts(
          initialData._id,
          submitData
        );
        showNotification.success("Sửa thành công");
      } else {
        await featuredProductAPI.createFeaturedProducts(submitData);
        showNotification.success("Tạo thành công");
      }
      navigate("/featured-products");
    } catch (error) {
      console.error("Error:", error);
      showNotification.error(error.response.data.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow flex flex-col gap-4"
    >
      <div>
        <label className="block text-sm font-medium">Khung giờ *</label>
        <select
          name="timeFrame"
          value={form.timeFrame}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, timeFrame: e.target.value }))
          }
          className="border rounded px-2 py-1"
          required
        >
          <option value="">Chọn khung giờ</option>
          {TIME_FRAMES.filter(
            (t) =>
              t === form.timeFrame ||
              !featuredProducts.map((fl) => fl.timeFrame).includes(t)
          ).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Trạng thái</label>
        <select
          name="status"
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border rounded px-2 py-1"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Nút thêm sản phẩm */}
      <button
        type="button"
        className="bg-indigo-600 text-white px-4 py-2 rounded w-fit"
        onClick={() => setShowPopup(true)}
        disabled={form.products.length >= 10}
      >
        Thêm sản phẩm
      </button>
      <div className="text-xs text-gray-500">
        Đã thêm {form.products.length}/10 sản phẩm
      </div>

      {/* Bảng sản phẩm đã thêm */}
      <div className="border-t pt-4 mt-2">
        <div className="font-semibold mb-2">
          Sản phẩm trong Featured Product
        </div>
        <BulkEditBar
          bulkPriority={bulkPriority}
          setBulkPriority={setBulkPriority}
          onApply={handleBulkChange}
          disabled={selectedRows.length === 0}
        />
        <ProductTable
          products={form.products}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onChange={handleProductChange}
          onRemove={handleRemoveProduct}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded self-start mt-4"
      >
        {initialData ? "Cập nhật Featured Product" : "Tạo Featured Product"}
      </button>

      {/* Popup chọn sản phẩm */}
      {showPopup && (
        <ProductSelectPopup
          selected={popupSelected}
          onSelect={setPopupSelected}
          onClose={() => setShowPopup(false)}
          maxSelect={10}
          handleAdd={handleAddProducts}
        />
      )}
    </form>
  );
}

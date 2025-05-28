import React, { useEffect, useState } from "react";
import ProductSelectPopup from "../Popups/ProductSelectPopup";
import BulkEditBar from "./BulkEditBar";
import ProductTable from "./ProductTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { flashSaleAPI } from "../../api/flashSale";
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

export default function FlashSaleForm() {
  const location = useLocation();
  const initialData = location.state?.flashSaleData;

  const [flashSales, setFlashSales] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [bulkDiscount, setBulkDiscount] = useState("");
  const [discounts, setDiscounts] = useState({}); // { [productId]: percent }
  const navigate = useNavigate();
  console.log("initialData", initialData);
  const [form, setForm] = useState(
    initialData
      ? {
          ...initialData,
          products: [
            ...initialData.products.map((p) => ({
              ...p.productId,
              priceSale: p.priceSale,
              stock: p.stock,
              variantCombinations: p.variantSales.map((v, i) => ({
                ...p.productId.variantCombinations[i],
                attributes: v.combination || [],
                priceSale: v.priceSale,
                stock: v.stock,
              })),
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
  console.log("form", form);

  const [popupSelected, setPopupSelected] = useState(
    initialData
      ? [
          ...initialData.products.map((p) => ({
            ...p.productId,
            priceSale: p.priceSale,
            stock: p.stock,
            variantCombinations: p.variantSales.map((v, i) => ({
              ...p.productId.variantCombinations[i],
              attributes: v.combination || [],
              priceSale: v.priceSale,
              stock: v.stock,
            })),
          })),
        ]
      : []
  );
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const response = await flashSaleAPI.getFlashSales();
        setFlashSales(response.flashSales);
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    fetchFlashSale();
  }, []);
  // Thêm sản phẩm từ popup
  const handleAddProducts = () => {
    let newToAdd = popupSelected.slice(0, 10); // chỉ lấy tối đa 10 sản phẩm
    const newProducts = newToAdd.map((p) => {
      if (!p.hasVariations) {
        // Sản phẩm không có biến thể
        return {
          ...p,
          priceSale: p.priceSale || "",
          stock: p.stock || "",
        };
      } else {
        // Sản phẩm có biến thể
        return {
          ...p,
          variantCombinations: p.variantCombinations.map((v) => ({
            ...v,
            priceSale: v.priceSale || "",
            stock: v.stock || "",
          })),
        };
      }
    });
    setForm((prev) => ({
      ...prev,
      products: newProducts,
    }));
    setShowPopup(false);
  };
  const handleDiscountChange = (idx, variantIdx, value) => {
    setDiscounts((prev) => ({
      ...prev,
      [variantIdx !== null
        ? `${form.products[idx].productId}_${variantIdx}`
        : form.products[idx].productId]: value,
    }));

    setForm((prev) => ({
      ...prev,
      products: prev.products.map((p, i) => {
        if (i !== idx) return p;
        if (variantIdx !== null && p.hasVariations) {
          // Cập nhật priceSale cho từng variant
          return {
            ...p,
            variantCombinations: p.variantCombinations.map((v, vi) =>
              vi === variantIdx && v.price
                ? {
                    ...v,
                    priceSale: Math.round(v.price * (1 - value / 100)),
                  }
                : v
            ),
          };
        } else if (!p.hasVariations && p.price) {
          // Cập nhật priceSale cho sản phẩm thường
          return {
            ...p,
            priceSale: Math.round(p.price * (1 - value / 100)),
          };
        }
        return p;
      }),
    }));
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
        // Nếu là sản phẩm có biến thể
        if (field === "variantCombinations" && p.hasVariations) {
          const { variantIdx, field: vField, value } = valueOrObj;
          return {
            ...p,
            variantCombinations: p.variantCombinations.map((v, vi) => {
              if (vi !== variantIdx) return v;
              // Đồng bộ hai chiều cho từng variant
              if (vField === "priceSale" && v.price) {
                const percent = Math.round(100 - (value / v.price) * 100);
                return { ...v, priceSale: value, discountPercent: percent };
              }
              if (vField === "discountPercent" && v.price) {
                const priceSale = Math.round(v.price * (1 - value / 100));
                return { ...v, discountPercent: value, priceSale };
              }
              return { ...v, [vField]: value };
            }),
          };
        }
        // Nếu là sản phẩm thường
        if (field === "priceSale" && p.price) {
          const percent = Math.round(100 - (valueOrObj / p.price) * 100);
          return { ...p, priceSale: valueOrObj, discountPercent: percent };
        }
        if (field === "discountPercent" && p.price) {
          const priceSale = Math.round(p.price * (1 - valueOrObj / 100));
          return { ...p, discountPercent: valueOrObj, priceSale };
        }
        // Các trường khác
        return { ...p, [field]: valueOrObj };
      }),
    }));
  };

  // Thay đổi hàng loạt
  const handleBulkChange = () => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((p, i) => {
        if (!selectedRows.includes(i)) return p;
        // Nếu có biến thể
        if (p.hasVariations) {
          return {
            ...p,
            variantCombinations: p.variantCombinations.map((v) => {
              let newPriceSale = v.priceSale;
              let newDiscountPercent = v.discountPercent;
              if (bulkDiscount !== "") {
                newDiscountPercent = bulkDiscount;
                newPriceSale = v.price
                  ? Math.round(v.price * (1 - bulkDiscount / 100))
                  : v.priceSale;
              } else if (bulkPrice !== "") {
                newPriceSale = bulkPrice;
                newDiscountPercent =
                  v.price && bulkPrice
                    ? Math.round(100 - (bulkPrice / v.price) * 100)
                    : v.discountPercent;
              }
              return {
                ...v,
                priceSale: newPriceSale,
                discountPercent: newDiscountPercent,
                stock: bulkStock !== "" ? bulkStock : v.stock,
              };
            }),
          };
        } else {
          // Sản phẩm thường
          let newPriceSale = p.priceSale;
          let newDiscountPercent = p.discountPercent;
          if (bulkDiscount !== "") {
            newDiscountPercent = bulkDiscount;
            newPriceSale = p.price
              ? Math.round(p.price * (1 - bulkDiscount / 100))
              : p.priceSale;
          } else if (bulkPrice !== "") {
            newPriceSale = bulkPrice;
            newDiscountPercent =
              p.price && bulkPrice
                ? Math.round(100 - (bulkPrice / p.price) * 100)
                : p.discountPercent;
          }
          return {
            ...p,
            priceSale: newPriceSale,
            discountPercent: newDiscountPercent,
            stock: bulkStock !== "" ? bulkStock : p.stock,
          };
        }
      }),
    }));
    setBulkPrice("");
    setBulkStock("");
    setBulkDiscount("");
  };
  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.timeFrame || form.products.length === 0) return;

    // Chuyển đổi dữ liệu về đúng schema
    const products = form.products.map((p) => {
      if (!p.hasVariations) {
        // Sản phẩm không có biến thể
        return {
          productId: p._id,
          priceSale: Number(p.priceSale),
          stock: Number(p.stock),
        };
      } else {
        // Sản phẩm có biến thể
        return {
          productId: p._id,
          variantSales: p.variantCombinations.map((v) => ({
            variantCombinationsId: v._id,
            priceSale: Number(v.priceSale),
            stock: Number(v.stock),
          })),
        };
      }
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
        await flashSaleAPI.updateFlashSales(initialData._id, submitData);
        showNotification.success("Sửa thành công");
      } else {
        await flashSaleAPI.createFlashSales(submitData);
        showNotification.success("Tạo thành công");
      }
      navigate("/flash-sales");
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
              !flashSales.map((fl) => fl.timeFrame).includes(t)
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
        <div className="font-semibold mb-2">Sản phẩm trong Flash Sale</div>
        <BulkEditBar
          bulkPrice={bulkPrice}
          setBulkPrice={setBulkPrice}
          bulkStock={bulkStock}
          setBulkStock={setBulkStock}
          bulkDiscount={bulkDiscount}
          setBulkDiscount={setBulkDiscount}
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
          discounts={discounts}
          onDiscountChange={handleDiscountChange}
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded self-start mt-4"
      >
        {initialData ? "Cập nhật Flash Sale" : "Tạo Flash Sale"}
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

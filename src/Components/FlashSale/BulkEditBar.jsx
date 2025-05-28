import React from "react";

export default function BulkEditBar({
  bulkPrice,
  setBulkPrice,
  bulkStock,
  setBulkStock,
  bulkDiscount,
  setBulkDiscount,
  priceOrigin, // Giá gốc của sản phẩm đầu tiên được chọn (hoặc bạn tự truyền vào)
  onApply,
  disabled,
}) {
  // Tính giá Flash Sale từ % giảm
  const calcPriceSale = (price, percent) => {
    if (!price || !percent) return "";
    return Math.round(price * (1 - percent / 100));
  };

  // Tính % giảm từ giá Flash Sale
  const calcDiscountPercent = (price, priceSale) => {
    if (!price || !priceSale) return "";
    const percent = Math.round(100 - (priceSale / price) * 100);
    return percent > 0 ? percent : 0;
  };

  // Khi nhập % giảm, tự động tính lại bulkPrice
  const handleDiscountChange = (e) => {
    const percent = e.target.value;
    setBulkDiscount(percent);
    if (priceOrigin) {
      setBulkPrice(calcPriceSale(priceOrigin, percent));
    }
  };

  // Khi nhập giá Flash Sale, tự động tính lại % giảm
  const handlePriceChange = (e) => {
    const priceSale = e.target.value;
    setBulkPrice(priceSale);
    if (priceOrigin) {
      setBulkDiscount(calcDiscountPercent(priceOrigin, priceSale));
    }
  };

  return (
    <div className="flex gap-2 items-end mb-2">
      <input
        type="number"
        placeholder="Giá Flash Sale"
        value={bulkPrice}
        onChange={handlePriceChange}
        className="border rounded px-2 py-1"
      />
      <input
        type="number"
        placeholder="% Giảm"
        min={0}
        max={100}
        value={bulkDiscount || ""}
        onChange={handleDiscountChange}
        className="border rounded px-2 py-1 w-20"
      />
      <input
        type="number"
        placeholder="Tồn kho"
        value={bulkStock}
        onChange={(e) => setBulkStock(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button
        type="button"
        className="bg-green-600 text-white px-3 py-1 rounded"
        onClick={onApply}
        disabled={disabled}
      >
        Thay đổi hàng loạt
      </button>
    </div>
  );
}

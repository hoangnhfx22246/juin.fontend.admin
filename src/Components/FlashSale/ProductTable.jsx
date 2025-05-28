import React from "react";

export default function ProductTable({
  products,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onChange,
  onRemove,
}) {
  // Tính % giảm từ giá gốc và giá giảm
  const calcDiscountPercent = (price, priceSale) => {
    if (!price || !priceSale) return "";
    const percent = Math.round(100 - (priceSale / price) * 100);
    return percent > 0 ? percent : 0;
  };

  // Tính giá giảm từ giá gốc và % giảm
  const calcPriceSale = (price, percent) => {
    if (!price || !percent) return "";
    return Math.round(price * (1 - percent / 100));
  };
  console.log("products", products);

  return (
    <table className="min-w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">
            <input
              type="checkbox"
              checked={
                products.length > 0 && selectedRows.length === products.length
              }
              onChange={onSelectAll}
            />
          </th>
          <th className="p-2 border">Sản phẩm / Phân loại</th>
          <th className="p-2 border">Giá gốc</th>
          <th className="p-2 border">Giá Flash Sale</th>
          <th className="p-2 border">% Giảm</th>
          <th className="p-2 border">Tồn kho</th>
          <th className="p-2 border">Xóa</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, idx) =>
          p.hasVariations && Array.isArray(p.variantCombinations) ? (
            <React.Fragment key={p.productId || idx}>
              {/* Dòng cha: tên sản phẩm, ảnh */}
              <tr>
                <td
                  rowSpan={p.variantCombinations.length + 1}
                  className="p-2 border text-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={() => onSelectRow(idx)}
                  />
                </td>
                <td colSpan={5}>
                  <div className="font-semibold flex items-center bg-gray-50">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name || p.productId}
                      className="h-10 w-10 rounded-full mr-2"
                    />
                    <p>{p.name || p.productId}</p>
                  </div>
                </td>
                <td className="p-2 border">
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
              {/* Dòng từng phân loại */}
              {p.variantCombinations.map((v, vIdx) => {
                const percent = calcDiscountPercent(v.price, v.priceSale);
                return (
                  <tr key={v._id || vIdx}>
                    <td className="text-center p-2 border">
                      {v.attributes.map((a) => a.value).join(" - ")}
                    </td>
                    <td className="p-2 border">
                      {v.price ? `₫${v.price.toLocaleString("vi-VN")}` : ""}
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={v.priceSale || ""}
                        min={0}
                        onChange={(e) => {
                          const newPriceSale = Number(e.target.value);
                          const newPercent =
                            v.price && newPriceSale
                              ? Math.round(100 - (newPriceSale / v.price) * 100)
                              : "";
                          onChange(idx, "variantCombinations", {
                            variantIdx: vIdx,
                            field: "priceSale",
                            value: newPriceSale,
                          });
                          onChange(idx, "variantCombinations", {
                            variantIdx: vIdx,
                            field: "discountPercent",
                            value: newPercent,
                          });
                        }}
                        className="border rounded px-2 py-1 w-24"
                      />
                      <span className="ml-2 text-gray-500 text-xs">
                        {percent ? `(${percent}% ↓)` : ""}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <div className="flex items-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={v.discountPercent || ""}
                          onChange={(e) => {
                            const percentValue = e.target.value;
                            const newPriceSale = calcPriceSale(
                              v.price,
                              percentValue
                            );
                            onChange(idx, "variantCombinations", {
                              variantIdx: vIdx,
                              field: "discountPercent",
                              value: percentValue,
                            });
                            onChange(idx, "variantCombinations", {
                              variantIdx: vIdx,
                              field: "priceSale",
                              value: newPriceSale,
                            });
                          }}
                          className="border rounded px-2 py-1 w-16"
                          placeholder="%"
                        />
                        <span className="ml-2 text-gray-500 text-xs">
                          {v.discountPercent && v.price
                            ? `₫${calcPriceSale(
                                v.price,
                                v.discountPercent
                              ).toLocaleString("vi-VN")}`
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) =>
                          onChange(idx, "variantCombinations", {
                            variantIdx: vIdx,
                            field: "stock",
                            value: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ) : (
            // Sản phẩm không có biến thể
            <tr key={p.productId || idx}>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(idx)}
                  onChange={() => onSelectRow(idx)}
                />
              </td>
              <td className="p-2 border">
                <div className="flex gap-5 items-center">
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name || p.productId}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  {p.name || p.productId}
                </div>
              </td>
              <td className="p-2 border">
                {p.price ? `₫${p.price.toLocaleString("vi-VN")}` : ""}
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.priceSale || ""}
                  min={0}
                  onChange={(e) => {
                    const newPriceSale = Number(e.target.value);
                    const newPercent =
                      p.price && newPriceSale
                        ? Math.round(100 - (newPriceSale / p.price) * 100)
                        : "";
                    onChange(idx, "priceSale", newPriceSale);
                    onChange(idx, "discountPercent", newPercent);
                  }}
                  className="border rounded px-2 py-1 w-24"
                />
                <span className="ml-2 text-gray-500 text-xs">
                  {calcDiscountPercent(p.price, p.priceSale)
                    ? `(${calcDiscountPercent(p.price, p.priceSale)}% ↓)`
                    : ""}
                </span>
              </td>
              <td className="p-2 border">
                <div className="flex items-center">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={p.discountPercent || ""}
                    onChange={(e) => {
                      const percentValue = e.target.value;
                      const newPriceSale = calcPriceSale(p.price, percentValue);
                      onChange(idx, "discountPercent", percentValue);
                      onChange(idx, "priceSale", newPriceSale);
                    }}
                    className="border rounded px-2 py-1 w-16"
                    placeholder="%"
                  />
                  <span className="ml-2 text-gray-500 text-xs">
                    {p.discountPercent && p.price
                      ? `₫${calcPriceSale(
                          p.price,
                          p.discountPercent
                        ).toLocaleString("vi-VN")}`
                      : ""}
                  </span>
                </div>
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.stock}
                  onChange={(e) => onChange(idx, "stock", e.target.value)}
                  className="border rounded px-2 py-1 w-20"
                />
              </td>
              <td className="p-2 border">
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          )
        )}
        {products.length === 0 && (
          <tr>
            <td colSpan={7} className="text-center text-gray-500 p-2">
              Chưa có sản phẩm nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

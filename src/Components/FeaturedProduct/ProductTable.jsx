import React from "react";

export default function ProductTable({
  products,
  selectedRows,
  onSelectRow,
  onSelectAll,
  onChange,
  onRemove,
}) {
  // lấy giá nhỏ nhất
  function getDisplayPrice(product) {
    if (!product.hasVariations) {
      // Không có biến thể
      const price =
        product.priceSale && product.priceSale > 0
          ? product.priceSale
          : product.price;
      return price ? `₫${price.toLocaleString("vi-VN")}` : "";
    }
    // Có biến thể
    const prices = product.variantCombinations.map((v) =>
      v.priceSale && v.priceSale > 0 ? v.priceSale : v.price
    );
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₫${min.toLocaleString("vi-VN")}`;
    return `₫${min.toLocaleString("vi-VN")} - ₫${max.toLocaleString("vi-VN")}`;
  }

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
          <th className="p-2 border">Giá bán</th>
          <th className="p-2 border">Số lượng</th>
          <th className="p-2 border">Ngày tạo</th>
          <th className="p-2 border">Mức độ ưu tiên</th>
          <th className="p-2 border">Xóa</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, idx) => (
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
            <td className="p-2 border text-center">{getDisplayPrice(p)}</td>
            <td className="p-2 border text-center">
              {p.hasVariations
                ? p.variantCombinations.reduce(
                    (sum, item) => sum + item.stock,
                    0
                  )
                : p.stock}
            </td>
            <td className="p-2 border text-center">
              {new Date(p.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 border text-center">
              <input
                type="number"
                value={p.priority || 0}
                onChange={(e) => onChange(idx, "priority", e.target.value)}
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
        ))}
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

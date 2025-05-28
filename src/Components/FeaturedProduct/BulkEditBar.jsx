import React from "react";

export default function BulkEditBar({
  bulkPriority,
  setBulkPriority,
  onApply,
  disabled,
}) {
  return (
    <div className="flex gap-2 items-end mb-2">
      <input
        type="number"
        placeholder="Mức độ ưu tiên"
        value={bulkPriority}
        onChange={(e) => setBulkPriority(e.target.value)}
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

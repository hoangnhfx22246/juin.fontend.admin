import React, { useState } from "react";

const StockEntryForm = ({ suppliers = [], onSubmit }) => {
  const [isCreatingNewSupplier, setIsCreatingNewSupplier] = useState(false);
  const [selectedSupplierCode, setSelectedSupplierCode] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    phone: "",
    address: "",
    code: "",
  });

  const selectedSupplier = suppliers.find(
    (s) => s.code === selectedSupplierCode
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const supplierData = isCreatingNewSupplier ? newSupplier : selectedSupplier;
    if (!supplierData) return alert("Chưa có thông tin nhà cung cấp");

    const payload = {
      supplier: supplierData,
      // các dữ liệu khác như sản phẩm, trạng thái,...
    };

    onSubmit(payload);
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-800">Thông tin phiếu nhập</h2>

      <div className="flex items-center space-x-2">
        <input
          id="createNew"
          type="checkbox"
          checked={isCreatingNewSupplier}
          onChange={(e) => setIsCreatingNewSupplier(e.target.checked)}
          className="accent-blue-600"
        />
        <label htmlFor="createNew" className="text-gray-700 font-medium">
          Tạo nhà cung cấp mới
        </label>
      </div>

      {isCreatingNewSupplier ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Thông tin nhà cung cấp mới
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Mã nhà cung cấp"
              className="border p-2 rounded w-full"
              value={newSupplier.code}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, code: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Tên nhà cung cấp"
              className="border p-2 rounded w-full"
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border p-2 rounded w-full"
              value={newSupplier.phone}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              className="border p-2 rounded w-full"
              value={newSupplier.address}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, address: e.target.value })
              }
            />
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Chọn nhà cung cấp đã có
          </h3>

          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã..."
            className="border p-2 rounded w-full"
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            value={selectedSupplierCode}
            onChange={(e) => setSelectedSupplierCode(e.target.value)}
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            {filteredSuppliers.map((s) => (
              <option key={s.code} value={s.code}>
                [{s.code}] {s.name}
              </option>
            ))}
          </select>

          {selectedSupplier && (
            <div className="bg-white border p-3 rounded shadow-sm text-sm text-gray-700 space-y-1">
              <p>
                <strong>Mã:</strong> {selectedSupplier.code}
              </p>
              <p>
                <strong>Tên:</strong> {selectedSupplier.name}
              </p>
              <p>
                <strong>Điện thoại:</strong> {selectedSupplier.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedSupplier.address}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Lưu phiếu nhập
        </button>
      </div>
    </form>
  );
};

export default StockEntryForm;

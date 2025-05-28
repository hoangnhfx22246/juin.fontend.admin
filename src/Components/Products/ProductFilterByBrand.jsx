import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../redux/productSlice";
import { showNotification } from "../../util/notification";
import { brandAPI } from "../../api/brand";

const ProductFilterByBrand = () => {
  const dispatch = useDispatch();

  const { filters } = useSelector((state) => state.products);
  const [brands, setBrands] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  useEffect(() => {
    // Fetch brand from the store or API
    const fetchBrands = async () => {
      try {
        const response = await brandAPI.getBrands();
        setBrands(response.brands || []);
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    fetchBrands();
  }, []);
  const handleFilter = (e) => {
    const selectedBrandId = e.target.value || null;
    setSelectedBrand(
      brands.find((brand) => brand._id === selectedBrandId) || null
    );
    dispatch(setFilter({ ...filters, brandId: selectedBrandId }));
  };

  // Optional: đảm bảo brandId được giữ khi reload (nếu dùng redux-persist hoặc cần preload)
  useEffect(() => {
    if (!filters.brandId) return;
    dispatch(setFilter({ ...filters, brandId: filters.brandId }));
  }, []);

  return (
    <div className="max-w-xs">
      <select
        value={filters.brandId || ""}
        onChange={handleFilter}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Tất cả thương hiệu</option>
        {filters.brandId && selectedBrand && (
          <option value={filters.brandId}>{selectedBrand.name}</option>
        )}
        {brands
          .filter((brand) => brand._id !== filters.brandId)
          .map((brand, index) => (
            <option key={brand._id || `fallback-${index}`} value={brand._id}>
              {brand.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProductFilterByBrand;

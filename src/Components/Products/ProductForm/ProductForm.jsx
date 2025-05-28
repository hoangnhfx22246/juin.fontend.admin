import React, { useState, useEffect, useCallback } from "react";
import { showNotification } from "../../../util/notification";
import { categoryAPI } from "../../../api/category";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { brandAPI } from "../../../api/brand";
import AddBrandModal from "../../Brands/AddBrandModal";
import BrandSelector from "../../Brands/BrandSelector";
import CategorySelector from "./CategorySelector";
import ImageUploader from "./ImageUploader";
import MediaUploader from "./MediaUploader";
import ProductVariations from "./ProductVariations";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "../../../redux/productSlice";
import renderFieldErrors from "../../../util/renderFieldErrors";

const ProductForm = () => {
  const location = useLocation();
  const initialData = location.state?.productData;

  const { error: errorCreateProduct } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandOpLoading, setBrandOpLoading] = useState(false);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    brandId: "",
    specifications: [{ key: "", value: "" }],
    price: 0,
    priceSale: 0,
    // stock: 0, // cập nhật tự động theo hoá đơn xuất nhập
    weight: 0,
    packageLength: 0,
    packageWidth: 0,
    packageHeight: 0,
    images: [],
    isPreOrder: false,
    daysToShip: 2,
    condition: "new",
    video: { url: "", public_id: "" },
    status: "active",
    hasVariations: false,
    variations: [],
    variantCombinations: [],
  });
  const [imageFiles, setImageFiles] = useState([]); // [{url, public_id, file}]
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalImages, setOriginalImages] = useState([]); // [{url, public_id}]

  // Fetch categories & brands
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        setCategories(
          response.categories
            ?.filter((cat) => cat.parentId)
            .map((cat) => ({
              _id: cat._id,
              name: cat.name,
            })) || []
        );
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    const fetchBrands = async () => {
      try {
        const response = await brandAPI.getBrands();
        setBrands(response.brands || []);
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      }
    };
    fetchCategories();
    fetchBrands();
  }, []);

  // Khi vào edit, lưu lại ảnh gốc và set imageFiles đúng cấu trúc
  useEffect(() => {
    if (initialData) {
      setProductData({
        ...initialData,
        categoryId: initialData.categoryId?._id,
        brandId: initialData.brandId?._id,
      });

      // Ảnh gốc: [{url, public_id}]
      if (initialData.images && initialData.images.length > 0) {
        const imgs = initialData.images.map((img) =>
          typeof img === "string" ? { url: img } : img
        );
        setImageFiles(imgs);
        setOriginalImages(imgs);
      } else {
        setImageFiles([]);
        setOriginalImages([]);
      }

      // Video giữ nguyên như cũ
      if (initialData.video && initialData.video.url) {
        setVideoFile({ url: initialData.video.url });
      }
    }
  }, [initialData]);

  // Xử lý thay đổi input cơ bản
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Xử lý thuộc tính kỹ thuật (specifications)
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...productData.specifications];
    newSpecs[index][field] = value;
    setProductData((prev) => ({ ...prev, specifications: newSpecs }));
  };
  const addSpec = () => {
    setProductData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };
  const removeSpec = (index) => {
    setProductData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors = {};
    if (!productData.name.trim()) newErrors.name = "Product Name is required";
    if (!productData.categoryId) newErrors.categoryId = "Category is required";
    if (!productData.description.trim())
      newErrors.description = "Description is required";
    if (imageFiles.length === 0 && !initialData?.images?.length)
      newErrors.images = "At least one image is required";

    if (productData.hasVariations) {
      if (
        !productData.variations.length ||
        productData.variations.some(
          (variation) =>
            !variation.name ||
            !variation.options.length ||
            variation.options.some((opt) => !opt.name)
        )
      ) {
        newErrors.variations =
          "Vui lòng điền đầy đủ tên và lựa chọn cho các biến thể";
      }
      if (!productData.variantCombinations.length) {
        newErrors.variantCombinations = "Vui lòng nhập tổ hợp phân loại";
      } else {
        productData.variantCombinations.forEach((combo, index) => {
          if (!combo.price || combo.price <= 0)
            newErrors[`variantCombinations_price_${index}`] = "Price required";
          if (!combo.priceSale || combo.priceSale <= 0)
            newErrors[`variantCombinations_priceSale_${index}`] =
              "price sale required";
          if (
            !combo.attributes ||
            !Array.isArray(combo.attributes) ||
            combo.attributes.some((attr) => !attr.name || !attr.value)
          ) {
            newErrors[`variantCombinations_attributes_${index}`] =
              "Invalid attributes";
          }
        });
      }
    } else {
      if (!productData.price || productData.price <= 0)
        newErrors.price = "Price is required";
      if (!productData.priceSale || productData.priceSale <= 0)
        newErrors.priceSale = "price sale is required";
    }

    if (!productData.weight || productData.weight <= 0)
      newErrors.weight = "Weight is required";

    setErrors(newErrors);
    showNotification.error("kiểm tra lại các trường bắt buộc");
    return Object.keys(newErrors).length === 0;
  };

  // --- Xử lý submit form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);

    // Phân loại ảnh
    const existingImages = imageFiles.filter((img) => img.url && !img.file);
    const newImages = imageFiles.filter((img) => img.file);
    const deletedImages = originalImages.filter(
      (oldImg) => !imageFiles.find((img) => img.public_id === oldImg.public_id)
    );

    const formData = new FormData();

    // Append product data fields
    Object.keys(productData).forEach((key) => {
      if (
        key === "specifications" ||
        (productData.hasVariations &&
          (key === "variations" || key === "variantCombinations"))
      ) {
        formData.append(key, JSON.stringify(productData[key]));
      } else if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Append option images (biến thể)
    if (productData.hasVariations) {
      productData.variations.forEach((variation) => {
        variation.options.forEach((option) => {
          if (option.image && option.image.file) {
            formData.append(`optionImages`, option.image.file);
          }
        });
      });
    }

    // Ảnh mới
    newImages.forEach((img) => {
      formData.append("newImages", img.file);
    });

    // Ảnh cũ giữ lại
    formData.append("existingImages", JSON.stringify(existingImages));

    // Ảnh cũ bị xoá
    formData.append(
      "deletedImages",
      JSON.stringify(deletedImages.map((img) => img.public_id))
    );

    // Append video file (if present)
    if (videoFile) {
      if (videoFile instanceof File) {
        formData.append("video", videoFile);
      } else if (videoFile.url) {
        formData.append("video", videoFile.url);
      }
    }

    try {
      if (initialData?._id) {
        await dispatch(
          updateProduct({ id: initialData._id, formData })
        ).unwrap();
        console.log(
          "Updating product (FormData):",
          Object.fromEntries(formData)
        ); // Demo
      } else {
        console.log("add product (FormData):", Object.fromEntries(formData)); // Demo
        await dispatch(createProduct(formData)).unwrap();
      }
      navigate("/products");
    } catch (error) {
      setErrors({ submit: error.message || "Failed to save product" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Xử lý modal thêm/xóa thương hiệu ---
  const handleOpenAddBrandModal = () => {
    setIsAddBrandModalOpen(true);
  };

  const handleSaveNewBrand = async (brandName) => {
    setBrandOpLoading(true);
    try {
      const response = await brandAPI.createBrands(brandName);
      setBrands((prev) => [...prev, response.brand]);
      setIsAddBrandModalOpen(false);
    } catch (error) {
      showNotification.error(
        error.response?.data?.errors[0]?.messages[0] || error.message
      );
      throw error;
    } finally {
      setBrandOpLoading(false);
    }
  };

  const handleDeleteBrand = async (brandIdToDelete) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa thương hiệu này? Tất cả sản phẩm liên quan sẽ bị ảnh hưởng."
      )
    ) {
      setBrandOpLoading(true);
      try {
        await brandAPI.deleteBrand(brandIdToDelete);
        setBrands((prev) =>
          prev.filter((brand) => brand._id !== brandIdToDelete)
        );
      } catch (error) {
        showNotification.error(error.response.data.message);
        throw error;
      } finally {
        setBrandOpLoading(false);
        setIsAddBrandModalOpen(false);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-gray-50 p-4 md:p-8 rounded-lg"
      >
        {/* --- Media Management Section --- */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            1. Quản lý hình ảnh video
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh sản phẩm *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tải lên tối đa 9 hình ảnh. Hình ảnh đầu tiên là ảnh bìa.
            </p>
            <ImageUploader files={imageFiles} setFiles={setImageFiles} />
            {errors.images && (
              <p className="text-xs text-red-500 mt-1">{errors.images}</p>
            )}
          </div>
          <div className="mt-4">
            <MediaUploader value={videoFile} onFilesChange={setVideoFile} />
          </div>
        </div>
        {/* --- Thông tin cơ bản --- */}

        <h1 className="text-2xl font-bold">
          {productData.name ? "Edit Product" : "Add Product"}
        </h1>
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            2. Thông tin cơ bản
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tiêu đề sản phẩm *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errorCreateProduct &&
                renderFieldErrors("name", errorCreateProduct)}
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Danh mục sản phẩm *
              </label>
              <CategorySelector
                value={productData.categoryId}
                onChange={handleChange}
                categories={categories}
                name="categoryId"
                errors={errors}
              />
              {errors.categoryId && (
                <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả sản phẩm *
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={productData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Specifications Section --- */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            3. Thông số kỹ thuật
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="brandId"
                className="block text-sm font-medium text-gray-700"
              >
                Thương hiệu (Tùy chọn)
              </label>
              <BrandSelector
                value={productData.brandId}
                onChange={handleChange}
                brands={brands}
                name="brandId"
                error={errors.brandId}
                onAddBrand={handleOpenAddBrandModal}
                onDeleteBrand={handleDeleteBrand}
              />
            </div>

            <h3 className="text-lg font-medium pt-4">Thuộc tính</h3>
            <div className="space-y-3">
              {productData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Tên thuộc tính (e.g., Vật liệu)"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị thuộc tính (e.g., Cotton)"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    className="flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  {productData.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpec}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              + Add More Attributes
            </button>
          </div>
        </div>

        {/* --- Sales Information Section --- */}
        <ProductVariations
          productData={productData}
          setProductData={setProductData}
          errors={errors}
          handleChange={handleChange}
        />

        {/* --- Shipping Section --- */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            5. Vận chuyển
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Cân nặng (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                id="weight"
                name="weight"
                value={productData.weight}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.weight && (
                <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="packageLength"
                className="block text-sm font-medium text-gray-700"
              >
                Chiều dài gói hàng (cm)
              </label>
              <input
                type="number"
                id="packageLength"
                name="packageLength"
                value={productData.packageLength}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="packageWidth"
                className="block text-sm font-medium text-gray-700"
              >
                Chiều rộng gói hàng (cm)
              </label>
              <input
                type="number"
                id="packageWidth"
                name="packageWidth"
                value={productData.packageWidth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="packageHeight"
                className="block text-sm font-medium text-gray-700"
              >
                Chiều cao gói hàng (cm)
              </label>
              <input
                type="number"
                id="packageHeight"
                name="packageHeight"
                value={productData.packageHeight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Other Information Section --- */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            6. Thông tin khác
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPreOrder"
                name="isPreOrder"
                checked={productData.isPreOrder}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="isPreOrder"
                className="ml-2 block text-sm text-gray-900"
              >
                Hàng Đặt trước
              </label>
            </div>
            {productData.isPreOrder && (
              <div>
                <label
                  htmlFor="daysToShip"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày giao hàng
                </label>
                <input
                  type="number"
                  id="daysToShip"
                  name="daysToShip"
                  value={productData.daysToShip}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="e.g., 7-30 days"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700"
              >
                Tình trạng
              </label>
              <select
                id="condition"
                name="condition"
                value={productData.condition}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="NEW">Mới</option>
                <option value="USED">Đã sử dụng</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Submission Area --- */}
        <div className="pt-5">
          {errors.submit && (
            <p className="text-sm text-red-600 mb-4 text-center">
              {errors.submit}
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : initialData
                ? "Cập nhật sản phẩm"
                : "Tạo sản phẩm"}
            </button>
          </div>
        </div>
      </form>
      <AddBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => setIsAddBrandModalOpen(false)}
        onSave={handleSaveNewBrand}
        isLoading={brandOpLoading}
      />
    </>
  );
};

export default ProductForm;

import { useCallback, useEffect, useState } from "react";

export default function ProductVariations({
  productData,
  setProductData,
  errors,
  handleChange,
}) {
  const [globalVariantDefaults, setGlobalVariantDefaults] = useState({
    price: "",
    priceSale: "",
  });
  // --- Xử lý biến thể sản phẩm (variations) ---
  // ...handleAddVariationType, handleRemoveVariationType, handleVariationTypeNameChange...
  // ...handleAddVariationOption, handleRemoveVariationOption, handleVariationOptionNameChange, handleVariationOptionImageChange...
  const handleAddVariationType = () => {
    setProductData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          name: "",
          options: [{ name: "", image: { url: "", public_id: "" } }],
        },
      ],
    }));
  };
  const handleRemoveVariationType = (typeIndex) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== typeIndex),
    }));
  };
  const handleVariationTypeNameChange = (typeIndex, newTypeName) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === typeIndex ? { ...v, name: newTypeName } : v
      ),
    }));
  };
  const handleAddVariationOption = (typeIndex) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === typeIndex
          ? {
              ...v,
              options: [
                ...v.options,
                { name: "", image: { url: "", public_id: "" } },
              ],
            }
          : v
      ),
    }));
  };
  const handleRemoveVariationOption = (typeIndex, optionIndex) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === typeIndex
          ? { ...v, options: v.options.filter((_, oi) => oi !== optionIndex) }
          : v
      ),
    }));
  };
  const handleVariationOptionNameChange = (
    typeIndex,
    optionIndex,
    newOptionName
  ) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === typeIndex
          ? {
              ...v,
              options: v.options.map((opt, oi) =>
                oi === optionIndex ? { ...opt, name: newOptionName } : opt
              ),
            }
          : v
      ),
    }));
  };
  const handleVariationOptionImageChange = async (
    typeIndex,
    optionIndex,
    imageFile
  ) => {
    if (!imageFile) return;
    const uploadedImage = {
      url: URL.createObjectURL(imageFile),
      public_id: `temp_id_${Date.now()}_${imageFile.name}`,
      file: imageFile, // Lưu file gốc vào option
    };

    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === typeIndex
          ? {
              ...v,
              options: v.options.map((opt, oi) =>
                oi === optionIndex ? { ...opt, image: uploadedImage } : opt
              ),
            }
          : v
      ),
    }));
  };

  // --- Sinh ra các combination của biến thể ---
  // ...generateVariantCombinations, useEffect...
  // --- Generate Variant Combinations ---
  // Hàm tạo key duy nhất cho một tổ hợp thuộc tính biến thể (dùng để so sánh/truy xuất)
  const getAttributesKey = (attributes) => {
    return attributes
      .map((attr) => `${attr.name}:${attr.value}`) // Ghép tên và giá trị từng thuộc tính
      .sort() // Sắp xếp để đảm bảo thứ tự không ảnh hưởng đến key
      .join("|"); // Nối lại thành chuỗi duy nhất
  };

  // Hàm sinh ra tất cả các tổ hợp biến thể dựa trên các lựa chọn hiện tại
  const generateVariantCombinations = useCallback(
    (currentVariations, existingCombinations) => {
      // Lọc ra các biến thể hợp lệ (có tên và có ít nhất 1 lựa chọn hợp lệ)
      const activeVariations = currentVariations.filter(
        (v) => v.name && v.options.length > 0
      );

      // Nếu không có biến thể hợp lệ thì trả về mảng rỗng
      if (activeVariations.length === 0) {
        return [];
      }

      // Tạo Map để tra cứu nhanh các tổ hợp cũ theo key
      const existingCombinationsMap = new Map();
      existingCombinations.forEach((combo) => {
        existingCombinationsMap.set(getAttributesKey(combo.attributes), combo);
      });

      const newVariantCombinations = []; // Mảng kết quả các tổ hợp mới

      // Hàm đệ quy để sinh tổ hợp
      const recurse = (depth, currentCombinationAttributes) => {
        // Nếu đã đi hết các loại biến thể, push tổ hợp vào mảng kết quả
        if (depth === activeVariations.length) {
          const key = getAttributesKey(currentCombinationAttributes); // Tạo key cho tổ hợp hiện tại
          const existingCombo = existingCombinationsMap.get(key); // Kiểm tra tổ hợp này đã có chưa
          newVariantCombinations.push({
            attributes: [...currentCombinationAttributes], // Danh sách thuộc tính của tổ hợp
            price: existingCombo
              ? existingCombo.price // Nếu đã có thì giữ lại giá cũ
              : globalVariantDefaults.price !== ""
              ? Number(globalVariantDefaults.price) // Nếu có giá mặc định thì dùng
              : 0, // Không thì để 0
            priceSale: existingCombo
              ? existingCombo.priceSale // Nếu đã có thì giữ lại giá cũ
              : globalVariantDefaults.priceSale !== ""
              ? Number(globalVariantDefaults.priceSale) // Nếu có giá mặc định thì dùng
              : 0, // Không thì để 0
          });
          return;
        }

        // Duyệt từng lựa chọn của loại biến thể hiện tại
        const currentVariationType = activeVariations[depth];
        for (const option of currentVariationType.options) {
          if (option.name) {
            // Thêm lựa chọn vào tổ hợp hiện tại
            currentCombinationAttributes.push({
              name: currentVariationType.name,
              value: option.name,
            });
            // Đệ quy sang loại biến thể tiếp theo
            recurse(depth + 1, currentCombinationAttributes);
            // Xoá lựa chọn vừa thêm để thử lựa chọn khác
            currentCombinationAttributes.pop();
          }
        }
      };

      recurse(0, []); // Bắt đầu đệ quy từ loại biến thể đầu tiên
      return newVariantCombinations; // Trả về mảng tổ hợp
    },
    [globalVariantDefaults.price, globalVariantDefaults.priceSale] // Phụ thuộc vào giá/số lượng mặc định
  );
  useEffect(() => {
    if (productData.hasVariations) {
      const newCombs = generateVariantCombinations(
        productData.variations,
        productData.variantCombinations
      );
      if (
        JSON.stringify(newCombs) !==
        JSON.stringify(productData.variantCombinations)
      ) {
        setProductData((prev) => ({ ...prev, variantCombinations: newCombs }));
      }
    } else {
      if (productData.variantCombinations.length > 0) {
        setProductData((prev) => ({ ...prev, variantCombinations: [] }));
      }
    }
  }, [
    productData.variations,
    productData.hasVariations,
    generateVariantCombinations,
    productData.variantCombinations,
    setProductData,
  ]);
  // --- Xử lý thay đổi chi tiết từng combination ---
  // ...handleVariantDetailChange, handleGlobalVariantDefaultsChange, handleApplyToAllVariants...
  // --- Variant Detail Handlers ---
  const handleVariantDetailChange = (comboIndex, field, value) => {
    setProductData((prev) => ({
      ...prev,
      variantCombinations: prev.variantCombinations.map((combo, i) =>
        i === comboIndex
          ? {
              ...combo,
              [field]:
                field === "price" || field === "priceSale"
                  ? Number(value) || 0
                  : value,
            }
          : combo
      ),
    }));
  };

  const handleGlobalVariantDefaultsChange = (e) => {
    const { name, value } = e.target;
    setGlobalVariantDefaults((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyToAllVariants = () => {
    if (productData.variantCombinations.length === 0) return;

    const priceToApply =
      globalVariantDefaults.price !== ""
        ? Number(globalVariantDefaults.price)
        : productData.variantCombinations[0]?.price || 0;
    const priceSaleToApply =
      globalVariantDefaults.priceSale !== ""
        ? Number(globalVariantDefaults.priceSale)
        : productData.variantCombinations[0]?.priceSale || 0;

    setProductData((prev) => ({
      ...prev,
      variantCombinations: prev.variantCombinations.map((combo) => ({
        ...combo,
        price: priceToApply,
        priceSale: priceSaleToApply,
      })),
    }));
  };
  // --- Lấy ảnh cho từng combination ---
  // ...getVariantOptionImage...
  const getVariantOptionImage = (variantAttributes) => {
    if (
      !productData.variations ||
      productData.variations.length === 0 ||
      !variantAttributes ||
      variantAttributes.length === 0
    ) {
      return null;
    }
    // Assuming image is associated with the first variation type
    const firstVariationTypeName = productData.variations[0].name;
    const relevantAttribute = variantAttributes.find(
      (attr) => attr.name === firstVariationTypeName
    );

    if (!relevantAttribute) return null;

    const optionInFirstVariation = productData.variations[0].options.find(
      (opt) => opt.name === relevantAttribute.value
    );

    return optionInFirstVariation?.image?.url || null;
  };
  // --- End Variation Handling ---
  const renderSalesInfo = () => {
    // Basic styling (inline for simplicity)
    const styles = {
      formGroup: { marginBottom: "15px" },
      label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
      input: {
        width: "100%",
        padding: "8px",
        boxSizing: "border-box",
        marginBottom: "5px",
      },
      button: { padding: "8px 12px", marginRight: "10px", cursor: "pointer" },
      variationBlock: {
        border: "1px solid #eee",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "4px",
      },
      optionBlock: {
        marginLeft: "20px",
        borderLeft: "2px solid #f0f0f0",
        paddingLeft: "10px",
        marginBottom: "5px",
      },
      table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
      th: {
        border: "1px solid #ddd",
        padding: "8px",
        backgroundColor: "#f2f2f2",
        textAlign: "left",
      },
      td: {
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
        verticalAlign: "middle",
      },
      imagePreview: {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        marginRight: "10px",
      },
      smallInput: { width: "80px", padding: "6px" },
    };
    if (productData.hasVariations) {
      return (
        <div>
          <h3>Biến thể sản phẩm</h3>
          {errors.variations && (
            <p className="text-xs text-red-500 mt-1">{errors.variations}</p>
          )}
          {productData.variations.map((variation, typeIndex) => (
            <div key={typeIndex} style={styles.variationBlock}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder={`biến thể ${
                    typeIndex + 1
                  } (e.g., Màu sắc, Kích thước)`}
                  value={variation.name}
                  onChange={(e) =>
                    handleVariationTypeNameChange(typeIndex, e.target.value)
                  }
                  style={{ ...styles.input, flexGrow: 1, marginRight: "10px" }}
                />

                {errors.variations && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.variations}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveVariationType(typeIndex)}
                  style={styles.button}
                >
                  Xoá biến thể
                </button>
              </div>

              {variation.options.map((option, optionIndex) => (
                <div key={optionIndex} style={styles.optionBlock}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={`Lựa chọn ${optionIndex + 1} (e.g., Đỏ, S)`}
                      value={option.name}
                      onChange={(e) =>
                        handleVariationOptionNameChange(
                          typeIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                      style={{
                        ...styles.input,
                        flexGrow: 1,
                        marginRight: "10px",
                      }}
                    />
                    {errors.variantCombinations && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.variantCombinations}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveVariationOption(typeIndex, optionIndex)
                      }
                      style={styles.button}
                    >
                      X
                    </button>
                  </div>
                  {/* Show image input only for the first variation type, as per common e-commerce patterns */}
                  {typeIndex === 0 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleVariationOptionImageChange(
                            typeIndex,
                            optionIndex,
                            e.target.files[0]
                          )
                        }
                        style={{ marginBottom: "5px" }}
                      />
                      {option.image?.url && (
                        <img
                          src={option.image.url}
                          alt={option.name}
                          style={styles.imagePreview}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddVariationOption(typeIndex)}
                className="cursor-pointer bg-blue-50 border-2 border-blue-500 text-blue-500 px-4 py-2 rounded"
              >
                + Thêm lựa chọn
              </button>
            </div>
          ))}
          {productData.variations.length < 2 && ( // Limit to 2 variation types as per image
            <button
              type="button"
              onClick={handleAddVariationType}
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
            >
              + Thêm biến thể
            </button>
          )}

          <h4>Danh sách kết hợp biến thể</h4>
          {productData.variantCombinations.length > 0 && (
            <div
              style={{
                ...styles.formGroup,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                border: "1px solid #eee",
                padding: "10px",
              }}
            >
              <input
                type="number"
                name="price"
                placeholder="Giá gốc"
                value={globalVariantDefaults.price}
                onChange={handleGlobalVariantDefaultsChange}
                min={0}
              />
              <input
                type="number"
                name="priceSale"
                placeholder="Giá giảm"
                value={globalVariantDefaults.priceSale}
                onChange={handleGlobalVariantDefaultsChange}
                min={0}
              />
              <button
                type="button"
                onClick={handleApplyToAllVariants}
                style={{ ...styles.button, backgroundColor: "#ffb3b3" }}
              >
                Áp dụng
              </button>
            </div>
          )}

          <table style={styles.table}>
            <thead>
              <tr>
                {productData.variations.map(
                  (v, i) =>
                    v.name && (
                      <th key={i} style={styles.th}>
                        {v.name}
                      </th>
                    )
                )}
                {productData.variations.length > 0 &&
                  productData.variations[0].name && (
                    <th style={styles.th}>Ảnh</th>
                  )}
                <th style={styles.th}>* Giá gốc</th>
                <th style={styles.th}>* Giá giảm</th>
                <th style={styles.th}>* Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {productData.variantCombinations.map((combo, comboIndex) => (
                <tr key={comboIndex}>
                  {combo.attributes.map((attr, attrIndex) => (
                    <td key={attrIndex} style={styles.td}>
                      {attr.value}
                    </td>
                  ))}
                  {productData.variations.length > 0 &&
                    productData.variations[0].name && (
                      <td style={styles.td}>
                        {getVariantOptionImage(combo.attributes) && (
                          <img
                            src={getVariantOptionImage(combo.attributes)}
                            alt="variant"
                            style={styles.imagePreview}
                          />
                        )}
                      </td>
                    )}
                  <td style={styles.td}>
                    <input
                      min={0}
                      type="number"
                      value={combo.price}
                      onChange={(e) =>
                        handleVariantDetailChange(
                          comboIndex,
                          "price",
                          e.target.value
                        )
                      }
                      style={{ ...styles.input, ...styles.smallInput }}
                      required
                    />
                    {errors[`variantCombinations_price_${comboIndex}`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`variantCombinations_price_${comboIndex}`]}
                      </p>
                    )}
                    {/* Hiển thị giá đã format */}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        ...styles.input,
                        ...styles.smallInput,
                      }}
                    >
                      {combo.price
                        ? Number(combo.price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        : ""}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <input
                      min={0}
                      type="number"
                      value={combo.priceSale}
                      onChange={(e) =>
                        handleVariantDetailChange(
                          comboIndex,
                          "priceSale",
                          e.target.value
                        )
                      }
                      style={{ ...styles.input, ...styles.smallInput }}
                      required
                    />
                    {errors[`variantCombinations_priceSale_${comboIndex}`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`variantCombinations_priceSale_${comboIndex}`]}
                      </p>
                    )}
                    {/* Hiển thị giá đã format */}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        ...styles.input,
                        ...styles.smallInput,
                      }}
                    >
                      {combo.priceSale
                        ? Number(combo.priceSale).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        : ""}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Single Price/Stock
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá gốc *
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                ...styles.input,
                ...styles.smallInput,
              }}
            >
              {productData.price
                ? Number(productData.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : ""}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá ưu đãi *
            </label>
            <input
              type="number"
              name="priceSale"
              value={productData.priceSale}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.priceSale ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                ...styles.input,
                ...styles.smallInput,
              }}
            >
              {productData.priceSale
                ? Number(productData.priceSale).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : ""}
            </div>
            {errors.priceSale && (
              <p className="text-xs text-red-500 mt-1">{errors.priceSale}</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        4. Thông tin bán hàng
      </h2>
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="hasVariations"
            name="hasVariations"
            checked={productData.hasVariations}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="hasVariations"
            className="ml-2 block text-sm text-gray-900"
          >
            Kích hoạt các biến thể (e.g., Màu sắc, Kích thước)
          </label>
        </div>
        {renderSalesInfo()}
      </div>
    </div>
  );
}

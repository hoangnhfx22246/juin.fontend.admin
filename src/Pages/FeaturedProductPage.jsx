import React, { useCallback, useEffect, useState } from "react";
import { showNotification } from "../util/notification";
import { featuredProductAPI } from "../api/featuredProduct";
import { useNavigate } from "react-router-dom";
import FeaturedProductTable from "../Components/FeaturedProduct/FeaturedProductTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FeaturedProductPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFeaturedProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await featuredProductAPI.getFeaturedProducts();
      setFeaturedProducts(response.featuredProducts);
    } catch (error) {
      showNotification.error(error.response.data.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await featuredProductAPI.deleteFeaturedProducts(id);
        showNotification.success("Xoá thành công");
        await fetchFeaturedProduct();
      } catch (error) {
        console.error("Error:", error);
        showNotification.error(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    fetchFeaturedProduct();
  }, [fetchFeaturedProduct]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý FeaturedProduct</h1>
        <button
          onClick={() => {
            navigate("/featured-products/add");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tạo FeaturedProduct
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 ">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-lg" />
          Loading...
        </div>
      ) : (
        <>
          <FeaturedProductTable
            featuredProducts={featuredProducts}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default FeaturedProductPage;

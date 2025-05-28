import React, { useCallback, useEffect, useState } from "react";
import { showNotification } from "../util/notification";
import { flashSaleAPI } from "../api/flashSale";
import { useNavigate } from "react-router-dom";
import FlashSaleTable from "../Components/FlashSale/FlashSaleTable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FlashSalePage = () => {
  const [flashSales, setFlashSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFlashSale = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await flashSaleAPI.getFlashSales();
      setFlashSales(response.flashSales);
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
        await flashSaleAPI.deleteFlashSales(id);
        showNotification.success("Xoá thành công");
        await fetchFlashSale();
      } catch (error) {
        console.error("Error:", error);
        showNotification.error(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    fetchFlashSale();
  }, [fetchFlashSale]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý FlashSale</h1>
        <button
          onClick={() => {
            navigate("/flash-sales/add");
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tạo FlashSale
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 ">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-lg" />
          Loading...
        </div>
      ) : (
        <>
          <FlashSaleTable flashSales={flashSales} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default FlashSalePage;

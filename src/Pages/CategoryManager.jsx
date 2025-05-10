import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchParentCategories,
  setPage,
} from "../redux/categorySlice";
import CategoryTable from "../Components/Categories/CategoryTable";
import CategoryForm from "../Components/Categories/CategoryForm";
import CategorySearch from "../Components/Categories/CategorySearch";
import CategoryFilter from "../Components/Categories/CategoryFilter";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ReactPaginate from "react-paginate";

const CategoryManager = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, filters, pagination, sort } = useSelector(
    (state) => state.categories
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const loadCategories = useCallback(() => {
    dispatch(
      fetchCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        parentId: filters.parentId,
        sortField: sort.field,
        sortOrder: sort.order,
      })
    );
  }, [
    dispatch,
    filters.search,
    filters.parentId,
    pagination.page,
    pagination.limit,
    sort.field,
    sort.order,
  ]);
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  useEffect(() => {
    dispatch(fetchParentCategories());
  }, [dispatch]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    loadCategories();
  };
  // Handle page change from ReactPaginate
  const handlePageClick = (event) => {
    // event.selected is 0-indexed, our Redux state for page is 1-indexed
    dispatch(setPage(event.selected + 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategorySearch />
        <CategoryFilter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-4 ">
          <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-lg" />
          Loading...
        </div>
      ) : (
        <>
          <CategoryTable categories={categories} onEdit={handleEdit} />
          {pagination.total > pagination.limit && (
            <div className="mt-8 flex justify-center">
              <ReactPaginate
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                breakLabel={"..."}
                pageCount={pagination.total / pagination.limit}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3} // Show 3 page numbers in the middle
                onPageChange={handlePageClick}
                containerClassName={
                  "flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
                }
                pageClassName={"px-1"}
                pageLinkClassName={
                  "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                }
                previousClassName={"px-1"}
                previousLinkClassName={
                  "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                }
                nextClassName={"px-1"}
                nextLinkClassName={
                  "px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                }
                breakClassName={"px-1"}
                breakLinkClassName={"px-3 py-2 rounded-md text-gray-700"}
                activeClassName={"bg-blue-500 rounded-md"}
                activeLinkClassName={"!text-white hover:!bg-blue-600"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
                // forcePage is 0-indexed, pagination.page is 1-indexed
                forcePage={pagination.page - 1}
              />
            </div>
            // <div className="mt-4 flex justify-center">
            //   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            //     {Array.from({
            //       length: Math.ceil(pagination.total / pagination.limit),
            //     }).map((_, index) => (
            //       <button
            //         key={index}
            //         onClick={() => dispatch(setPage(index + 1))}
            //         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
            //           ${
            //             pagination.page === index + 1
            //               ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
            //               : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            //           }`}
            //       >
            //         {index + 1}
            //       </button>
            //     ))}
            //   </nav>
            // </div>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <CategoryForm
              editData={editingCategory}
              onClose={handleCloseModal}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;

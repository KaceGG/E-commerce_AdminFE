import { create } from "zustand";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: true,
  error: "",

  fetchCategories: async (navigate) => {
    set({ loading: true });

    try {
      const response = await getAllCategories();
      if (response.code === 200) {
        set({ categories: response.result || [], loading: false });
      } else {
        // Không làm trống categories, giữ nguyên danh sách hiện tại
        set({ loading: false });
      }
    } catch (err) {
      // Không làm trống categories, giữ nguyên danh sách hiện tại
      set({ loading: false });
      if (err.code === 401 || err.code === 403) {
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    }
  },

  addCategory: async (categoryData) => {
    try {
      const response = await addCategory(categoryData);
      if (response.code === 200) {
        set((state) => ({
          categories: [...state.categories, response.result],
        }));
        return { success: true };
      } else {
        const errorMessage = response.message;
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi khi thêm danh mục";
      return { success: false, message: errorMessage };
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await updateCategory(categoryId, categoryData);
      if (response.code === 200) {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === categoryId ? response.result : category
          ),
        }));
        return { success: true };
      } else {
        const errorMessage = response.message || "Không thể cập nhật danh mục";
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi khi cập nhật danh mục";
      return { success: false, message: errorMessage };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      if (response.code === 200) {
        set((state) => ({
          categories: state.categories.filter(
            (category) => category.id !== categoryId
          ),
        }));
        return { success: true };
      } else {
        const errorMessage = response.message || "Không thể xóa danh mục";
        return { success: false, message: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Có lỗi khi xóa danh mục";
      return { success: false, message: errorMessage };
    }
  },
}));

export default useCategoryStore;

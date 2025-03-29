import { create } from "zustand";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../services/productService";

const useProductStore = create((set) => ({
  products: [],
  loading: true,
  error: "",

  fetchProducts: async (navigate) => {
    set({ loading: true, error: "" });
    try {
      const response = await getAllProducts();
      if (response.code === 200) {
        set({ products: response.result || [], error: "", loading: false });
      } else {
        set({
          products: [],
          error: "Không thể lấy danh sách sản phẩm",
          loading: false,
        });
      }
    } catch (err) {
      set({
        products: [],
        error: err.message || "Có lỗi khi lấy danh sách sản phẩm",
        loading: false,
      });
      if (err.code === 401 || err.code === 403) {
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    }
  },

  addProduct: async (productData, navigate) => {
    set({ loading: true });
    const response = await addProduct(productData);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        products: [...state.products, response.result],
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/"); // Điều hướng về trang đăng nhập nếu không có quyền
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else if (response.code === 409) {
      return { success: false, message: "Sản phẩm đã tồn tại!" };
    } else {
      return {
        success: false,
        message: response.message || "Không thể thêm sản phẩm",
      };
    }
  },

  updateProduct: async (productId, productData, navigate) => {
    set({ loading: true });
    const response = await updateProduct(productData, productId);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId ? response.result : product
        ),
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/"); // Điều hướng về trang đăng nhập nếu không có quyền
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else if (response.code === 409) {
      return { success: false, message: "Sản phẩm đã tồn tại!" };
    } else {
      return {
        success: false,
        message: response.message || "Không thể cập nhật sản phẩm",
      };
    }
  },

  deleteProduct: async (productId, navigate) => {
    set({ loading: true });
    const response = await deleteProduct(productId);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/"); // Điều hướng về trang đăng nhập nếu không có quyền
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else {
      return {
        success: false,
        message: response.message || "Không thể xoá sản phẩm",
      };
    }
  },
}));

export default useProductStore;

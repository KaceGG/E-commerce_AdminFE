import { create } from "zustand";
import { getAllOrders } from "../services/orderService";

const useOrderStore = create((set) => ({
  orders: [],
  loading: true,
  error: "",

  // Lấy danh sách đơn hàng
  fetchOrders: async (navigate) => {
    set({ loading: true, error: "" });
    try {
      const response = await getAllOrders();
      if (response.code === 200) {
        set({ orders: response.result || [], error: "", loading: false });
      } else {
        set({
          orders: [],
          error: "Không thể lấy danh sách đơn hàng",
          loading: false,
        });
      }
    } catch (err) {
      set({
        orders: [],
        error: err.message || "Có lỗi khi lấy danh sách đơn hàng",
        loading: false,
      });
      if (err.code === 401 || err.code === 403) {
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    }
  },
}));

export default useOrderStore;

import { create } from "zustand";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../services/userService";

const useUserStore = create((set) => ({
  users: [],
  loading: true,
  error: "",

  // Lấy danh sách người dùng
  fetchUsers: async (navigate) => {
    set({ loading: true, error: "" });
    try {
      const response = await getAllUsers();
      if (response.code === 200) {
        set({ users: response.result || [], error: "", loading: false });
      } else {
        set({
          users: [],
          error: "Không thể lấy danh sách người dùng",
          loading: false,
        });
      }
    } catch (err) {
      set({
        users: [],
        error: err.message || "Có lỗi khi lấy danh sách người dùng",
        loading: false,
      });
      if (err.code === 401 || err.code === 403) {
        if (window.location.pathname !== "/") {
          navigate("/");
        }
      }
    }
  },

  // Thêm người dùng mới
  addUser: async (userData, navigate) => {
    set({ loading: true });
    const response = await createUser(userData);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        users: [...state.users, response.result],
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/");
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else if (response.code === 409) {
      return { success: false, message: "Tên người dùng đã tồn tại!" };
    } else {
      return {
        success: false,
        message: response.message || "Không thể thêm người dùng",
      };
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (userId, userData, navigate) => {
    set({ loading: true });
    const response = await updateUser(userId, userData);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? response.result : user
        ),
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/");
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else {
      return {
        success: false,
        message: response.message || "Không thể cập nhật người dùng",
      };
    }
  },

  // Xóa người dùng
  deleteUser: async (userId, navigate) => {
    set({ loading: true });
    const response = await deleteUser(userId);
    set({ loading: false });

    if (response.code === 200) {
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/");
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else {
      return {
        success: false,
        message: response.message || "Không thể xóa người dùng",
      };
    }
  },

  // Đổi mật khẩu người dùng
  changeUserPassword: async (userId, passwordData, navigate) => {
    set({ loading: true });
    const response = await changePassword(userId, passwordData);
    set({ loading: false });

    if (response.code === 200) {
      return { success: true };
    } else if (response.code === 401 || response.code === 403) {
      navigate("/");
      return {
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      };
    } else {
      return {
        success: false,
        message: response.message || "Không thể đổi mật khẩu",
      };
    }
  },
}));

export default useUserStore;

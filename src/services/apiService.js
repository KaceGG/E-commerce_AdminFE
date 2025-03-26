import axios from "axios";

const BASE_URL = "http://localhost:8080/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động thêm token vào header
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Xử lý lỗi chung (ví dụ: nếu token hết hạn)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Xử lý khi token hết hạn: đăng xuất người dùng, chuyển hướng về trang đăng nhập
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data; // Trả về dữ liệu từ server (ví dụ: token, user info)
  } catch (error) {
    throw error.response?.data || { message: "Có lỗi xảy ra khi đăng nhập" };
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/logout");
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Có lỗi khi đăng xuất" };
  }
};

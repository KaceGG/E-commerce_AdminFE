import apiClient from "./apiClient";

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
    const response = await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Có lỗi khi đăng xuất" };
  }
};

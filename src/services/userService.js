import axios from "axios";

const BASE_URL = "http://localhost:8080"; // Thay bằng URL backend của bạn

// Lấy tất cả người dùng
const getAllUsers = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/user/getAll`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi lấy danh sách người dùng",
    };
  }
};

// Thêm người dùng mới
const createUser = async (userData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(`${BASE_URL}/user/create`, userData, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi thêm người dùng",
    };
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (userId, userData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}/user/update/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi cập nhật người dùng",
    };
  }
};

// Xóa người dùng
const deleteUser = async (userId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.delete(`${BASE_URL}/user/delete/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi xóa người dùng",
    };
  }
};

// Đổi mật khẩu người dùng
const changePassword = async (userId, passwordData) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}/user/${userId}/change-password`,
      passwordData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi đổi mật khẩu",
    };
  }
};

export { getAllUsers, createUser, updateUser, deleteUser, changePassword };

import axios from "axios";

const BASE_URL = "http://localhost:8080"; // Thay bằng URL backend của bạn

// Lấy tất cả đơn hàng
const getAllOrders = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/order/getAll`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi lấy danh sách đơn hàng",
    };
  }
};

export { getAllOrders };

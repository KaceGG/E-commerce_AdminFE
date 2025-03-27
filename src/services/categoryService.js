import apiClient from "./apiClient";

export const getAllCategories = async () => {
  try {
    const response = await apiClient.get("/category/getAll");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Có lỗi khi lấy danh sách Category" }
    );
  }
};

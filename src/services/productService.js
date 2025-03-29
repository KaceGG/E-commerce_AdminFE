import axios from "axios";

const BASE_URL = "http://localhost:8080";

const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product/getAll`);
    return response.data;
  } catch (error) {
    return { code: 500, message: error.message };
  }
};

const addProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/product/create`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi thêm sản phẩm",
    };
  }
};

const updateProduct = async (productData, productId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/product/update/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi cập nhật sản phẩm",
    };
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/product/delete/${productId}`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      code: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Có lỗi khi xoá sản phẩm",
    };
  }
};

export { getAllProducts, addProduct, updateProduct, deleteProduct };

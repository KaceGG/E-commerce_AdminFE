import apiClient from "./apiClient";

const token = localStorage.getItem("token");
// const header = {
//   Authorization: `Bearer ${token}`,
// };

const getAllCategories = async () => {
  const response = await apiClient.get("/category/getAll");
  return response.data;
};

const addCategory = async (categoryData) => {
  const response = await apiClient.post("/category/create", categoryData);
  return response.data;
};

const updateCategory = async (categoryId, categoryData) => {
  const response = await apiClient.put(
    `/category/update/${categoryId}`,
    categoryData
  );
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(`category/delete/${categoryId}`);
  return response.data;
};

export { getAllCategories, addCategory, updateCategory, deleteCategory };

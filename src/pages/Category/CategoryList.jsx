import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../../stores/categoryStore";
import Swal from "sweetalert2";
import * as Mui from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add,
} from "@mui/icons-material";

const CategoryList = () => {
  const navigate = useNavigate();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories(navigate);
  }, [fetchCategories, navigate]);

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({ name: category.name, description: category.description });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      // Đóng Dialog trước khi hiển thị lỗi
      handleCloseDialog();
      Swal.fire({
        title: "Lỗi",
        text: "Tên danh mục không được để trống!",
        icon: "error",
      });
      return;
    }

    if (!formData.description.trim()) {
      // Đóng Dialog trước khi hiển thị lỗi
      handleCloseDialog();
      Swal.fire({
        title: "Lỗi",
        text: "Mô tả danh mục không được để trống!",
        icon: "error",
      });
      return;
    }

    let result;
    if (isEditMode) {
      result = await updateCategory(currentCategory.id, formData);
    } else {
      result = await addCategory(formData);
    }

    // Đóng Dialog trước khi hiển thị thông báo
    handleCloseDialog();

    if (result.success) {
      Swal.fire({
        title: "Thành công",
        text: isEditMode
          ? "Cập nhật danh mục thành công!"
          : "Thêm danh mục thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Lỗi",
        text: result.message,
        icon: "error",
      });
    }
  };

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn muốn xóa danh mục này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteCategory(categoryId);
      if (deleteResult.success) {
        Swal.fire({
          title: "Thành công",
          text: "Xóa danh mục thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Lỗi",
          text: deleteResult.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <Mui.Container maxWidth="lg">
      <Mui.Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddDialog}
        sx={{ mb: 2 }}
      >
        Thêm danh mục
        <Add />
      </Mui.Button>

      {loading && <Mui.CircularProgress />}
      {error && (
        <Mui.Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Mui.Alert>
      )}

      {!loading && !error && (
        <Mui.TableContainer component={Mui.Paper}>
          <Mui.Table sx={{ minWidth: 650 }} aria-label="category table">
            <Mui.TableHead>
              <Mui.TableRow>
                <Mui.TableCell>ID</Mui.TableCell>
                <Mui.TableCell>Tên danh mục</Mui.TableCell>
                <Mui.TableCell>Mô tả</Mui.TableCell>
                <Mui.TableCell align="right">Hành động</Mui.TableCell>
              </Mui.TableRow>
            </Mui.TableHead>
            <Mui.TableBody>
              {categories.length === 0 ? (
                <Mui.TableRow>
                  <Mui.TableCell colSpan={4} align="center">
                    Không có danh mục nào
                  </Mui.TableCell>
                </Mui.TableRow>
              ) : (
                categories.map((category) => (
                  <Mui.TableRow key={category.id}>
                    <Mui.TableCell>{category.id}</Mui.TableCell>
                    <Mui.TableCell>{category.name}</Mui.TableCell>
                    <Mui.TableCell>{category.description}</Mui.TableCell>
                    <Mui.TableCell align="right">
                      <Mui.IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(category)}
                      >
                        <EditIcon />
                      </Mui.IconButton>
                      <Mui.IconButton
                        color="error"
                        onClick={() => handleDelete(category.id)}
                      >
                        <DeleteIcon />
                      </Mui.IconButton>
                    </Mui.TableCell>
                  </Mui.TableRow>
                ))
              )}
            </Mui.TableBody>
          </Mui.Table>
        </Mui.TableContainer>
      )}

      <Mui.Dialog open={openDialog} onClose={handleCloseDialog}>
        <Mui.DialogTitle>
          {isEditMode ? "Sửa danh mục" : "Thêm danh mục"}
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên danh mục"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
          />
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Mui.Button>
          <Mui.Button onClick={handleSubmit} color="primary">
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>
    </Mui.Container>
  );
};

export default CategoryList;

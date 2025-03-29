import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProductStore from "../../stores/productStore";
import useCategoryStore from "../../stores/categoryStore";
import Swal from "sweetalert2";
import * as Mui from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const ProductList = () => {
  const navigate = useNavigate();
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
    categoryIds: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(""); // Thêm state để lưu trữ lỗi

  useEffect(() => {
    fetchCategories(navigate);
    fetchProducts(navigate);
  }, [fetchCategories, fetchProducts, navigate]);

  const getCategoryNames = (categoryIds) => {
    const categoryNames = categories
      .filter((category) => categoryIds.includes(category.id))
      .map((category) => category.name);
    return categoryNames.join(", ");
  };

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      image: null,
      categoryIds: [],
    });
    setImagePreview(null);
    setError(""); // Reset lỗi khi mở dialog
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
      categoryIds: product.categoryIds,
    });
    setImagePreview(product.imageUrl);
    setError(""); // Reset lỗi khi mở dialog
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      image: null,
      categoryIds: [],
    });
    setImagePreview(null);
    setError(""); // Reset lỗi khi đóng dialog
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else if (name === "categoryIds") {
      setFormData((prev) => ({ ...prev, categoryIds: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(""); // Reset lỗi khi người dùng chỉnh sửa
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError("Tên sản phẩm không được để trống!");
      return;
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      setError("Giá phải là một số lớn hơn 0!");
      return;
    }
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity) <= 0
    ) {
      setError("Số lượng phải là một số nguyên lớn hơn 0!");
      return;
    }
    if (!isEditMode && !formData.image) {
      setError("Vui lòng chọn hình ảnh!");
      return;
    }
    if (formData.categoryIds.length === 0) {
      setError("Vui lòng chọn ít nhất một danh mục!");
      return;
    }

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("quantity", formData.quantity);
    if (formData.image) {
      productData.append("image", formData.image);
    }
    formData.categoryIds.forEach((id) => productData.append("categoryIds", id));

    let result;
    if (isEditMode) {
      result = await updateProduct(currentProduct.id, productData, navigate);
    } else {
      result = await addProduct(productData, navigate);
    }

    handleCloseDialog();

    if (result.success) {
      Swal.fire({
        title: "Thành công",
        text: isEditMode
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm thành công!",
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

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteProduct(productId, navigate);
      if (deleteResult.success) {
        Swal.fire({
          title: "Thành công",
          text: "Xóa sản phẩm thành công!",
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
        THÊM SẢN PHẨM
        <AddIcon sx={{ ml: 1 }} />
      </Mui.Button>

      {loading && <Mui.CircularProgress />}

      {!loading && (
        <Mui.TableContainer component={Mui.Paper}>
          <Mui.Table sx={{ minWidth: 650 }} aria-label="product table">
            <Mui.TableHead>
              <Mui.TableRow>
                <Mui.TableCell>STT</Mui.TableCell>
                <Mui.TableCell>Tên sản phẩm</Mui.TableCell>
                <Mui.TableCell>Mô tả</Mui.TableCell>
                <Mui.TableCell>Giá</Mui.TableCell>
                <Mui.TableCell>Số lượng</Mui.TableCell>
                <Mui.TableCell>Hình ảnh</Mui.TableCell>
                <Mui.TableCell>Danh mục</Mui.TableCell>
                <Mui.TableCell align="right">Hành động</Mui.TableCell>
              </Mui.TableRow>
            </Mui.TableHead>
            <Mui.TableBody>
              {products.length === 0 ? (
                <Mui.TableRow>
                  <Mui.TableCell colSpan={8} align="center">
                    Không có sản phẩm nào
                  </Mui.TableCell>
                </Mui.TableRow>
              ) : (
                products.map((product, index) => (
                  <Mui.TableRow key={product.id}>
                    <Mui.TableCell>{index + 1}</Mui.TableCell>
                    <Mui.TableCell>{product.name}</Mui.TableCell>
                    <Mui.TableCell>{product.description}</Mui.TableCell>
                    <Mui.TableCell>
                      {Number(product.price).toLocaleString("vi-VN")} VND
                    </Mui.TableCell>
                    <Mui.TableCell>{product.quantity}</Mui.TableCell>
                    <Mui.TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: 100, height: 60, objectFit: "contain" }}
                      />
                    </Mui.TableCell>
                    <Mui.TableCell>
                      {getCategoryNames(product.categoryIds)}
                    </Mui.TableCell>
                    <Mui.TableCell align="right">
                      <Mui.IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(product)}
                      >
                        <EditIcon />
                      </Mui.IconButton>
                      <Mui.IconButton
                        color="error"
                        onClick={() => handleDelete(product.id)}
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
          {isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        </Mui.DialogTitle>
        <Mui.DialogContent>
          {error && (
            <Mui.Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Mui.Alert>
          )}
          <Mui.TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên sản phẩm"
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
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="price"
            label="Giá"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="quantity"
            label="Số lượng"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.quantity}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="image"
            label="Hình ảnh"
            type="file"
            fullWidth
            variant="outlined"
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          {imagePreview && (
            <Mui.Box sx={{ mt: 2, mb: 2 }}>
              <Mui.Typography>Preview:</Mui.Typography>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: 128, height: 128, objectFit: "cover" }}
              />
            </Mui.Box>
          )}
          <Mui.FormControl fullWidth margin="dense">
            <Mui.InputLabel>Danh mục</Mui.InputLabel>
            <Mui.Select
              name="categoryIds"
              multiple
              value={formData.categoryIds}
              onChange={handleInputChange}
              renderValue={(selected) =>
                categories
                  .filter((category) => selected.includes(category.id))
                  .map((category) => category.name)
                  .join(", ")
              }
            >
              {categories.map((category) => (
                <Mui.MenuItem key={category.id} value={category.id}>
                  <Mui.Checkbox
                    checked={formData.categoryIds.includes(category.id)}
                  />
                  <Mui.ListItemText primary={category.name} />
                </Mui.MenuItem>
              ))}
            </Mui.Select>
          </Mui.FormControl>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={handleCloseDialog} color="inherit">
            HỦY
          </Mui.Button>
          <Mui.Button onClick={handleSubmit} color="primary">
            {isEditMode ? "CẬP NHẬT" : "THÊM"}
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>
    </Mui.Container>
  );
};

export default ProductList;

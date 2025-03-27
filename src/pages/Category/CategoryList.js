import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/categoryService";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetch categories");

      try {
        const response = await getAllCategories();
        if (response.code === 200) {
          setCategories(response.result || []);
          setError(""); // Đặt error về rỗng nếu thành công
        } else {
          setCategories([]); // Đặt categories về rỗng nếu thất bại
          setError("Không thể lấy danh sách danh mục");
        }
      } catch (err) {
        setCategories([]); // Đặt categories về rỗng nếu có lỗi
        setError(err.message || "Có lỗi khi lấy danh sách danh mục");
        if (err.code === 401 || err.code === 403) {
          if (window.location.pathname !== "/") {
            navigate("/");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Dependency rỗng, chỉ chạy một lần khi mount

  console.log("CategoryList component rendered");

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Danh sách danh mục
      </Typography>

      {loading && <CircularProgress />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Mô tả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Không có danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CategoryList;

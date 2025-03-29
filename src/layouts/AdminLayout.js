import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import * as Mui from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { logout } from "../services/authService";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleLogout = async () => {
    // Hiển thị hộp thoại xác nhận bằng SweetAlert2
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      text: "Bạn sẽ được chuyển hướng về trang đăng nhập.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng nhấn "Xác nhận"
    if (result.isConfirmed) {
      try {
        await logout();
        localStorage.removeItem("token"); // Xóa token khi đăng xuất
        navigate("/");
        // Hiển thị thông báo đăng xuất thành công
        Swal.fire({
          title: "Đăng xuất thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        setError(err.message || "Đăng xuất thất bại");
        // Hiển thị thông báo lỗi nếu đăng xuất thất bại
        Swal.fire({
          title: "Đăng xuất thất bại",
          text: err.message || "Có lỗi xảy ra, vui lòng thử lại.",
          icon: "error",
        });
      }
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Người dùng", icon: <PeopleIcon />, path: "/users" },
    { text: "Danh mục", icon: <CategoryIcon />, path: "/categories" },
    { text: "Sản phẩm", icon: <CategoryIcon />, path: "/products" },
    { text: "Đơn hàng", icon: <ShoppingCartIcon />, path: "/orders" },
    { text: "Đăng xuất", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  return (
    <Mui.Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Mui.Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Mui.Toolbar />
        <Mui.List>
          {menuItems.map((item, index) => (
            <Mui.ListItemButton
              key={index}
              onClick={() =>
                item.onClick ? item.onClick() : navigate(item.path)
              }
              sx={{
                backgroundColor:
                  item.path === window.location.pathname
                    ? "#e0e0e0"
                    : "inherit",
              }}
            >
              <Mui.ListItemIcon>{item.icon}</Mui.ListItemIcon>
              <Mui.ListItemText primary={item.text} />
            </Mui.ListItemButton>
          ))}
        </Mui.List>
      </Mui.Drawer>

      {/* Main content */}
      <Mui.Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Mui.AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#1976d2",
          }}
        >
          <Mui.Toolbar>
            <Mui.Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Trang Quản trị
            </Mui.Typography>
            <Mui.Button
              color="inherit"
              onClick={handleLogout}
              endIcon={<LogoutIcon />}
            >
              Xin chào, Admin
            </Mui.Button>
          </Mui.Toolbar>
        </Mui.AppBar>
        <Mui.Toolbar />
        <Outlet />
      </Mui.Box>
    </Mui.Box>
  );
};

export default AdminLayout;

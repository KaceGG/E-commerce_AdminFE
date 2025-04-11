import React, { useEffect } from "react";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import useOrderStore from "../../stores/orderStore";
import { BarChart } from "@mui/x-charts/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={4}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      height: 140,
      borderRadius: 3,
      backgroundColor: "#fff",
    }}
  >
    <Box
      sx={{
        mr: 3,
        bgcolor: color,
        p: 1.5,
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="textSecondary" fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const AdminPage = () => {
  const navigate = useNavigate();
  const {
    users,
    fetchUsers,
    loading: userLoading,
    error: userError,
  } = useUserStore();
  const {
    orders,
    fetchOrders,
    loading: orderLoading,
    error: orderError,
  } = useOrderStore();

  useEffect(() => {
    fetchUsers(navigate);
    fetchOrders(navigate);
  }, [fetchUsers, fetchOrders, navigate]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const formatNumber = (number) =>
    new Intl.NumberFormat("vi-VN").format(number);

  const monthlyRevenue = () => {
    const revenueByMonth = Array(12).fill(0);
    orders.forEach((order) => {
      const month = new Date(order.orderDate).getMonth();
      revenueByMonth[month] += order.totalAmount;
    });
    return revenueByMonth;
  };

  const revenueData = monthlyRevenue();
  const months = [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ];

  if (userLoading || orderLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (userError || orderError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{userError || orderError}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📊 Bảng điều khiển quản trị
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Người dùng"
            value={users.length}
            icon={<PersonIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Đơn hàng"
            value={orders.length}
            icon={<ShoppingCartIcon fontSize="large" />}
            color="#d32f2f"
          />
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <StatCard
            title="Tổng doanh thu"
            value={`${formatNumber(totalRevenue)} VNĐ`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#388e3c"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Biểu đồ doanh thu theo tháng
            </Typography>
            <BarChart
              xAxis={[{ scaleType: "band", data: months }]}
              series={[
                {
                  data: revenueData,
                  label: "Doanh thu (VNĐ)",
                  color: "#4caf50",
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;

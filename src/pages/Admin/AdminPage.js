import React from "react";
import { Typography, Container, Grid, Paper } from "@mui/material";

const AdminPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 120 }}
          >
            <Typography variant="h6">Số lượng người dùng</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              150
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 120 }}
          >
            <Typography variant="h6">Số lượng sản phẩm</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              300
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 120 }}
          >
            <Typography variant="h6">Số lượng đơn hàng</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              50
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;

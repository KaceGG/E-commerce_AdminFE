import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ProductList from "./pages/Product/ProductList";
import CategoryList from "./pages/Category/CategoryList";
import LoginPage from "./pages/Auth/LoginPage";
import AdminPage from "./pages/Admin/AdminPage";
import ConfirmPayment from "./pages/Payment/ConfirmPayment";
import UserListPage from "./pages/User/UserListPage";
import OrderListPage from "./pages/Order/OrderListPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrderListPage />} />
        </Route>

        <Route path="/payment/confirm" element={<ConfirmPayment />} />
      </Routes>
    </Router>
  );
};

export default App;

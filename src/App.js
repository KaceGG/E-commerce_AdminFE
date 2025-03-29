import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ProductList from "./pages/Product/ProductList";
import CategoryList from "./pages/Category/CategoryList";
import LoginPage from "./pages/Auth/LoginPage";
import AdminPage from "./pages/Admin/AdminPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/products" element={<ProductList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

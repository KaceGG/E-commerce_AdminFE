import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import AdminPage from "./pages/Admin/AdminPage";
import CategoryList from "./pages/Category/CategoryList";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/categories" element={<CategoryList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

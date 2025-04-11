import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { login } from "../../services/authService";
import LoginForm from "../../components/Auth/LoginForm";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
        const roles = decodedToken.roles || [];

        // Kiểm tra token chưa hết hạn và có role ADMIN
        if (decodedToken.exp > currentTime && roles.includes("ADMIN")) {
          navigate("/dashboard");
        } else {
          console.log("Token đã hết hạn hoặc không có quyền ADMIN");
          sessionStorage.removeItem("token");
        }
      } catch (error) {
        console.log("Token không hợp lệ: ", error);
        sessionStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.code === 200 && response.result?.token) {
        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        const token = response.result.token;
        sessionStorage.setItem("token", token); // Lưu token vào sessionStorage
        console.log("Token đã được lưu vào sessionStorage:", token);

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
        const roles = decodedToken.roles || [];

        // Kiểm tra token chưa hết hạn và có role ADMIN trước khi chuyển hướng
        if (decodedToken.exp > currentTime && roles.includes("ADMIN")) {
          navigate("/dashboard");
        } else {
          setError("Token đã hết hạn hoặc bạn không có quyền ADMIN");
          sessionStorage.removeItem("token");
        }
      } else {
        setError("Không có token được trả về từ server");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <LoginForm
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      error={error}
      onSubmit={handleLogin}
    />
  );
};

export default LoginPage;

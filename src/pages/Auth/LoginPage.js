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
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken.roles || [];

        if (roles.includes("ADMIN")) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("Token không hợp lệ: ", error);
        localStorage.removeItem("token");
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
        localStorage.setItem("token", token);
        console.log("Token đã được lưu:", token);

        const decodedToken = jwtDecode(token);
        const roles = decodedToken.roles || [];
        if (roles.includes("ADMIN")) {
          navigate("/dashboard");
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Để điều hướng
import { login } from "../../services/apiService";
import "./login.css"; // File CSS cho giao diện

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.code === 200 && response.result?.token) {
        localStorage.setItem("token", response.result.token);
        console.log("Token đã được lưu: ", response.result.token);
        navigate("/admin");
      } else {
        setError("Không có token được trả về từ server");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

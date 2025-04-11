import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore"; // Import userStore
import Swal from "sweetalert2";
import * as Mui from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

const UserListPage = () => {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    changeUserPassword,
  } = useUserStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    birthday: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers(navigate);
  }, [fetchUsers, navigate]);

  const handleOpenAddDialog = () => {
    setIsEditMode(false);
    setFormData({
      username: "",
      fullName: "",
      birthday: "",
      email: "",
      phone: "",
      address: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName || "",
      birthday: user.birthday || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setOpenDialog(true);
  };

  const handleOpenPasswordDialog = (user) => {
    setCurrentUser(user);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setOpenPasswordDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenPasswordDialog(false);
    setCurrentUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      handleCloseDialog();
      Swal.fire({
        title: "Lỗi",
        text: "Tên người dùng không được để trống!",
        icon: "error",
      });
      return;
    }

    let result;
    if (isEditMode) {
      result = await updateUser(currentUser.id, formData, navigate);
    } else {
      result = await addUser(formData, navigate);
    }

    handleCloseDialog();

    if (result.success) {
      Swal.fire({
        title: "Thành công",
        text: isEditMode
          ? "Cập nhật người dùng thành công!"
          : "Thêm người dùng thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Lỗi",
        text: result.message,
        icon: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.oldPassword.trim() ||
      !passwordData.newPassword.trim() ||
      !passwordData.confirmPassword.trim()
    ) {
      handleCloseDialog();
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng nhập đầy đủ thông tin mật khẩu!",
        icon: "error",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      handleCloseDialog();
      Swal.fire({
        title: "Lỗi",
        text: "Mật khẩu mới và xác nhận không khớp!",
        icon: "error",
      });
      return;
    }

    const result = await changeUserPassword(
      currentUser.id,
      passwordData,
      navigate
    );

    handleCloseDialog();

    if (result.success) {
      Swal.fire({
        title: "Thành công",
        text: "Đổi mật khẩu thành công!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Lỗi",
        text: result.message,
        icon: "error",
      });
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn muốn xóa người dùng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteUser(userId, navigate);
      if (deleteResult.success) {
        Swal.fire({
          title: "Thành công",
          text: "Xóa người dùng thành công!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Lỗi",
          text: deleteResult.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <Mui.Container maxWidth="lg">
      <Mui.Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddDialog}
        sx={{ mb: 2 }}
      >
        Thêm người dùng
        <AddIcon />
      </Mui.Button>

      {loading && <Mui.CircularProgress />}
      {error && (
        <Mui.Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Mui.Alert>
      )}

      {!loading && !error && (
        <Mui.TableContainer component={Mui.Paper}>
          <Mui.Table sx={{ minWidth: 650 }} aria-label="user table">
            <Mui.TableHead>
              <Mui.TableRow>
                <Mui.TableCell>ID</Mui.TableCell>
                <Mui.TableCell>Username</Mui.TableCell>
                <Mui.TableCell>Full Name</Mui.TableCell>
                <Mui.TableCell>Birthday</Mui.TableCell>
                <Mui.TableCell>Email</Mui.TableCell>
                <Mui.TableCell>Phone</Mui.TableCell>
                <Mui.TableCell>Address</Mui.TableCell>
                <Mui.TableCell align="right">Hành động</Mui.TableCell>
              </Mui.TableRow>
            </Mui.TableHead>
            <Mui.TableBody>
              {users.length === 0 ? (
                <Mui.TableRow>
                  <Mui.TableCell colSpan={8} align="center">
                    Không có người dùng nào
                  </Mui.TableCell>
                </Mui.TableRow>
              ) : (
                users.map((user) => (
                  <Mui.TableRow key={user.id}>
                    <Mui.TableCell>{user.id}</Mui.TableCell>
                    <Mui.TableCell>{user.username}</Mui.TableCell>
                    <Mui.TableCell>{user.fullName || "N/A"}</Mui.TableCell>
                    <Mui.TableCell>{user.birthday || "N/A"}</Mui.TableCell>
                    <Mui.TableCell>{user.email || "N/A"}</Mui.TableCell>
                    <Mui.TableCell>{user.phone || "N/A"}</Mui.TableCell>
                    <Mui.TableCell>{user.address || "N/A"}</Mui.TableCell>
                    <Mui.TableCell align="right">
                      <Mui.IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                      >
                        <EditIcon />
                      </Mui.IconButton>
                      <Mui.IconButton
                        color="secondary"
                        onClick={() => handleOpenPasswordDialog(user)}
                      >
                        <LockIcon />
                      </Mui.IconButton>
                      <Mui.IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </Mui.IconButton>
                    </Mui.TableCell>
                  </Mui.TableRow>
                ))
              )}
            </Mui.TableBody>
          </Mui.Table>
        </Mui.TableContainer>
      )}

      {/* Dialog chỉnh sửa/thêm người dùng */}
      <Mui.Dialog open={openDialog} onClose={handleCloseDialog}>
        <Mui.DialogTitle>
          {isEditMode ? "Sửa người dùng" : "Thêm người dùng"}
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.TextField
            autoFocus
            margin="dense"
            name="username"
            label="Tên người dùng"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isEditMode} // Không cho sửa username khi edit
          />
          <Mui.TextField
            margin="dense"
            name="fullName"
            label="Họ và tên"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="birthday"
            label="Ngày sinh"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.birthday}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <Mui.TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="phone"
            label="Số điện thoại"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Mui.TextField
            margin="dense"
            name="address"
            label="Địa chỉ"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={handleInputChange}
          />
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Mui.Button>
          <Mui.Button onClick={handleSubmit} color="primary">
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>

      {/* Dialog đổi mật khẩu */}
      <Mui.Dialog open={openPasswordDialog} onClose={handleCloseDialog}>
        <Mui.DialogTitle>Đổi mật khẩu</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.TextField
            autoFocus
            margin="dense"
            name="oldPassword"
            label="Mật khẩu cũ"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />
          <Mui.TextField
            margin="dense"
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <Mui.TextField
            margin="dense"
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Mui.Button>
          <Mui.Button onClick={handleChangePassword} color="primary">
            Đổi mật khẩu
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>
    </Mui.Container>
  );
};

export default UserListPage;

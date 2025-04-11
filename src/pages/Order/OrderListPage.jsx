import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../stores/orderStore";
import * as Mui from "@mui/material";

const OrderListPage = () => {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(navigate);
  }, [fetchOrders, navigate]);

  // Hàm định dạng ngày theo kiểu Việt Nam: ngày/tháng/năm
  const formatDateVN = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Mui.Container maxWidth="lg">
      <Mui.Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Danh sách đơn hàng
      </Mui.Typography>

      {loading && <Mui.CircularProgress />}
      {error && (
        <Mui.Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Mui.Alert>
      )}

      {!loading && !error && (
        <Mui.TableContainer component={Mui.Paper}>
          <Mui.Table sx={{ minWidth: 650 }} aria-label="order table">
            <Mui.TableHead>
              <Mui.TableRow>
                <Mui.TableCell>STT</Mui.TableCell> {/* Thay ID bằng STT */}
                <Mui.TableCell>Ngày đặt hàng</Mui.TableCell>
                <Mui.TableCell>Tổng giá tiền</Mui.TableCell>
                <Mui.TableCell>Địa chỉ giao hàng</Mui.TableCell>
                <Mui.TableCell>ID người đặt</Mui.TableCell>
                <Mui.TableCell>Sản phẩm</Mui.TableCell>
                <Mui.TableCell>Phương thức thanh toán</Mui.TableCell>
                <Mui.TableCell>Trạng thái thanh toán</Mui.TableCell>
                <Mui.TableCell>Thời gian thanh toán</Mui.TableCell>
              </Mui.TableRow>
            </Mui.TableHead>
            <Mui.TableBody>
              {orders.length === 0 ? (
                <Mui.TableRow>
                  <Mui.TableCell colSpan={9} align="center">
                    Không có đơn hàng nào
                  </Mui.TableCell>
                </Mui.TableRow>
              ) : (
                orders.map((order, index) => (
                  <Mui.TableRow key={order.id}>
                    <Mui.TableCell>{index + 1}</Mui.TableCell>{" "}
                    {/* Hiển thị STT */}
                    <Mui.TableCell>
                      {formatDateVN(order.orderDate)}
                    </Mui.TableCell>
                    <Mui.TableCell>
                      {order.totalAmount.toLocaleString()} VNĐ
                    </Mui.TableCell>
                    <Mui.TableCell>{order.shippingAddress}</Mui.TableCell>
                    <Mui.TableCell>{order.userId}</Mui.TableCell>
                    <Mui.TableCell>
                      {order.items.map((item) => (
                        <Mui.Typography key={item.id}>
                          {item.productName} - {item.price.toLocaleString()} VNĐ
                          x {item.quantity}
                        </Mui.Typography>
                      ))}
                    </Mui.TableCell>
                    <Mui.TableCell>{order.payment.paymentMethod}</Mui.TableCell>
                    <Mui.TableCell>{order.payment.status}</Mui.TableCell>
                    <Mui.TableCell>
                      {formatDateVN(order.payment.paymentDate)}
                    </Mui.TableCell>
                  </Mui.TableRow>
                ))
              )}
            </Mui.TableBody>
          </Mui.Table>
        </Mui.TableContainer>
      )}
    </Mui.Container>
  );
};

export default OrderListPage;

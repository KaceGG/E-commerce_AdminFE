import React from "react";

function ConfirmPayment() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
      <div className="container max-w-5xl flex flex-col md:flex-row items-center justify-between text-gray-700">
        {/* Phần nội dung bên trái */}
        <div className="w-full md:w-1/2 mx-4 md:mx-8 text-center md:text-left">
          <div className="text-5xl md:text-7xl text-green-500 font-extrabold mb-4 animate-bounce">
            <svg
              className="w-16 h-16 md:w-24 md:h-24 mx-auto md:mx-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Thanh toán thành công
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-8">
            Cảm ơn bạn đã mua sắm! Đơn hàng của bạn đã được xử lý thành công.
          </p>
          <button
            onClick={() => (window.location.href = "/")} // Điều hướng về trang chủ
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        {/* Phần hình ảnh bên phải */}
        <div className="w-full md:w-1/2 mx-4 md:mx-5 my-8 md:my-12 flex justify-center md:justify-end">
          <img
            src="https://i.pinimg.com/564x/e6/8c/24/e68c24a887072e6acd15ed9ce57e0bf0.jpg"
            className="w-3/4 md:w-full max-w-sm rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
            alt="Payment Success Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default ConfirmPayment;

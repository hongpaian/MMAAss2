# Ứng dụng đặt đồ ăn (React Native + Express + MongoDB)

| Thành phần | Công nghệ |
|---|---|
| Mobile app | React Native (Expo), React Navigation |
| Backend | Node.js (Express), RESTful API, JWT |
| Database | MongoDB (Mongoose) |
| Web admin | HTML thuần, chạy tại `/admin` của backend |

## 1. Chạy backend

Cần cài sẵn Node.js và MongoDB (hoặc dùng MongoDB Atlas, dán chuỗi kết nối vào `MONGO_URI`).

```bash
cd backend
npm install
cp .env.example .env      # sửa MONGO_URI / JWT_SECRET nếu cần
npm run seed              # tạo dữ liệu mẫu
npm start                 # http://localhost:5000
```

Tài khoản mẫu:
- Admin: `admin@gmail.com` / `admin123`
- Khách: `user@gmail.com` / `123456`

Web admin: mở <http://localhost:5000/admin> và đăng nhập bằng tài khoản admin.

## 2. Chạy app mobile

Dùng bản Expo mới nhất để khớp với Expo Go trên điện thoại:

```bash
npx create-expo-app@latest mobile --template blank
cd mobile
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npm install axios
```

Sau đó **chép đè** `App.js` và thư mục `src/` từ project này vào thư mục `mobile` vừa tạo.

Mở `src/config.js` và đổi `API_URL` thành IP LAN của máy chạy backend (điện thoại và máy tính cùng WiFi):

```js
export const API_URL = 'http://192.168.1.10:5000/api';
```

Rồi chạy `npx expo start` và quét QR bằng Expo Go.

## 3. Đối chiếu tiêu chí chấm điểm

| Mức | Nội dung | Đã có |
|---|---|---|
| 3 điểm | App chạy luồng cơ bản | Đăng nhập, xem món, giỏ hàng, đặt đơn |
| 4 điểm | Backend + database | Express + MongoDB, dữ liệu lấy từ server, không hard-code |
| 5 điểm | API đủ + web admin CRUD + thanh toán mô phỏng | Xem bảng API bên dưới, trang `/admin`, màn Payment (VNPay/MoMo mô phỏng) |

## 4. Danh sách API

| Method | Đường dẫn | Quyền | Mô tả |
|---|---|---|---|
| POST | /api/auth/register | công khai | Đăng ký |
| POST | /api/auth/login | công khai | Đăng nhập, trả về token |
| GET | /api/auth/me | đăng nhập | Thông tin người dùng |
| GET | /api/products?search=&category= | công khai | Danh sách + tìm kiếm + lọc |
| GET | /api/products/categories | công khai | Danh mục |
| GET | /api/products/:id | công khai | Chi tiết món |
| POST / PUT / DELETE | /api/products(/:id) | admin | Thêm / sửa / xóa món |
| POST | /api/orders | đăng nhập | Tạo đơn (giá tính ở server) |
| GET | /api/orders/my | đăng nhập | Đơn của tôi |
| GET | /api/orders/:id | chủ đơn / admin | Chi tiết đơn |
| PUT | /api/orders/:id/cancel | chủ đơn | Hủy đơn khi còn "chờ xác nhận" |
| GET | /api/orders | admin | Tất cả đơn |
| PUT | /api/orders/:id/status | admin | Đổi trạng thái đơn |
| DELETE | /api/orders/:id | admin | Xóa đơn |
| POST | /api/payment/simulate | đăng nhập | Thanh toán mô phỏng VNPay/MoMo |
| GET | /api/admin/stats | admin | Thống kê doanh thu, số đơn |

## 5. Các màn hình (gợi ý chia việc cho nhóm)

1. `LoginScreen`, `RegisterScreen`, `ProfileScreen` (tài khoản)
2. `HomeScreen`, `ProductDetailScreen` (thực đơn, tìm kiếm, chi tiết)
3. `CartScreen`, `CheckoutScreen` (giỏ hàng, đặt đơn)
4. `PaymentScreen` (thanh toán mô phỏng)
5. `OrdersScreen`, `OrderDetailScreen` (lịch sử và chi tiết đơn)

Mỗi thành viên nên tự commit phần của mình lên GitHub để đủ điều kiện chấm.

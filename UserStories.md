# BookStore

## User Stories For BookStore

1. Authentication: User có thể đăng ký / đăng nhập / đăng xuất / quên mật khẩu, email
2. Shopping Cart: User có thể thêm / xóa và quản lý số lượng trong giỏ hàng
3. Checkout: User có thể tùy chọn phương thức thanh toán
4. Information: User có thể quản lý về mình
5. Dark Mode: giao diện tối cho ứng dụng

## Features

#### Authentication:

- Một trang đăng ký với route /signup

- Một trang đăng nhập với route /signin bằng email và password

- Một trang quên mật khẩu hoặc email với route /forgot
- Xác thực thông tin tài khoản bằng email

### Tìm kiếm, Filter, Pagination

- User có thể lọc sản phẩm, số lượng hiển thị, trạng thái, đa thể loại

### Shopping cart:

- Một dropdown khi user click vào icon giỏ hàng
- Một trang riêng với route /cart

### Order

- Một trang thanh toán chung với route /cart với các steps
- Sẽ xuất hiện Form điền thông tin về nơi giao dịch và hiển thị tùy chọn phương thức thanh toán

### Information

- Một trang profile của user với route /user/profile - hiển thị các thông tin chung
- Một trang về bảo mật với route /user/security - bảo mật tài khoản email, password
- Một trang về sản phẩm yêu thích /user/wishlist - chứa các sản phẩm mà user thích
- Một trang về lịch sử giao dịch
- Một trang về danh sách địa chỉ giao dịch, tiện cho user thay vì gõ tay

### Dark Mode

- Một icon ở giao diện ứng dụng bật tắt chế độ sáng/tối

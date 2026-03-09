# REQ_ID Auto-Set Implementation

## Mô tả

Hệ thống đã được cập nhật để **tự động set REQ_ID từ thông tin user đăng nhập** thay vì phải gửi từ client.

## Cách thức hoạt động

### 1. Cấu trúc JWT Token
Khi user đăng nhập thành công, JWT token sẽ chứa:
- `id`: User ID
- `userCode`: Mã user  
- `username`: Tên đăng nhập
- `role`: Vai trò user

### 2. Middleware Authentication
- `authMiddleware` sẽ decode JWT token và lưu thông tin user vào `req.user`
- Tất cả các endpoint create/update đã được thêm `authMiddleware`

### 3. Controllers tự động set fields

#### Comm Controller (REQ_ID)
```javascript
// Lấy thông tin user từ JWT token
const user = (req as any).user;
const commData = {
  ...req.body,
  REQ_ID: user?.username || null // Set REQ_ID từ USERNAME của user đăng nhập
};
```

#### Product Controller (REQ_ID + USER_LOGIN)
```javascript
const productData = {
  ...req.body,
  REQ_ID: user?.username || null, // Set REQ_ID từ USERNAME
  USER_LOGIN: user?.username || null // Set USER_LOGIN từ USERNAME
};
```

#### Store Controller (CREATED_BY)
```javascript
const storeData = {
  ...req.body,
  CREATED_BY: user?.username || null // Set CREATED_BY từ USERNAME
};
```

#### UserStore Controller (CREATED_BY)
```javascript
const userStoreData = {
  ...req.body,
  CREATED_BY: user?.username || null // Set CREATED_BY từ USERNAME
};
```

## Các endpoint được cập nhật

### Thêm authMiddleware
- `POST /api/comms` - Tạo đơn vị mới
- `PUT /api/comms/:id` - Cập nhật đơn vị
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `POST /api/stores` - Tạo cửa hàng mới
- `PUT /api/stores/:id` - Cập nhật cửa hàng
- `POST /api/user-stores` - Gán user vào store

### Mapping fields tự động
| Entity | Field | Giá trị |
|--------|-------|---------|
| Comm | REQ_ID | `user.username` |
| Product | REQ_ID | `user.username` |
| Product | USER_LOGIN | `user.username` |
| Store | CREATED_BY | `user.username` |
| UserStore | CREATED_BY | `user.username` |

## Postman Collections được cập nhật

### Thay đổi
1. **Loại bỏ các field tự động** khỏi request body:
   - REQ_ID (trong Comm, Product)
   - USER_LOGIN (trong Product) 
   - CREATED_BY (trong Store, UserStore)

2. **Thêm Authorization header** cho tất cả endpoint create/update:
   ```json
   {
     "key": "Authorization",
     "value": "Bearer {{token}}"
   }
   ```

### Collections đã cập nhật
- `comm.postman_collection.json`
- `product.postman_collection.json`
- `store.postman_collection.json`
- `user-store.postman_collection.json`

### Demo Collection mới
- `REQ_ID-demo.postman_collection.json` - Collection demo với test cases để verify REQ_ID được set tự động đúng

## Test với Postman

### Bước 1: Login
```json
POST /api/auth/login
{
  "login": "admin",
  "password": "123456"
}
```

### Bước 2: Sử dụng token để tạo entity
```json
POST /api/comms
Headers: Authorization: Bearer <token>
{
  "UN_CD": "TEST",
  "UN_NM": "Test Unit",
  "UN_TP": "UNIT",
  "IS_ACTIVE": true,
  "DESCRIPTION": "Test description"
}
```

### Bước 3: Verify response
Response sẽ có REQ_ID được set tự động:
```json
{
  "success": true,
  "message": "Tạo đơn vị thành công",
  "data": {
    "ID": 1,
    "UN_CD": "TEST",
    "UN_NM": "Test Unit",
    "UN_TP": "UNIT",
    "IS_ACTIVE": true,
    "DESCRIPTION": "Test description",
    "REQ_ID": "admin",  // ← Được set tự động từ username
    "REQ_DT": "2026-03-09T10:00:00.000Z"
  }
}
```

## Lưu ý quan trọng

1. **Bắt buộc Authentication**: Tất cả endpoint create/update giờ đây yêu cầu JWT token hợp lệ
2. **Không gửi field tự động**: Client KHÔNG nên gửi REQ_ID, USER_LOGIN, CREATED_BY trong request body
3. **Giá trị được override**: Nếu client có gửi các field này, chúng sẽ bị override bởi thông tin từ JWT token
4. **Fallback safety**: Nếu không có thông tin user, các field sẽ được set = `null`

## Benefits

1. **Bảo mật**: REQ_ID không thể bị giả mạo từ client
2. **Consistency**: Đảm bảo REQ_ID luôn chính xác theo user đăng nhập
3. **Audit Trail**: Rõ ràng ai đã tạo/cập nhật record
4. **Simplicity**: Client không cần quan tâm đến việc set REQ_ID
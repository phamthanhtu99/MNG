# Global Token Management System

## Mô tả

Hệ thống **Global Token Management** cho phép sử dụng một token chung cho tất cả các Postman collections thay vì phải quản lý token riêng biệt cho từng collection.

## Cách thức hoạt động

### 1. Global Auth Collection
File: `global-auth.postman_collection.json`

Collection này chuyên dụng để quản lý authentication global:

#### Requests:
- **Set Global Token**: Login và set token global
- **Clear Global Token**: Xóa token global
- **Verify Global Token**: Kiểm tra token có hợp lệ không

#### Variables:
- `globalUsername`: Username để login (default: "admin")  
- `globalPassword`: Password để login (default: "123456")
- `baseUrl`: API base URL

### 2. Global Token Variable
Tất cả collections đã được cập nhật để sử dụng `{{globalToken}}` thay vì `{{token}}` local.

#### Collections đã cập nhật:
- `comm.postman_collection.json`
- `product.postman_collection.json` 
- `store.postman_collection.json`
- `user-store.postman_collection.json`
- `auth.postman_collection.json`

## Cách sử dụng

### Bước 1: Import tất cả collections
Import tất cả các collection files vào Postman

### Bước 2: Set global token
1. Mở `Global Auth Management` collection
2. Chạy request **"Set Global Token"**
3. Token sẽ được set tự động vào global variable `globalToken`

### Bước 3: Sử dụng các APIs
Bây giờ tất cả requests trong các collections khác sẽ tự động sử dụng `{{globalToken}}`

### Bước 4: Verify token (tùy chọn)
Chạy **"Verify Global Token"** để kiểm tra token có hoạt động không

### Bước 5: Clear token khi cần
Chạy **"Clear Global Token"** để xóa token global

## Lợi ích

### 1. Centralized Management
- Chỉ cần login 1 lần cho tất cả collections
- Token được quản lý tập trung

### 2. Consistency
- Tất cả requests đều sử dụng cùng 1 token
- Không có vấn đề token không đồng bộ

### 3. Convenience  
- Không cần copy/paste token giữa collections
- Tự động set/clear token với scripts

### 4. Test Automation
- Scripts tự động verify token được set thành công
- Console logs rõ ràng về trạng thái token

## Token Lifecycle

```
1. Login → Set Global Token
2. Use APIs → All collections use globalToken
3. Token expires → Re-run "Set Global Token"
4. Cleanup → Run "Clear Global Token"
```

## Variables Structure

### Global Variables (set by scripts):
- `globalToken`: JWT token được set tự động

### Collection Variables (configurable):
- `baseUrl`: API endpoint
- `globalUsername`: Username cho login
- `globalPassword`: Password cho login  
- `token`: Local token (kept for backward compatibility)

## Authorization Headers

Tất cả authenticated requests sử dụng:
```json
{
  "key": "Authorization",
  "value": "Bearer {{globalToken}}"
}
```

## Scripts Examples

### Set Global Token Script:
```javascript
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    if (responseJson.success && responseJson.data && responseJson.data.token) {
        // Set global variable
        pm.globals.set('globalToken', responseJson.data.token);
        console.log('✅ Global Token đã được set:', responseJson.data.token);
    }
}
```

### Clear Global Token Script:
```javascript
pm.globals.unset('globalToken');
console.log('✅ Global token đã được xóa');
```

### Verify Token Script:
```javascript
if (pm.response.code === 200) {
    console.log('✅ Global token hoạt động tốt');
} else {
    console.log('❌ Global token không hợp lệ hoặc đã hết hạn');
}
```

## Troubleshooting

### Token không hoạt động:
1. Check global variable: `pm.globals.get('globalToken')`
2. Re-run "Set Global Token" 
3. Verify với "Verify Global Token"

### Token hết hạn:
1. Run "Set Global Token" để refresh
2. Token mới sẽ override token cũ

### Collections không tìm thấy globalToken:
1. Ensure all collections đã được import
2. Check variable name: `{{globalToken}}` (case sensitive)
3. Restart Postman nếu cần

## Migration từ local token

Các collections vẫn giữ `{{token}}` variable để backward compatibility, nhưng tất cả Authorization headers đã chuyển sang `{{globalToken}}`.

Để revert về local token system, chỉ cần thay `{{globalToken}}` thành `{{token}}` trong các Authorization headers.
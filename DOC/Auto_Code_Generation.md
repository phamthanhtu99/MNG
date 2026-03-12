# Tính Năng Tự Động Tạo Mã (Auto Code Generation)

## Tổng Quan

Hệ thống đã được cập nhật để tự động tạo mã cho các trường có đuôi `_CD` khi tạo data mới. Điều này giúp:
- Đảm bảo tính duy nhất của mã
- Tự động tăng tuần tự
- Giảm lỗi do người dùng nhập sai
- Chuẩn hóa format mã

## Các Trường Được Tự Động Tạo Mã

| Entity | Trường | Format | Ví dụ |
|--------|--------|---------|--------|
| Product | `PD_CD` | PD + 4 số | PD0001, PD0002, PD0003 |
| Store | `STORE_CD` | ST + 4 số | ST0001, ST0002, ST0003 |
| Import | `IMPORT_CD` | IM + 4 số | IM0001, IM0002, IM0003 |
| Export | `EXPORT_CD` | EX + 4 số | EX0001, EX0002, EX0003 |
| Comm (Unit) | `UN_CD` | UN + 4 số | UN0001, UN0002, UN0003 |
| User | `USER_CD` | US + 4 số | US0001, US0002, US0003 |

## Cách Hoạt Động

### 1. TypeORM BeforeInsert Hook
Mỗi entity sử dụng decorator `@BeforeInsert()` để tự động tạo mã trước khi insert vào database:

```typescript
@BeforeInsert()  
async generateProductCode() {
    if (!this.PD_CD) {
        const codeGenerator = new CodeGeneratorService(AppDataSource);
        this.PD_CD = await codeGenerator.generateProductCode();
    }
}
```

### 2. Code Generator Service
Service `CodeGeneratorService` thực hiện:
- Query database để tìm mã lớn nhất hiện tại
- Tăng số thứ tự lên 1
- Format theo chuẩn: PREFIX + 4 chữ số

### 3. Logic Fallback
Nếu có lỗi khi query database, hệ thống sẽ sử dụng timestamp để tạo mã dự phòng.

## Cách Sử dụng API

### Trước đây (Cần truyền mã thủ công)
```json
POST /api/products
{
  "PD_CD": "PD0001",  // ❌ Bắt buộc truyền
  "PD_NM": "Sản phẩm A",
  "STORE_ID": "ST0001",
  "QUANTITY": 10
}
```

### Bây giờ (Tự động tạo mã)
```json  
POST /api/products
{
  // ✅ Không cần truyền PD_CD
  "PD_NM": "Sản phẩm A", 
  "STORE_ID": "ST0001",
  "QUANTITY": 10
}
```

### Response sẽ bao gồm mã đã được tạo:
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "ID": 1,
    "PD_CD": "PD0001",  // ✅ Được tự động tạo
    "PD_NM": "Sản phẩm A",
    "STORE_ID": "ST0001", 
    "QUANTITY": 10,
    "createdAt": "2026-03-12T10:00:00.000Z"
  },
  "note": "Mã sản phẩm được tự động tạo: PD0001"
}
```

## Testing với Postman

Sử dụng collection `auto-code-generation.postman_collection.json` để test:

1. **Test cơ bản**: Tạo entity mới và verify mã được tạo đúng format
2. **Test tuần tự**: Tạo nhiều entity và kiểm tra mã tăng dần
3. **Test validation**: Verify regex pattern `/^[PREFIX]\\d{4}$/`

### Các Environment Variables cần set:
```
base_url: http://localhost:3000
```

## Lưu Ý Quan Trọng

### 1. Migration Database
Nếu đã có data trong database, cần update các record có mã trống:

```sql  
-- Ví dụ cho Product
UPDATE TB_PRODUCT SET PD_CD = CONCAT('PD', LPAD(ID, 4, '0')) WHERE PD_CD IS NULL OR PD_CD = '';
```

### 2. Unique Constraint
Tất cả các trường `*_CD` đều có constraint `unique: true`, đảm bảo không trùng lặp.

### 3. Manual Override
Nếu cần set mã thủ công, vẫn có thể truyền trong request body. Hook chỉ tạo mã khi trường đó rỗng.

### 4. Concurrent Requests
Trong môi trường production với multiple instances, nên thêm mechanism lock để tránh race condition.

## Troubleshooting

### Problem: Mã bị trùng lặp
**Solution**: Kiểm tra unique constraint và database sequence

### Problem: Mã không được tạo
**Solution**: 
- Verify AppDataSource đã được khởi tạo
- Check BeforeInsert hook được import đúng
- Xem log để debug CodeGeneratorService

### Problem: Format mã không đúng  
**Solution**: Check logic trong `generateNextCode()` method

## Code Structure

```
src/
├── entity/
│   ├── Product.ts      # @BeforeInsert + generateProductCode()
│   ├── Store.ts        # @BeforeInsert + generateStoreCode()  
│   ├── Import.ts       # @BeforeInsert + generateImportCode()
│   ├── Export.ts       # @BeforeInsert + generateExportCode()
│   ├── Comm.ts         # @BeforeInsert + generateUnitCode()
│   └── User.ts         # @BeforeInsert + generateUserCode()
├── services/
│   └── code-generator.service.ts  # Core logic tạo mã
└── controllers/
    └── *.controller.ts # Cập nhật comment và response
```

---

*Last updated: March 12, 2026*
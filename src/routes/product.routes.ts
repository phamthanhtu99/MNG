import { Router } from 'express';
import * as ctrl from '../controllers/product.controller';
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * Product Routes - Định nghĩa các endpoint cho sản phẩm
 * Tuân theo RESTful conventions
 */

// GET /api/products/search - Tìm kiếm sản phẩm (phải đặt trước /:id)
router.get('/search', ctrl.search);

// POST /api/products - Tạo sản phẩm mới
router.post('/', authMiddleware, ctrl.create);

// GET /api/products - Lấy danh sách sản phẩm
router.get('/', authMiddleware, ctrl.list);

// GET /api/products/:id - Lấy thông tin sản phẩm theo ID
router.get('/:id', ctrl.getOne);

// PUT /api/products/:id - Cập nhật sản phẩm
router.put('/:id', authMiddleware, ctrl.update);

// DELETE /api/products/:id - Xóa sản phẩm
router.delete('/:id', ctrl.remove);

export default router;

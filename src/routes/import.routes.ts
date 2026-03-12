import { Router } from 'express';
import * as ctrl from '../controllers/import.controller';
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * Import Routes - Định nghĩa các endpoint cho phiếu nhập kho
 * Tuân theo RESTful conventions
 */

// ===== IMPORT ROUTES =====

// GET /api/imports/search - Tìm kiếm phiếu nhập (phải đặt trước /:id)
router.get('/search', ctrl.search);

// POST /api/imports - Tạo phiếu nhập mới
router.post('/', authMiddleware, ctrl.create);

// GET /api/imports - Lấy danh sách phiếu nhập
router.get('/', authMiddleware, ctrl.list);

// GET /api/imports/:id - Lấy thông tin phiếu nhập theo ID
router.get('/:id', ctrl.getOne);

// PUT /api/imports/:id - Cập nhật phiếu nhập
router.put('/:id', authMiddleware, ctrl.update);

// DELETE /api/imports/:id - Xóa phiếu nhập
router.delete('/:id', authMiddleware, ctrl.remove);

// ===== IMPORT DETAIL ROUTES =====

// GET /api/imports/:importId/details - Lấy danh sách chi tiết phiếu nhập theo IMPORT_ID
router.get('/:importId/details', ctrl.listDetails);

// POST /api/imports/details - Tạo chi tiết phiếu nhập mới
router.post('/details', authMiddleware, ctrl.createDetail);

// GET /api/imports/details/:id - Lấy chi tiết phiếu nhập theo ID
router.get('/details/:id', ctrl.getOneDetail);

// PUT /api/imports/details/:id - Cập nhật chi tiết phiếu nhập
router.put('/details/:id', authMiddleware, ctrl.updateDetail);

// DELETE /api/imports/details/:id - Xóa chi tiết phiếu nhập
router.delete('/details/:id', authMiddleware, ctrl.removeDetail);

export default router;
import { Request, Response } from 'express';
import * as service from '../services/import.service';

/**
 * Import Controller - Xử lý các yêu cầu HTTP cho phiếu nhập kho
 * Tuân theo RESTful conventions
 */

// ===== IMPORT CONTROLLERS =====

/**
 * Tạo phiếu nhập mới
 * POST /api/imports
 */
export const create = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin user từ JWT token
    const user = (req as any).user;
    const importData = {
      ...req.body,
      CREATED_BY: user?.username || null // Set CREATED_BY từ USERNAME của user đăng nhập
    };
    
    const importRecord = await service.createImport(importData);
    res.status(201).json({
      success: true,
      message: 'Tạo phiếu nhập thành công',
      data: importRecord
    });
  } catch (error: any) {
    console.error('Error creating import:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể tạo phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy danh sách phiếu nhập
 * GET /api/imports
 */
export const list = async (req: Request, res: Response) => {
  try {
    const imports = await service.listImports();
    res.json({
      success: true,
      message: 'Lấy danh sách phiếu nhập thành công',
      data: imports,
      total: imports.length
    });
  } catch (error: any) {
    console.error('Error listing imports:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy thông tin phiếu nhập theo ID
 * GET /api/imports/:id
 */
export const getOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const importRecord = await service.getImport(id);
    
    if (!importRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phiếu nhập' 
      });
    }

    res.json({
      success: true,
      message: 'Lấy thông tin phiếu nhập thành công',
      data: importRecord
    });
  } catch (error: any) {
    console.error('Error getting import:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy thông tin phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Cập nhật phiếu nhập
 * PUT /api/imports/:id
 */
export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const importRecord = await service.updateImport(id, req.body);
    
    if (!importRecord) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phiếu nhập để cập nhật' 
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật phiếu nhập thành công',
      data: importRecord
    });
  } catch (error: any) {
    console.error('Error updating import:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể cập nhật phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Xóa phiếu nhập
 * DELETE /api/imports/:id
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const result = await service.removeImport(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy phiếu nhập để xóa' 
      });
    }

    res.json({
      success: true,
      message: 'Xóa phiếu nhập thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Error removing import:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể xóa phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Tìm kiếm phiếu nhập
 * GET /api/imports/search?keyword=...
 */
export const search = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp từ khóa tìm kiếm' 
      });
    }

    const imports = await service.searchImports(keyword);
    res.json({
      success: true,
      message: 'Tìm kiếm phiếu nhập thành công',
      data: imports,
      total: imports.length,
      keyword: keyword
    });
  } catch (error: any) {
    console.error('Error searching imports:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể tìm kiếm phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

// ===== IMPORT DETAIL CONTROLLERS =====

/**
 * Tạo chi tiết phiếu nhập mới
 * POST /api/imports/details
 */
export const createDetail = async (req: Request, res: Response) => {
  try {
    const importDetail = await service.createImportDetail(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo chi tiết phiếu nhập thành công',
      data: importDetail
    });
  } catch (error: any) {
    console.error('Error creating import detail:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể tạo chi tiết phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy danh sách chi tiết phiếu nhập theo IMPORT_ID
 * GET /api/imports/:importId/details
 */
export const listDetails = async (req: Request, res: Response) => {
  try {
    const importId = parseInt(req.params.importId);
    if (isNaN(importId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Import ID không hợp lệ' 
      });
    }

    const details = await service.listImportDetailsByImportId(importId);
    res.json({
      success: true,
      message: 'Lấy danh sách chi tiết phiếu nhập thành công',
      data: details,
      total: details.length
    });
  } catch (error: any) {
    console.error('Error listing import details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách chi tiết phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy chi tiết phiếu nhập theo ID
 * GET /api/imports/details/:id
 */
export const getOneDetail = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const detail = await service.getImportDetail(id);
    
    if (!detail) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chi tiết phiếu nhập' 
      });
    }

    res.json({
      success: true,
      message: 'Lấy thông tin chi tiết phiếu nhập thành công',
      data: detail
    });
  } catch (error: any) {
    console.error('Error getting import detail:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy thông tin chi tiết phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Cập nhật chi tiết phiếu nhập
 * PUT /api/imports/details/:id
 */
export const updateDetail = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const detail = await service.updateImportDetail(id, req.body);
    
    if (!detail) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chi tiết phiếu nhập để cập nhật' 
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật chi tiết phiếu nhập thành công',
      data: detail
    });
  } catch (error: any) {
    console.error('Error updating import detail:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể cập nhật chi tiết phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Xóa chi tiết phiếu nhập
 * DELETE /api/imports/details/:id
 */
export const removeDetail = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID không hợp lệ' 
      });
    }

    const result = await service.removeImportDetail(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy chi tiết phiếu nhập để xóa' 
      });
    }

    res.json({
      success: true,
      message: 'Xóa chi tiết phiếu nhập thành công',
      data: result
    });
  } catch (error: any) {
    console.error('Error removing import detail:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể xóa chi tiết phiếu nhập',
      error: error.message || 'Lỗi không xác định'
    });
  }
};
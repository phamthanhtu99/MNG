import { Request, Response } from 'express';
import * as service from '../services/product.service';

/**
 * Product Controller - Xử lý các yêu cầu HTTP cho sản phẩm
 * Tuân theo RESTful conventions
 */

/**
 * Tạo sản phẩm mới
 * POST /api/products
 */
export const create = async (req: Request, res: Response) => {
  try {
    // Lấy thông tin user từ JWT token
    const user = (req as any).user;
    const productData = {
      ...req.body,
      REQ_ID: user?.username || null, // Set REQ_ID từ USERNAME của user đăng nhập
      USER_LOGIN: user?.username || null // Set USER_LOGIN từ USERNAME của user đăng nhập
    };
    
    const product = await service.createProduct(productData);
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể tạo sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy danh sách sản phẩm
 * GET /api/products
 */
export const list = async (req: Request, res: Response) => {
  try {
    const products = await service.listProducts();
    res.json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: products,
      total: products.length
    });
  } catch (error: any) {
    console.error('Error listing products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Lấy thông tin sản phẩm theo ID
 * GET /api/products/:id
 */
export const getOne = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await service.getProduct(id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }
    res.json({
      success: true,
      message: 'Lấy thông tin sản phẩm thành công',
      data: product
    });
  } catch (error: any) {
    console.error('Error getting product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy thông tin sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Cập nhật sản phẩm
 * PUT /api/products/:id
 */
export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    // Lấy thông tin user từ JWT token
    const user = (req as any).user;
    const updateData = {
      ...req.body,
      REQ_ID: user?.username || null, // Set REQ_ID từ USERNAME của user đăng nhập
      USER_LOGIN: user?.username || null // Set USER_LOGIN từ USERNAME của user đăng nhập
    };
    
    const product = await service.updateProduct(id, updateData);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy sản phẩm' 
      });
    }
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(400).json({ 
      success: false,
      message: 'Không thể cập nhật sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Xóa sản phẩm
 * DELETE /api/products/:id
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.deleteProduct(id);
    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể xóa sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};

/**
 * Tìm kiếm sản phẩm
 * GET /api/products/search?keyword=
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
    const products = await service.searchProducts(keyword);
    res.json({
      success: true,
      message: 'Tìm kiếm sản phẩm thành công',
      data: products,
      total: products.length
    });
  } catch (error: any) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false, 
      message: 'Không thể tìm kiếm sản phẩm',
      error: error.message || 'Lỗi không xác định'
    });
  }
};


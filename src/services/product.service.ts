import { AppDataSource } from '../data-source';
import { Product } from '../entity/Product';

// Helper to access Product repository
const productRepo = () => AppDataSource.getRepository(Product);

/**
 * Create and persist a new product.
 * Tạo sản phẩm mới với các field theo cấu trúc TB_PRODUCT
 */
export const createProduct = async (data: Partial<Product>) => {
  const repo = productRepo();
  const product = repo.create(data);
  return repo.save(product);
};

/**
 * List all products
 * Lấy danh sách tất cả sản phẩm
 */
export const listProducts = async () => {
  return productRepo().find({
    order: { ID: 'DESC' }
  });
};

/**
 * Get a single product by ID
 * Lấy thông tin sản phẩm theo ID
 */
export const getProduct = async (id: number) => {
  return productRepo().findOne({
    where: { ID: id }
  });
};

/**
 * Get product by product code (PD_CD)
 * Lấy sản phẩm theo mã sản phẩm
 */
export const getProductByCode = async (productCode: string) => {
  return productRepo().findOne({
    where: { PD_CD: productCode }
  });
};

/**
 * Update product fields and return the updated entity.
 * Cập nhật thông tin sản phẩm
 */
export const updateProduct = async (id: number, data: Partial<Product>) => {
  await productRepo().update(id, data);
  return getProduct(id);
};

/**
 * Delete a product by ID
 * Xóa sản phẩm theo ID
 */
export const deleteProduct = async (id: number) => {
  return productRepo().delete(id);
};

/**
 * Search products by name or code
 * Tìm kiếm sản phẩm theo tên hoặc mã
 */
export const searchProducts = async (keyword: string) => {
  return productRepo()
    .createQueryBuilder('product')
    .where('product.PD_NM LIKE :keyword OR product.PD_CD LIKE :keyword', { 
      keyword: `%${keyword}%` 
    })
    .orderBy('product.ID', 'DESC')
    .getMany();
};


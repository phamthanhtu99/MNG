import { AppDataSource } from '../data-source';
import { Import } from '../entity/Import';
import { ImportDetail } from '../entity/ImportDetail';

// Helper để truy cập Import repository
const importRepo = () => AppDataSource.getRepository(Import);
const importDetailRepo = () => AppDataSource.getRepository(ImportDetail);

/**
 * Tạo phiếu nhập mới
 * Create and persist a new import
 */
export const createImport = async (data: Partial<Import>) => {
  const repo = importRepo();
  const importRecord = repo.create(data);
  return repo.save(importRecord);
};

/**
 * Lấy danh sách tất cả phiếu nhập
 * List all imports
 */
export const listImports = async () => {
  return importRepo().find({
    order: { ID: 'DESC' }
  });
};

/**
 * Lấy thông tin phiếu nhập theo ID
 * Get a single import by ID
 */
export const getImport = async (id: number) => {
  return importRepo().findOne({
    where: { ID: id }
  });
};

/**
 * Lấy phiếu nhập theo mã phiếu nhập (IMPORT_CD)
 * Get import by import code
 */
export const getImportByCode = async (importCode: string) => {
  return importRepo().findOne({
    where: { IMPORT_CD: importCode }
  });
};

/**
 * Cập nhật thông tin phiếu nhập
 * Update import fields and return the updated entity
 */
export const updateImport = async (id: number, data: Partial<Import>) => {
  const repo = importRepo();
  await repo.update(id, data);
  return getImport(id);
};

/**
 * Xóa phiếu nhập
 * Remove import and return the count
 */
export const removeImport = async (id: number) => {
  const result = await importRepo().delete(id);
  return { affected: result.affected };
};

/**
 * Tìm kiếm phiếu nhập theo từ khóa
 * Search imports by keyword  
 */
export const searchImports = async (keyword: string) => {
  return importRepo()
    .createQueryBuilder('import')
    .where('import.IMPORT_CD LIKE :keyword OR import.NOTE LIKE :keyword', 
           { keyword: `%${keyword}%` })
    .orderBy('import.ID', 'DESC')
    .getMany();
};

// ------- IMPORT DETAIL SERVICES -------

/**
 * Tạo chi tiết phiếu nhập mới
 * Create and persist a new import detail
 */
export const createImportDetail = async (data: Partial<ImportDetail>) => {
  const repo = importDetailRepo();
  const importDetail = repo.create(data);
  return repo.save(importDetail);
};

/**
 * Lấy danh sách tất cả chi tiết phiếu nhập theo IMPORT_ID
 * List all import details by import ID
 */
export const listImportDetailsByImportId = async (importId: number) => {
  return importDetailRepo().find({
    where: { IMPORT_ID: importId },
    order: { ID: 'ASC' }
  });
};

/**
 * Lấy chi tiết phiếu nhập theo ID
 * Get import detail by ID
 */
export const getImportDetail = async (id: number) => {
  return importDetailRepo().findOne({
    where: { ID: id }
  });
};

/**
 * Cập nhật chi tiết phiếu nhập
 * Update import detail
 */
export const updateImportDetail = async (id: number, data: Partial<ImportDetail>) => {
  const repo = importDetailRepo();
  await repo.update(id, data);
  return getImportDetail(id);
};

/**
 * Xóa chi tiết phiếu nhập
 * Remove import detail
 */
export const removeImportDetail = async (id: number) => {
  const result = await importDetailRepo().delete(id);
  return { affected: result.affected };
};

/**
 * Lấy danh sách chi tiết phiếu nhập theo sản phẩm
 * Get import details by product code
 */
export const getImportDetailsByProductCode = async (productCode: string) => {
  return importDetailRepo().find({
    where: { PD_CD: productCode },
    order: { CREATED_DT: 'DESC' }
  });
};
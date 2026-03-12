import { AppDataSource } from '../data-source';
import { Export } from '../entity/Export';
import { ExportDetail } from '../entity/ExportDetail';

// Helper để truy cập Export repository
const exportRepo = () => AppDataSource.getRepository(Export);
const exportDetailRepo = () => AppDataSource.getRepository(ExportDetail);

/**
 * Tạo phiếu xuất mới
 * Create and persist a new export
 */
export const createExport = async (data: Partial<Export>) => {
  const repo = exportRepo();
  const exportRecord = repo.create(data);
  return repo.save(exportRecord);
};

/**
 * Lấy danh sách tất cả phiếu xuất
 * List all exports
 */
export const listExports = async () => {
  return exportRepo().find({
    order: { ID: 'DESC' }
  });
};

/**
 * Lấy thông tin phiếu xuất theo ID
 * Get a single export by ID
 */
export const getExport = async (id: number) => {
  return exportRepo().findOne({
    where: { ID: id }
  });
};

/**
 * Lấy phiếu xuất theo mã phiếu xuất (EXPORT_CD)
 * Get export by export code
 */
export const getExportByCode = async (exportCode: string) => {
  return exportRepo().findOne({
    where: { EXPORT_CD: exportCode }
  });
};

/**
 * Cập nhật thông tin phiếu xuất
 * Update export fields and return the updated entity
 */
export const updateExport = async (id: number, data: Partial<Export>) => {
  const repo = exportRepo();
  await repo.update(id, data);
  return getExport(id);
};

/**
 * Xóa phiếu xuất
 * Remove export and return the count
 */
export const removeExport = async (id: number) => {
  const result = await exportRepo().delete(id);
  return { affected: result.affected };
};

/**
 * Tìm kiếm phiếu xuất theo từ khóa
 * Search exports by keyword  
 */
export const searchExports = async (keyword: string) => {
  return exportRepo()
    .createQueryBuilder('export')
    .where('export.EXPORT_CD LIKE :keyword OR export.NOTE LIKE :keyword', 
           { keyword: `%${keyword}%` })
    .orderBy('export.ID', 'DESC')
    .getMany();
};

// ------- EXPORT DETAIL SERVICES -------

/**
 * Tạo chi tiết phiếu xuất mới
 * Create and persist a new export detail
 */
export const createExportDetail = async (data: Partial<ExportDetail>) => {
  const repo = exportDetailRepo();
  const exportDetail = repo.create(data);
  return repo.save(exportDetail);
};

/**
 * Lấy danh sách tất cả chi tiết phiếu xuất theo EXPORT_ID
 * List all export details by export ID
 */
export const listExportDetailsByExportId = async (exportId: number) => {
  return exportDetailRepo().find({
    where: { EXPORT_ID: exportId },
    order: { ID: 'ASC' }
  });
};

/**
 * Lấy chi tiết phiếu xuất theo ID
 * Get export detail by ID
 */
export const getExportDetail = async (id: number) => {
  return exportDetailRepo().findOne({
    where: { ID: id }
  });
};

/**
 * Cập nhật chi tiết phiếu xuất
 * Update export detail
 */
export const updateExportDetail = async (id: number, data: Partial<ExportDetail>) => {
  const repo = exportDetailRepo();
  await repo.update(id, data);
  return getExportDetail(id);
};

/**
 * Xóa chi tiết phiếu xuất
 * Remove export detail
 */
export const removeExportDetail = async (id: number) => {
  const result = await exportDetailRepo().delete(id);
  return { affected: result.affected };
};

/**
 * Lấy danh sách chi tiết phiếu xuất theo sản phẩm
 * Get export details by product code
 */
export const getExportDetailsByProductCode = async (productCode: string) => {
  return exportDetailRepo().find({
    where: { PD_CD: productCode },
    order: { CREATED_DT: 'DESC' }
  });
};
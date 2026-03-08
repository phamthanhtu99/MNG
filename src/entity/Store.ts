import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Store entity - Bảng cửa hàng (TB_STORE)
 * 
 * Theo cấu trúc:
 * - ID: Khóa chính bigint
 * - STORE_CD: Mã store (unique)
 * - STORE_NM: Tên store
 * - STORE_TYPE: Loại store (FK)
 * - ADDRESS: Địa chỉ
 * - PHONE: Số điện thoại
 * - IS_ACTIVE: Trạng thái
 * - CREATED_DT: Ngày tạo
 * - CREATED_BY: Người tạo
 */
@Entity('TB_STORE')
export class Store {
    @PrimaryGeneratedColumn('increment')
    ID!: number; // ID cửa hàng - Khóa chính bigint

    @Column({ type: 'varchar', length: 255, unique: true })
    STORE_CD!: string; // Mã store - Unique

    @Column({ type: 'varchar', length: 255 })
    STORE_NM!: string; // Tên store

    @Column({ type: 'varchar', length: 100, nullable: true })
    STORE_TYPE!: string | null; // Loại store (FK)

    @Column({ type: 'text', nullable: true })
    ADDRESS!: string | null; // Địa chỉ

    @Column({ type: 'varchar', length: 20, nullable: true })
    PHONE!: string | null; // Số điện thoại

    @Column({ type: 'boolean', default: true })
    IS_ACTIVE!: boolean; // Trạng thái

    @CreateDateColumn()
    CREATED_DT!: Date; // Ngày tạo

    @Column({ type: 'varchar', length: 255, nullable: true })
    CREATED_BY!: string | null; // Người tạo
}
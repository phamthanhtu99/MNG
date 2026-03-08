import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Comm entity - Bảng master common (TB_MST_COM)
 * 
 * Theo cấu trúc:
 * - ID: Khóa chính bigint  
 * - UN_CD: Mã đơn vị (unique)
 * - UN_NM: Tên đơn vị
 * - UN_TP: Loại đơn vị
 * - IS_ACTIVE: Trạng thái hoạt động
 * - DESCRIPTION: Mô tả
 * - REQ_DT: Ngày tạo
 * - REQ_ID: ID request
 */
@Entity('TB_MST_COM')
export class Comm {
    @PrimaryGeneratedColumn('increment')
    ID!: number; // ID đơn vị - Khóa chính bigint

    @Column({ type: 'varchar', length: 255, unique: true })
    UN_CD!: string; // Mã đơn vị - Unique

    @Column({ type: 'varchar', length: 255 })
    UN_NM!: string; // Tên đơn vị

    @Column({ type: 'varchar', length: 100, nullable: true })
    UN_TP!: string | null; // Loại đơn vị

    @Column({ type: 'boolean', default: true })
    IS_ACTIVE!: boolean; // Trạng thái hoạt động

    @Column({ type: 'text', nullable: true })
    DESCRIPTION!: string | null; // Mô tả

    @CreateDateColumn()
    REQ_DT!: Date; // Ngày tạo

    @Column({ type: 'varchar', length: 255, nullable: true })
    REQ_ID!: string | null; // ID request
}
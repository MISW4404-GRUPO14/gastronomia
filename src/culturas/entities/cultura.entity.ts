import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cultura {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: String;

    @Column('text')
    descripcion: String;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Receta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    descripcion: string;

    @Column('text')
    foto: string;

    @Column('text')
    proceso: string;

    @Column('text')
    video: string;
}

import { Cultura } from "src/culturas/entities/cultura.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Cultura, cultura => cultura.recetas)
    cultura: Cultura; 
}

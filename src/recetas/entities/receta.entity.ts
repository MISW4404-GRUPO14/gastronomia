import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Producto, (producto) => producto.recetas)
    @JoinTable()  // Define la tabla intermedia
    productos: Producto[];
}

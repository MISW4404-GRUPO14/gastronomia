import { Cultura } from "../../culturas/entities/cultura.entity";
import { Producto } from '../../productos/entities/producto.entity'; 
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
    
    @ManyToMany(() => Producto, (producto) => producto.recetas)
    @JoinTable()  // Define la tabla intermedia
    productos: Producto[];
}

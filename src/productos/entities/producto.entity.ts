
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Receta } from '../../recetas/entities/receta.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
 
    @Column()
    descripcion: string;
    
    @Column()
    historia: string;
    
    @ManyToOne(() => Categoria, categoria => categoria.productos)
    idCategoria: string;

    @ManyToMany(() => Receta, (receta) => receta.productos)
    recetas: Receta[];
 
}
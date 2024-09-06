
import { Cultura } from 'culturas/entities/cultura.entity';
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
    categoria: string;

    @ManyToMany(() => Receta, (receta) => receta.productos)
    recetas: Receta[];

    @ManyToOne(() => Cultura, cultura => cultura.productos)
    cultura: Cultura; 
 
}
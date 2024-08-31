
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

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
 
}
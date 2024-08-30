
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
import { Producto } from '../../productos/entities/producto.entity';
 import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
 
    @Column()
    descripcion: string;
    
    @OneToMany(() => Producto, producto => producto.idCategoria)
    productos: Producto[];    
    
}
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Receta } from '../../recetas/entities/receta.entity';
import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Pais } from '../../paises/entities/pais.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Cultura {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('text')
    nombre: string;

    @Field()
    @Column('text')
    descripcion: string;

   
    @ManyToMany(() => Pais, (pais) => pais.culturas)
    @JoinTable()
    paises: Pais[];
    
   
    @ManyToMany(() => Restaurante, (restaurante) => restaurante.culturas)
    @JoinTable()
    restaurantes: Restaurante[];
    
    @Field(() => [Receta])
    @OneToMany(() => Receta, (receta) => receta.cultura, { cascade: true})
    recetas: Receta[];

    @OneToMany(() => Producto, producto => producto.cultura)
    productos: Producto[];
}
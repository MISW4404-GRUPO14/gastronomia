import { PaisEntity } from 'src/pais/pais.entity/pais.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity/restaurante.entity';

@Entity()
export class CiudadEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(()=> PaisEntity, pais => pais.ciudades)
    pais: PaisEntity;

    @OneToMany(()=> RestauranteEntity, restaurante => restaurante.ciudad)
    restaurantes: RestauranteEntity[];
}

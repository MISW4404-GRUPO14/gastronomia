import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pais } from '../../paises/entities/pais.entity';

@Entity()
export class Ciudad {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @OneToMany(() => Restaurante   , restaurante => restaurante.idCiudad)   
    restaurantes: Restaurante[];

    @ManyToOne(() => Pais, pais => pais.ciudades)
    idPais: string;
}

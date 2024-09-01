import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cultura } from "../../culturas/entities/cultura.entity";
import { Ciudad } from "../../ciudades/entities/ciudad.entity";

@Entity()
export class Restaurante {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;
    
    @Column('numeric')
    estrellas: number;

    @Column('date')
    fechasConsecucionEstrellas: Date;

    @ManyToMany(()=> Cultura, (cultura) => cultura.restaurantes)
    @JoinTable()
    culturas: Cultura[];

    @ManyToOne(() => Ciudad, ciudad => ciudad.restaurantes)
    idCiudad: string;
}

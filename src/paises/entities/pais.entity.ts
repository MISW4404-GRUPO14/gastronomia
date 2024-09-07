import { Entity, JoinTable, ManyToMany, OneToMany, Column, PrimaryGeneratedColumn } from "typeorm";
import { Ciudad } from "../../ciudades/entities/ciudad.entity";
import { Cultura } from "../../culturas/entities/cultura.entity";

@Entity()
export class Pais {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @OneToMany(() => Ciudad, ciudad => ciudad.idPais)
    ciudades: Ciudad[];

    @ManyToMany(() => Cultura, cultura => cultura.paises)
    // @JoinTable()
    culturas: Cultura[];
}

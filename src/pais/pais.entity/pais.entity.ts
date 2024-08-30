import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class PaisEntity {}
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(()=> CiudadEntity, ciudad => ciudad.pais)
    ciudades: CiudadEntity[];


import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CiudadEntity } from 'src/ciudad/entities/ciudad.entity';
import { Cultura } from 'src/culturas/entities/cultura.entity';

@Entity()
export class PaisEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => CiudadEntity, ciudad => ciudad.pais)
    ciudades: CiudadEntity[];

    @ManyToMany(()=> Cultura, cultura => cultura.paises)
    culturas: Cultura[];

}

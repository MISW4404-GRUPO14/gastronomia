import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RestauranteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    estrelals: number;

    @Column()
    fechasConsecucionEstrellas: Date;
    
    @ManyToOne(()=> CiudadEntity, ciudad => ciudad.restaurantes)
    ciudad: CiudadEntity;

    @ManyToMany(()=> Cultura, cultura => cultura.restaurantes)
    culturas: Cultura[];


}

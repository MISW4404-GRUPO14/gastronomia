import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    
}

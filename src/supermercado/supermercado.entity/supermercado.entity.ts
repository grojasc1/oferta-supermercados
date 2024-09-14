
import { CiudadEntity } from "../../ciudad/ciudad.entity/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    longitud: number;

    @Column()
    latitud: number;

    @Column()
    paginaWeb: string;

    @ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
    @JoinTable()
    ciudades: CiudadEntity[];
}

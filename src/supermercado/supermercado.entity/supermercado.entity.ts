import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

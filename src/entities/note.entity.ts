import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import Model from './model.entity';

@Entity('notes')
export class Note extends Model {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({
        nullable: true,
    })
    description: string;

    @Column({
        default: [],
        array: true,
        type: 'text'
    })
    image_url: string[];

}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Data extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  temp: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  hum: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  light: number;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    default: `now()`,
    nullable: true,
  })
  createdAt: Date;
}

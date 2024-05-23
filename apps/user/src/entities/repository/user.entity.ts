import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

@Entity()
export class User {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column()
  lastName: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  @Column()
  email: string;


  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Column()
  password: string;

  @IsPhoneNumber('CN')
  @IsString()
  @ApiProperty()
  @Column()
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  @Column()
  userStatus: number;
}

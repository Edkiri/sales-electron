import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
  
  @PrimaryGeneratedColumn ()
  id: number;
  
  @Column("varchar", {
    length: 50
  })
  name: string;
  
  // @Column({
  //   unique: true
  // })
  // identity_card: string;
  
  @Column("varchar", { 
    length: 60,
    nullable: true
  })
  phone_number: string;
  
  @Column({
    nullable: true
  })
  email: string;

}
import { Column } from 'typeorm';

export class Name {
  @Column({
    nullable: false,
    length: 32,
    name: 'firstName',
  })
  firstName: string;
  @Column({
    nullable: false,
    length: 32,
    name: 'lastName',
  })
  lastName: string;
}

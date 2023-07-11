import { Column } from 'typeorm';

export class Name {
  @Column({
    nullable: false,
    length: 32,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 32,
  })
  lastName: string;
}

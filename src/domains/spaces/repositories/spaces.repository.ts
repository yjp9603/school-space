import { EntityRepository, Repository } from 'typeorm';
import { Space } from '../entities/space.entity';

@EntityRepository(Space)
export class SpaceRepository extends Repository<Space> {}

import { DegreesDto } from './degrees.dto';

export class RelationshipDto {
  id: number;
  teacherId: number;
  matterId: number;
  degrees: Array<DegreesDto>;

  constructor(init?: Partial<RelationshipDto>) {
    Object.assign(this, null || init);
  }
}

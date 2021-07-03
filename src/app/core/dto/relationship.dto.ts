import { DegreesDto } from './degrees.dto';

export class RelationshipDto {
  id: number;
  teacherId: number;
  matterId: number;
  degrees: Array<DegreesDto>;
}

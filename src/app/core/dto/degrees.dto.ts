import { ClasseDto } from './classe.dto';

export class DegreesDto {
  degreeId: number;
  classes: Array<ClasseDto>;

  constructor(init?: Partial<DegreesDto>) {
    Object.assign(this, null || init);
  }
}

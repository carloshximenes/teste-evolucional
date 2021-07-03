import { Classe } from './classe';
import { Degree } from './degree';

export class Degrees {
  degree: Degree;
  classes: Array<Classe>;

  constructor(init?: Partial<Degrees>) {
    Object.assign(this, null || init);
  }
}

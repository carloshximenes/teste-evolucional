import { Classe } from './classe';
import { Degree } from './degree';
import { Matter } from './matter';
import { Teacher } from './teacher';

export class Relationship {
  id: number;
  teacher: Teacher;
  matter: Matter;
  degree: Degree;
  class: Classe;

  constructor(init?: Partial<Relationship>) {
    Object.assign(this, null || init);
  }
}

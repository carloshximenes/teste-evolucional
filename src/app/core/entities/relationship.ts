import { Degrees } from './degrees';
import { Matter } from './matter';
import { Teacher } from './teacher';

export class Relationships {
  id: number;
  teacher: Teacher;
  matter: Matter;
  degrees: Degrees;
}

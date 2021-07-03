export class Teacher {
  id: number;
  name: string;

  constructor(init?: Partial<Teacher>) {
    Object.assign(this, null || init);
  }
}

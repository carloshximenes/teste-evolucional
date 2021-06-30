export class Student {
  id: number;
  ra: number;
  name: string;
  degreeId: number;
  classId: number;

  constructor(init?: Partial<Student>) {
    Object.assign(this, null || init);
  }
}

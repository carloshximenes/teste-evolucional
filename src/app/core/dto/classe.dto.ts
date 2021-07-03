export class ClasseDto {
  classId: number;

  constructor(init?: Partial<ClasseDto>) {
    Object.assign(this, null || init);
  }
}
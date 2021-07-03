export class Degree {
  id: number;
  name: string;

  constructor(init?: Partial<Degree>) {
    Object.assign(this, null || init);
  }
}

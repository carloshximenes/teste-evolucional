export class Classe {
  id: number;
  name: string;

  constructor(init?: Partial<Classe>) {
    Object.assign(this, null || init);
  }
}

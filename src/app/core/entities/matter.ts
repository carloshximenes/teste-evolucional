export class Matter {
  id: number;
  name: string;

  constructor(init?: Partial<Matter>) {
    Object.assign(this, null || init);
  }
}

export interface EntityShape {
  id: number;
}

export abstract class Entity implements EntityShape {
  protected constructor(public id: number) {}
}

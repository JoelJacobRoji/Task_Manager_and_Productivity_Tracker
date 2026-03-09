import { Entity } from './entity.model';

export interface Category {
  id: number;
  name: string;
}

export class CategoryModel extends Entity implements Category {
  constructor(
    id: number,
    public name: string
  ) {
    super(id);
  }
}

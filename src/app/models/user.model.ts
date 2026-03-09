import { Entity } from './entity.model';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
}

export class UserModel extends Entity implements User {
  constructor(
    id: number,
    public name: string,
    public email: string,
    public role: 'Admin' | 'Member' = 'Member'
  ) {
    super(id);
  }
}

import { Category } from './category.entity';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public completed: boolean,
    public categoryId: Category['id'],
  ) {}
}
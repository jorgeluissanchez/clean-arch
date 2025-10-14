import { Task } from "../entity/task.entity";
import { ListTaskDto } from "../../application/dto/task-list.dto";

export interface TaskRepositoryPort {
  save(user: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filter: ListTaskDto): Promise<Task[]>;
  existsByTitle(title: string): Promise<boolean>;
  toggleCompleteById(id: string): Promise<Task>;
}

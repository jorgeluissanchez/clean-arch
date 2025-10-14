import { TaskDto } from "./task.dto";

export type CreateTaskDto = Omit<TaskDto, 'id' | "completed">;
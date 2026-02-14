export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  createdAt: Date;
}

export const tasks: Task[] = [];

import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { tasks } from "../models/task.model.js";
import type { Task } from "../models/task.model.js";
import { success } from "zod";

export const createTask = (req: Request, res: Response) => {
  const { title, description } = req.body;
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    status: "pending",
    createdAt: new Date(),
  };
  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
};

export const getAllTasks = (req: Request, res: Response) => {
  const { status, limit = "10", page = "1" } = req.query;
  let result = [...tasks];
  if (status) {
    result = result.filter((t) => t.status === status);
  }
  const sliceStart = (Number(page) - 1) * Number(limit);
  const pageinatedResult = result.slice(sliceStart, sliceStart + Number(limit));

  res.json({
    success: true,
    data: pageinatedResult,
    meta: { total: result.length, page: Number(page), limit: Number(limit) },
  });
};

export const updateTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res
      .status(404)
      .json({ success: false, error: { message: "Task not found" } });
  }

  task.status = status;
  res.json({ success: true, data: task });
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);

  if (index !== -1) tasks.splice(index, 1);
  res.status(204).send();
};

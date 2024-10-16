export interface Todo {
    id: string;
    task: string;
    completed: boolean;
}

export interface CreateTodoDTO {
    task: string;
}

export interface UpdateTodoDTO {
    task?: string;
    completed?: boolean;
}
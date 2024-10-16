export interface Todo {
    id: string;
    task: string;
    completed: boolean;
}

export interface CreateTodoRequest {
    task: string;
}

export interface UpdateTodoRequest {
    task?: string;
    completed?: boolean;
}
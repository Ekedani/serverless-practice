import { DbRepository } from '@interfaces/db-repository';
import { Todo } from '@interfaces/todo';
import { CreateTodoDTO } from '@dto/create-todo.dto';
import { UpdateTodoDTO } from '@dto/update-todo.dto';
import { DynamoDbRepository } from '@repositories/dynamo-db.repository';
import { v7 as uuid } from 'uuid';

export class TodoService {
    private dbRepository: DbRepository;
    private tableName: string;

    constructor() {
        this.dbRepository = new DynamoDbRepository();
        this.tableName = 'todos';
    }

    async create(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        const id = uuid()
        const todo: Todo = {
            id,
            task: createTodoDTO.task,
            completed: false,
            createdAt: new Date().toISOString()
        };
        await this.dbRepository.putItem(this.tableName, todo);
        return todo;
    }

    async findAll(): Promise<Todo[]> {
        return await this.dbRepository.scanItems<Todo>(this.tableName);
    }

    async findById(id: string): Promise<Todo | null> {
        const items = await this.dbRepository.scanItems<Todo>(this.tableName);
        return items.find(item => item.id === id) || null;
    }

    async updateById(id: string, updateTodoDTO: UpdateTodoDTO): Promise<Todo | null> {
        const existingTodo = await this.findById(id);
        if (!existingTodo) {
            return null;
        }

        const updateData: Partial<Todo> = updateTodoDTO;
        const updatedTodo = await this.dbRepository.updateItem<Todo>(
            this.tableName,
            { id },
            updateData
        );
    
        return updatedTodo;
    }

    async deleteById(id: string): Promise<void> {
        await this.dbRepository.deleteItem(this.tableName, { id });
    }
}
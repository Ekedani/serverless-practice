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
            status: 'available',
            version: Date.now(),
            ownerId: createTodoDTO.ownerId
        };
        await this.dbRepository.putItem(this.tableName, todo);
        return todo;
    }

    async findAll(): Promise<Todo[]> {
        return await this.dbRepository.scanItems<Todo>(this.tableName);
    }

    async findById(id: string): Promise<Todo | null> {
        const items = await this.dbRepository.scanItems<Todo>(this.tableName);
            const todosWithId = items.filter(item => item.id === id);
        if (todosWithId.length === 0) {
            return null;
        }
        const latestTodo = todosWithId.reduce((max, todo) => {
            return todo.version > max.version ? todo : max;
        });
        return latestTodo;
    }

    async updateById(id: string, updateTodoDTO: UpdateTodoDTO): Promise<Todo | null> {
        const existingTodo = await this.findById(id);
        if (!existingTodo) {
            return null;
        }
        const todo: Todo = {
            id,
            task: updateTodoDTO.task ?? existingTodo.task,
            status: updateTodoDTO.status ?? existingTodo.status,
            version: Date.now(),
            ownerId: updateTodoDTO.ownerId ?? existingTodo.ownerId,
        };
        await this.dbRepository.putItem(this.tableName, todo);
        return todo;
    }

    async deleteById(id: string): Promise<void> {
        await this.dbRepository.deleteItem(this.tableName, { id });
    }
}
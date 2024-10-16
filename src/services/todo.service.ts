import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../interfaces/todo';
import { DynamoDBRepository } from '../repositories/dynamo-db.repository';
import { randomUUID } from 'crypto';

export class TodoService {
    private dbRepository: DynamoDBRepository;
    private tableName: string;

    constructor(dbService: DynamoDBRepository, tableName: string) {
        this.dbRepository = dbService;
        this.tableName = tableName;
    }

    async create(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        const id = randomUUID();
        const todo: Todo = {
            id,
            task: createTodoDTO.task,
            completed: false,
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

        const updateExpressionParts: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        if (updateTodoDTO.task) {
            const key = '#task';
            updateExpressionParts.push(`${key} = :task`);
            expressionAttributeNames[key] = 'task';
            expressionAttributeValues[':task'] = updateTodoDTO.task;
        }

        if (updateTodoDTO.completed !== undefined) {
            const key = '#completed';
            updateExpressionParts.push(`${key} = :completed`);
            expressionAttributeNames[key] = 'completed';
            expressionAttributeValues[':completed'] = updateTodoDTO.completed;
        }

        const updateExpression = `SET ${updateExpressionParts.join(', ')}`;
        const updatedTodo = await this.dbRepository.updateItem<Todo>(
            this.tableName,
            { id },
            updateExpression,
            expressionAttributeNames,
            expressionAttributeValues
        );

        return updatedTodo;
    }

    async deleteById(id: string): Promise<void> {
        await this.dbRepository.deleteItem(this.tableName, { id });
    }
}
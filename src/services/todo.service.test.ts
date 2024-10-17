import { TodoService } from './todo.service';
import { DynamoDbRepository } from '@repositories/dynamo-db.repository';
import { CreateTodoDTO } from '@dto/create-todo.dto';
import { UpdateTodoDTO } from '@dto/update-todo.dto';
import { Todo } from '@interfaces/todo';
import { v7 as uuid } from 'uuid';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@repositories/dynamo-db.repository');
jest.mock('uuid', () => ({
    v7: jest.fn(),
}));


describe('TodoService', () => {
    let todoService: TodoService;
    let dbRepositoryMock: jest.Mocked<DynamoDbRepository>;

    beforeEach(() => {
        dbRepositoryMock = new DynamoDbRepository() as jest.Mocked<DynamoDbRepository>;
        (DynamoDbRepository as jest.Mock).mockImplementation(() => dbRepositoryMock);
        todoService = new TodoService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new todo', async () => {
            const createTodoDTO: CreateTodoDTO = { task: 'Test task', ownerId: 'owner123' };
            const id = '01929a36-3768-7f58-a9c1-dcfe20251b97';
            (uuid as jest.Mock).mockReturnValueOnce(id); 

            const expectedTodo: Todo = {
                id,
                task: createTodoDTO.task,
                status: 'available',
                version: Date.now(),
                ownerId: createTodoDTO.ownerId,
            };
            const result = await todoService.create(createTodoDTO);

            expect(result).toEqual(expectedTodo);
            expect(dbRepositoryMock.putItem).toHaveBeenCalledWith('todos', expectedTodo);
        });
    });

    describe('findAll', () => {
        it('should return all todos', async () => {
            const mockTodos: Todo[] = [
                { id: '1', task: 'Todo 1', status: 'available', version: 1, ownerId: 'owner123' },
                { id: '2', task: 'Todo 2', status: 'available', version: 2, ownerId: 'owner123' },
            ];

            dbRepositoryMock.scanItems.mockResolvedValueOnce(mockTodos);

            const result = await todoService.findAll();

            expect(result).toEqual(mockTodos);
            expect(dbRepositoryMock.scanItems).toHaveBeenCalledWith('todos');
        });
    });

    describe('findById', () => {
        it('should return the latest todo by id', async () => {
            const mockTodos: Todo[] = [
                { id: '1', task: 'Todo 1', status: 'available', version: 1, ownerId: 'owner123' },
                { id: '1', task: 'Todo 1 updated', status: 'available', version: 2, ownerId: 'owner123' },
            ];

            dbRepositoryMock.scanItems.mockResolvedValueOnce(mockTodos);

            const result = await todoService.findById('1');

            expect(result).toEqual(mockTodos[1]);
        });

        it('should return null if no todo is found', async () => {
            dbRepositoryMock.scanItems.mockResolvedValueOnce([]);

            const result = await todoService.findById('non-existent-id');

            expect(result).toBeNull();
        });
    });

    describe('updateById', () => {
        it('should update an existing todo', async () => {
            const existingTodo: Todo = { id: '1', task: 'Old task', status: 'available', version: 1, ownerId: 'owner123' };
            const updateTodoDTO: UpdateTodoDTO = { task: 'Updated task', ownerId: 'owner123' };

            dbRepositoryMock.scanItems.mockResolvedValueOnce([existingTodo]);
            dbRepositoryMock.putItem.mockResolvedValueOnce(undefined);

            const result = await todoService.updateById('1', updateTodoDTO);

            expect(result).toEqual({ ...existingTodo, task: updateTodoDTO.task, version: expect.any(Number) });
            expect(dbRepositoryMock.putItem).toHaveBeenCalledWith('todos', expect.any(Object));
        });

        it('should return null if todo is not found', async () => {
            dbRepositoryMock.scanItems.mockResolvedValueOnce([]);

            const result = await todoService.updateById('non-existent-id', { task: 'New task' });

            expect(result).toBeNull();
        });
    });

    describe('deleteById', () => {
        it('should delete a todo by id', async () => {
            await todoService.deleteById('1');

            expect(dbRepositoryMock.deleteItem).toHaveBeenCalledWith('todos', { id: '1' });
        });
    });
});

import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { TodoRepository } from './todo.repository';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@aws-sdk/lib-dynamodb', () => {
    return {
        QueryCommand: jest.fn(),
        DynamoDBDocumentClient: {
            from: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        },
    };
});

describe('TodoRepository', () => {
    let repository: TodoRepository;
    let dbClient: { send: any };

    beforeEach(() => {
        dbClient = {
            send: jest.fn(),
        };
        repository = new TodoRepository();
        (repository as any).dbClient = dbClient;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('queryByOwnerId', () => {
        it('should send QueryCommand with correct parameters and return items', async () => {
            const ownerId = 'owner123';
            const mockTodos = [{ id: '1', ownerId, name: 'Test Todo' }];
            dbClient.send.mockResolvedValueOnce({ Items: mockTodos });

            const result = await repository.queryByOwnerId('TestTable', ownerId);

            expect(QueryCommand).toHaveBeenCalledWith({
                TableName: 'TestTable',
                IndexName: 'OwnerIndex',
                KeyConditionExpression: 'ownerId = :ownerId',
                ExpressionAttributeValues: {
                    ':ownerId': ownerId,
                },
            });
            expect(dbClient.send).toHaveBeenCalledWith(expect.any(QueryCommand));
            expect(result).toEqual(mockTodos);
        });
    });
});
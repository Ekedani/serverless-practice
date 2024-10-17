import { DynamoDbRepository } from './dynamo-db.repository';
import { PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@aws-sdk/lib-dynamodb', () => {
    return {
        PutCommand: jest.fn(),
        ScanCommand: jest.fn(),
        UpdateCommand: jest.fn(),
        DeleteCommand: jest.fn(),
        DynamoDBDocumentClient: {
            from: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        },
    };
});

describe('DynamoDbRepository', () => {
    let repository: DynamoDbRepository;
    let dbClient: { send: any; };

    beforeEach(() => {
        dbClient = {
            send: jest.fn(),
        };
        repository = new DynamoDbRepository();
        (repository as any).dbClient = dbClient;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('putItem', () => {
        it('should send PutCommand with correct parameters', async () => {
            const item = { id: '1', name: 'Test Item' };
            dbClient.send.mockResolvedValueOnce({});

            await repository.putItem('TestTable', item);

            expect(PutCommand).toHaveBeenCalledWith({
                TableName: 'TestTable',
                Item: item,
            });
            expect(dbClient.send).toHaveBeenCalledWith(expect.any(PutCommand));
        });
    });

    describe('scanItems', () => {
        it('should send ScanCommand to return items from the table', async () => {
            const mockItems = [{ id: '1', name: 'Test Item' }];
            dbClient.send.mockResolvedValueOnce({ Items: mockItems });

            const result = await repository.scanItems('TestTable');

            expect(ScanCommand).toHaveBeenCalledWith({
                TableName: 'TestTable',
            });
            expect(result).toEqual(mockItems);
        });
    });

    describe('updateItem', () => {
        it('should send UpdateCommand with correct parameters', async () => {
            const key = { id: '1' };
            const updateData = { name: 'Updated Name' };
            const mockAttributes = { id: '1', name: 'Updated Name' };
            dbClient.send.mockResolvedValueOnce({ Attributes: mockAttributes });

            const result = await repository.updateItem('TestTable', key, updateData);

            expect(UpdateCommand).toHaveBeenCalledWith({
                TableName: 'TestTable',
                Key: key,
                UpdateExpression: 'SET #name = :name',
                ExpressionAttributeNames: { '#name': 'name' },
                ExpressionAttributeValues: { ':name': 'Updated Name' },
                ReturnValues: 'ALL_NEW',
            });
            expect(dbClient.send).toHaveBeenCalledWith(expect.any(UpdateCommand));
            expect(result).toEqual(mockAttributes);
        });
    });

    describe('deleteItem', () => {
        it('should send DeleteCommand with correct parameters', async () => {
            const key = { id: '1' };
            dbClient.send.mockResolvedValueOnce({});

            await repository.deleteItem('TestTable', key);
            
            expect(DeleteCommand).toHaveBeenCalledWith({
                TableName: 'TestTable',
                Key: key,
            });
            expect(dbClient.send).toHaveBeenCalledWith(expect.any(DeleteCommand));
        });
    });
});
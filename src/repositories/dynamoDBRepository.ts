import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoDBRepository {
    private client: DynamoDBDocumentClient;

    constructor() {
        const dynamoDBClient = new DynamoDBClient({});
        this.client = DynamoDBDocumentClient.from(dynamoDBClient);
    }

    async putItem<T extends Record<string, any>>(tableName: string, item: T): Promise<void> {
        const command = new PutCommand({ TableName: tableName, Item: item });
        await this.client.send(command);
    }

    async scanItems<T extends Record<string, any>>(tableName: string): Promise<T[]> {
        const command = new ScanCommand({ TableName: tableName });
        const result = await this.client.send(command);
        return result.Items as T[];
    }

    async updateItem<T extends Record<string, any>>(tableName: string, key: any, updateExpression: string, expressionAttributeNames: { [key: string]: string }, expressionAttributeValues: { [key: string]: any }): Promise<T> {
        const command = new UpdateCommand({
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        });

        const result = await this.client.send(command);
        return result.Attributes as T;
    }

    async deleteItem<T extends Record<string, any>>(tableName: string, key: T): Promise<void> {
        const command = new DeleteCommand({
            TableName: tableName,
            Key: key,
        });

        await this.client.send(command);
    }
}
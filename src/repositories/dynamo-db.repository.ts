import { DbRepository } from '../interfaces/db-repository';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export class DynamoDbRepository implements DbRepository {
    private dbClient: DynamoDBDocumentClient;

    constructor() {
        const dynamoDBClient = new DynamoDBClient({});
        this.dbClient = DynamoDBDocumentClient.from(dynamoDBClient);
    }

    async putItem<T extends Record<string, any>>(tableName: string, item: T): Promise<void> {
        const command = new PutCommand({ TableName: tableName, Item: item });
        await this.dbClient.send(command);
    }

    async scanItems<T extends Record<string, any>>(tableName: string): Promise<T[]> {
        const command = new ScanCommand({ TableName: tableName });
        const result = await this.dbClient.send(command);
        return result.Items as T[];
    }

    async updateItem<T extends Record<string, any>>(tableName: string, key: any, updateData: Partial<T>): Promise<T> {
        const updateExpressionParts: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        Object.keys(updateData).forEach((attr) => {
            const keyName = `#${attr}`;
            const valueName = `:${attr}`;
            updateExpressionParts.push(`${keyName} = ${valueName}`);
            expressionAttributeNames[keyName] = attr;
            expressionAttributeValues[valueName] = updateData[attr];
        });

        const updateExpression = `SET ${updateExpressionParts.join(', ')}`;
        
        const command = new UpdateCommand({
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        });

        const result = await this.dbClient.send(command);
        return result.Attributes as T;
    }

    async deleteItem<T extends Record<string, any>>(tableName: string, key: T): Promise<void> {
        const command = new DeleteCommand({
            TableName: tableName,
            Key: key,
        });

        await this.dbClient.send(command);
    }
}
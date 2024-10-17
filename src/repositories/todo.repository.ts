import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDbRepository } from "./dynamo-db.repository";
import { Todo } from "@interfaces/todo";

export class TodoRepository extends DynamoDbRepository {
    // TODO: fix for new keys
    async updateItem<T extends Record<string, any>>(tableName: string, key: any, updateData: Partial<T>): Promise<T> {
        console.log("Updating Todo with key:", key);
        console.log("Update data:", updateData);
        const updatedItem = await super.updateItem(tableName, key, updateData);
        return updatedItem;
    }

    async queryByOwnerId(tableName: string, ownerId: string): Promise<Todo[]> {
        const command = new QueryCommand({
            TableName: tableName,
            IndexName: "OwnerIndex",
            KeyConditionExpression: "ownerId = :ownerId",
            ExpressionAttributeValues: {
                ":ownerId": ownerId,
            },
        });
        const result = await this.dbClient.send(command);
        return result.Items as Todo[];
    }
}
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDbRepository } from "./dynamo-db.repository";
import { Todo } from "@interfaces/todo";

export class TodoRepository extends DynamoDbRepository {
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
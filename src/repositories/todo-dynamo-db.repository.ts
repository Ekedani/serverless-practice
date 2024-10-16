import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDbRepository } from "./dynamo-db.repository";

export class TodoRepository extends DynamoDbRepository {
    // TODO: Implement query logic using indexes
    //async queryByOwnerId(ownerId: string, tableName: string): Promise<Todo[]> {
    //   
    //}

    //async queryByStatusAndOwnerId(status: string, tableName: string): Promise<T[]> {
    //    
    //}
}
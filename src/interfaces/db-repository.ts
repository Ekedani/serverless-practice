export interface DbRepository {
    putItem<T extends Record<string, any>>(tableName: string, item: T): Promise<void>;
    scanItems<T extends Record<string, any>>(tableName: string): Promise<T[]>;
    updateItem<T extends Record<string, any>>(tableName: string, key: any, updateData: Partial<T>): Promise<T>;
    deleteItem<T extends Record<string, any>>(tableName: string, key: T): Promise<void>;
}
import { ServiceResponse } from "../interfaces/serviceResponse";

export const helloWorld = async (event: any): Promise<ServiceResponse<string>> => {
    return {
      data: "Hello world"
    }
};
import { ServiceResponse } from "../interfaces/service-response";

export const helloWorld = async (event: any): Promise<ServiceResponse<string>> => {
    return {
      data: "Hello world"
    }
};
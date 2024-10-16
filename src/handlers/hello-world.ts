import { ServiceResponse } from "@interfaces/service-response";
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger()

export const helloWorld = async (event: any): Promise<ServiceResponse<string>> => {
  logger.info('helloWorld handler invoked');
  return {
    data: "Hello world"
  }
};
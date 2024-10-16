import { ServiceResponse } from "@interfaces/service-response";
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import middy from '@middy/core'

const logger = new Logger();
const tracer = new Tracer();

const helloWorldHandler = async (_event: any): Promise<ServiceResponse<string>> => {
  logger.info('helloWorld handler invoked');
  return {
    data: "Hello world"
  }
};

export const helloWorld = middy(helloWorldHandler).use(captureLambdaHandler(tracer));


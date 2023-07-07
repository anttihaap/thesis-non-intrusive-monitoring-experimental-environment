import { App, Stack, aws_lambda as lambda } from "aws-cdk-lib";
import path = require("path");
const LAMBDA_ASSET_PATH = path.join(__dirname, "../dummyServices");
const NODEJS_RUNTIME = lambda.Runtime.NODEJS_18_X;

export class DummyServiceStack extends Stack {
  readonly service1LambdaFunction: lambda.Function;
  readonly service2LambdaFunction: lambda.Function;

  constructor(app: App, id: string) {
    super(app, id);
    this.service1LambdaFunction = new lambda.Function(this, "service1-lambda", {
      code: lambda.Code.fromAsset(LAMBDA_ASSET_PATH),
      description: "lambda for service1",
      functionName: "service1-lambda",
      handler: "service1.handler",
      runtime: NODEJS_RUNTIME,
    });
    this.service2LambdaFunction = new lambda.Function(this, "service2-lambda", {
      code: lambda.Code.fromAsset(LAMBDA_ASSET_PATH),
      description: "lambda for service1",
      functionName: "service2-lambda",
      handler: "service2.handler",
      runtime: NODEJS_RUNTIME,
    });
  }
}

import { App } from "aws-cdk-lib";
import { ApiGatewayStack } from "../stacks/api-gateway-stack";
import { DummyServiceStack } from "../stacks/dummy-services-stack";
import { CloudWatchStack } from "../stacks/cloudwatch-stack";
import { services } from "../config";

const app = new App();

const dummyServiceStack = new DummyServiceStack(app, "dummy-service-stack");

new ApiGatewayStack(app, "api-gateway-stack", {
  service1LambdaFunction: dummyServiceStack.service1LambdaFunction,
  service2LambdaFunction: dummyServiceStack.service2LambdaFunction,
});

new CloudWatchStack(app, "cloudwatch-stack", {
  resourcesToMonitor: [
    `/${services.resourcePath.service1}/{proxy+}`,
    `/${services.resourcePath.service2}/{proxy+}`,
  ],
  snsEmailAddress: "example@example.com",
});

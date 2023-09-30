import { App, Stack } from "aws-cdk-lib";
import { ApiGatewayStack } from "../stacks/api-gateway-stack";
import { DummyServiceStack } from "../stacks/dummy-services-stack";
import { services, stageName, apiGateway } from "../config";
import { ApiGatewayMonitoringCDKConstruct } from "monitoring-library";

const app = new App();

const dummyServiceStack = new DummyServiceStack(app, "dummy-service-stack");

new ApiGatewayStack(app, "api-gateway-stack", {
  service1LambdaFunction: dummyServiceStack.service1LambdaFunction,
  service2LambdaFunction: dummyServiceStack.service2LambdaFunction,
});

const service1Resource = `/${services.resourcePath.service1}/{proxy+}`;
const service2Resource = `/${services.resourcePath.service2}/{proxy+}`;

const monitoringStack = new Stack(app, "monitoring-stack");

new ApiGatewayMonitoringCDKConstruct(monitoringStack, "monitoring-construct", {
  apiGateway: {
    apiName: apiGateway.restApiName,
    stage: stageName,
  },
  alarmDefaults: {
    methods: ["DELETE", "GET", "HEAD", "PATCH", "POST"],
    evaluation: {
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
    },
    nStds: 1,
    period: 60 * 5,
    enabled: true,
  },
  alarms: [
    {
      metric: "Count",
      resource: service1Resource,
    },
    {
      metric: "4XXError",
      resource: service1Resource,
    },
    {
      metric: "5XXError",
      resource: service1Resource,
    },
    {
      metric: "Latency",
      resource: service1Resource,
    },
    {
      metric: "Count",
      resource: service2Resource,
    },
    {
      metric: "4XXError",
      resource: service2Resource,
    },
    {
      metric: "5XXError",
      resource: service2Resource,
    },
    {
      metric: "Latency",
      resource: service2Resource,
    },
  ],
  snsEmailAddress: "example@example.com",
});

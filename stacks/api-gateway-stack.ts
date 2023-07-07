import { App, Stack, aws_lambda as lambda } from "aws-cdk-lib";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";

import { services, apiGateway as apiGatewayConf } from "../config";

type Props = {
  service1LambdaFunction: lambda.Function;
  service2LambdaFunction: lambda.Function;
};

export class ApiGatewayStack extends Stack {
  constructor(app: App, id: string, props: Props) {
    super(app, id);

    const restApi = new apiGateway.RestApi(this, "APIGateway", {
      restApiName: apiGatewayConf.restApiName,
      // We deploy to certain stage below
      deploy: false,
    });

    const service1LambdaIntegragtion = new apiGateway.LambdaIntegration(
      props.service1LambdaFunction
    );
    const service2LambdaIntegragtion = new apiGateway.LambdaIntegration(
      props.service2LambdaFunction
    );

    const service1Resource = restApi.root.addResource(
      services.resourcePath.service1
    );
    service1Resource.addProxy({
      defaultIntegration: service1LambdaIntegragtion,
    });

    const service2Resource = restApi.root.addResource(
      services.resourcePath.service2
    );
    service2Resource.addProxy({
      defaultIntegration: service2LambdaIntegragtion,
    });

    const deployment = new apiGateway.Deployment(this, "test_deployment", {
      api: restApi,
    });
    const apiStage = new apiGateway.Stage(this, "stage_test", {
      deployment,
      stageName: apiGatewayConf.stage,
      // Send metrics to CloudWatch
      metricsEnabled: true,
    });
    restApi.deploymentStage = apiStage;
  }
}

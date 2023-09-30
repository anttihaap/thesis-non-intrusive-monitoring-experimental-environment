# Library usage example

The thesis additionally introduces an library that provides a facade to define AWS CloudWatch alarms to monitor metrics of the AWS API Gateway. The library can be found at: https://github.com/anttihaap/api-gateway-monitoring-cdk-construct 

The file [aws-cdk.ts](aws-cdk.ts) in this folder shows an example how the experimental environment could use the library to achieve the same functionalities as the [cloudwatch-stack.ts](../stacks/cloudwatch-stack.ts) does in this experimental environment.

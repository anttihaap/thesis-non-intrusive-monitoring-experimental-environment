# Experimental environment for non-intrusive monitoring of micrservices via an API Gateway

Experimental environment to showcase how microservices can be monitored non-intrusively via an AWS API Gateway in the AWS cloud platform. The experimental environment was created as part of a [master's thesis](http://urn.fi/URN:NBN:fi:hulib-202310173901). An example of the alarm AWS CloudFormation output can be found in [cloudFormation](examples/cloudFormation). 

The thesis additionally introduces an library that provides a facade to define AWS CloudWatch alarms to monitor metrics of the AWS API Gateway. The library can be found at: https://github.com/anttihaap/api-gateway-monitoring-cdk-construct. An example how the experimental environment could use the library to achieve the same functionalities can be found at [libraryUsage](examples/libraryUsage).



## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

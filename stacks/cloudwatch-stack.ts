import { App, Stack } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

import { createMethodMetricDataQueryProperty } from "./cloudwatch-utils";
import { Metric, Statistics } from "./types";

export class CloudWatchStack extends Stack {
  constructor(
    app: App,
    id: string,
    {
      resourcesToMonitor,
      snsEmailAddress,
    }: { resourcesToMonitor: string[]; snsEmailAddress: string }
  ) {
    super(app, id);

    const snsTopic = new sns.Topic(this, "alarm", {
      displayName: "alarm",
    });
    snsTopic.addSubscription(
      new subscriptions.EmailSubscription(snsEmailAddress)
    );

    const period = 60 * 5;
    const evaluationPeriods = 1;
    const datapointsToAlarm = 1;
    const methods = ["DELETE", "GET", "HEAD", "PATCH", "POST"];

    const metricAlarmProperties: {
      metric: Metric;
      stats: Statistics;
      nStds: number;
    }[] = [
      {
        metric: "Count",
        stats: "Sum",
        nStds: 3,
      },
      {
        metric: "4XXError",
        stats: "Sum",
        nStds: 3,
      },
      {
        metric: "5XXError",
        stats: "Sum",
        nStds: 3,
      },
      {
        metric: "Latency",
        stats: "Average",
        nStds: 3,
      },
    ];

    const createAlarm = (
      resource: string,
      metric: Metric,
      nStds: number,
      stats: Statistics
    ) => {
      const adb = {
        expression: `ANOMALY_DETECTION_BAND(m, ${nStds})`,
        id: "ad",
      };
      const alarmMetrics =
        stats === "Average"
          ? [
              adb,
              {
                id: "m",
                expression: `(${methods
                  .map((method) => `average_${method} * sampleCount_${method}`)
                  .join(" + ")}) / (${methods
                  .map((method) => `sampleCount_${method}`)
                  .join(" + ")})`,
              },
              ...methods.map((method) =>
                createMethodMetricDataQueryProperty(
                  `average_${method}`,
                  false,
                  metric,
                  resource,
                  method,
                  period,
                  stats
                )
              ),
              ...methods.map((method) =>
                createMethodMetricDataQueryProperty(
                  `sampleCount_${method}`,
                  false,
                  metric,
                  resource,
                  method,
                  period,
                  "SampleCount"
                )
              ),
            ]
          : [
              adb,
              {
                id: "m",
                expression: `${methods
                  .map((method) => `sum_${method}`)
                  .join(" + ")}`,
              },
              ...methods.map((method) =>
                createMethodMetricDataQueryProperty(
                  `sum_${method}`,
                  false,
                  metric,
                  resource,
                  method,
                  period,
                  stats
                )
              ),
            ];

      new cloudwatch.CfnAlarm(this, `${resource} ${metric} ${stats} alarm`, {
        alarmName: `ALARM: ${resource} ${metric} ${stats} alarm`,
        alarmDescription: `resource: ${resource}, metric: ${metric}, stats: ${stats}`,
        alarmActions: [snsTopic.topicArn],
        metrics: alarmMetrics,
        thresholdMetricId: "ad",
        comparisonOperator:
          metric === "Count"
            ? cloudwatch.ComparisonOperator
                .LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD
            : cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
        evaluationPeriods,
        datapointsToAlarm,
      });
    };

    resourcesToMonitor.forEach((resourceToMonitor) => {
      metricAlarmProperties.forEach(({ metric, stats, nStds }) => {
        createAlarm(resourceToMonitor, metric, nStds, stats);
      });
    });
  }
}

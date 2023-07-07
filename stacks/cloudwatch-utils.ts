import { Statistics } from "./types";
import { apiGateway } from "../config";

export const createMethodMetricDataQueryProperty = (
  id: string,
  returnData: boolean,
  metric: string,
  resource: string,
  method: string,
  period: number,
  statistics: Statistics
) => ({
  id,
  returnData,
  metricStat: {
    metric: {
      namespace: "AWS/ApiGateway",
      metricName: metric,
      dimensions: [
        {
          name: "ApiName",
          value: apiGateway.restApiName,
        },
        {
          name: "Resource",
          value: resource,
        },
        {
          name: "Stage",
          value: apiGateway.stage,
        },
        {
          name: "Method",
          value: method,
        },
      ],
    },
    period,
    stat: statistics,
  },
});

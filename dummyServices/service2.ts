import { Handler } from "aws-lambda";
export const handler: Handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ message: "Hello world. Service2." }),
});

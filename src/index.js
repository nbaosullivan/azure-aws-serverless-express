import awsServerlessExpress from 'aws-serverless-express';
import url from 'url';

export default function azureFunctionHandler(app, binaryTypes) {
  binaryTypes = binaryTypes || ['*/*'];

  const server = awsServerlessExpress.createServer(app, undefined, binaryTypes);

  return (context, req) => {
    const path = url.parse(req.originalUrl).pathname;
    req.headers.cookie = req.headers.cookie.replace(/\.RIFBA\.E5C67A1B-73F8-4465-BC33-FEA178637429=[^\s\\]+/g,'');
    const event = {
      path: path,
      httpMethod: req.method,
      headers: req.headers || {},
      queryStringParameters: req.query || {},
      body: req.rawBody,
      isBase64Encoded: false
    };

    const awsContext = {
      succeed(awsResponse) {
        context.res.status = awsResponse.statusCode;
        context.res.headers = {
          ...context.res.headers,
          ...awsResponse.headers
        };
        context.res.body = Buffer.from(
          awsResponse.body,
          awsResponse.isBase64Encoded ? 'base64' : 'utf8'
        );
        context.res.isRaw = true;

        context.done();
      }
    };
    awsServerlessExpress.proxy(server, event, awsContext);
  };
}

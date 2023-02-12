import { Request, Response, NextFunction, RequestHandler } from "express";
import promClient from 'prom-client';


const httpRequestTimer = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  // buckets for response time from 0.1ms to 1s
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
});

export function BaseMiddleware(wrappedMiddleware: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    try {
      wrappedMiddleware(req, res, next);
    } finally {
      const responseTimeInMs = Date.now() - start;
      httpRequestTimer.labels(req.method, req.route.path, res.statusCode.toString()).observe(responseTimeInMs);
    }
  };
}
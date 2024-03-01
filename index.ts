import express, { type Request, type Response } from "express";

type RetryLimit = any extends number ? `${number}` : "unlimited";

export interface RetryableHeaderRawRequest extends Request {
  "x-retry": "true" | "false";
  "x-retry-dropped-count": string;
  "x-retry-limit": RetryLimit;
  "x-retry-CRC32": string;
  "x-retry-retrieved-count": string;
  "x-retry-retrieved-CRC32": string;
}

export interface RetryableHeaderRequest {
  "x-retry": boolean;
  "x-retryCount": number;
  "x-retry-limit": number | "unlimited";
  "x-retry-CRC32": number;
  "x-retry-retrieved-count": number;
  "x-retry-retrieved-CRC32": number;
}

export interface RetryableHeaderRawResponse extends Response {
  "x-retryCount": string;
  "x-retryLimit": string;
}

const mapRetryableHeader = (req: RetryableHeaderRawRequest): RetryableHeaderRequest => {
  return {
    "x-retry": req["x-retry"] === "true",
    "x-retryCount": parseInt(req["x-retry-dropped-count"]),
    "x-retry-limit": req["x-retry-limit"] !== "unlimited" ? parseInt(req["x-retry-limit"]) : "unlimited",
    "x-retry-CRC32": parseInt(req["x-retry-CRC32"]),
    "x-retry-retrieved-count": parseInt(req["x-retry-retrieved-count"]),
    "x-retry-retrieved-CRC32": parseInt(req["x-retry-retrieved-CRC32"]),
  }
}

const checkIfRetryable = (req: RetryableHeaderRawRequest): boolean => {
  return req["x-retry"] === "true";
}

const checkIfRetryableHeaderIsFullyDefined = (req: RetryableHeaderRawRequest): boolean => {
  return req["x-retry-dropped-count"] !== undefined
    && req["x-retry-limit"] !== undefined
    && req["x-retry-CRC32"] !== undefined
    && req["x-retry-retrieved-count"] !== undefined
    && req["x-retry-retrieved-CRC32"] !== undefined;
}

const retryableMiddleware = (req: RetryableHeaderRawRequest, res: RetryableHeaderRawResponse, next: any) => {
  if (req["x-retry"] === "true") {

    const retryableHeader = mapRetryableHeader(req);

    if (retryableHeader["x-retry-limit"] === "unlimited") {
      next();
    }

    if (retryableHeader["x-retryCount"] >= (retryableHeader["x-retry-limit"] as unknown as number)) {
      res.status(500).send("Retry limit exceeded");
      return;
    }
  }
  next();
}


const app = express();

app.use(express.json());

app.get<{ a: string }>("/", (req, res) => {
  const { a } = req.body;
  const largeFile = "";
})



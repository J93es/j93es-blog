import path from "path";

// 포트
export const PORT = process.env.PORT || 8081;

// cors 허용 url
export const whitelist = JSON.parse(
  process.env.CORS_WHITE_LIST ||
    JSON.stringify([
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:8000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:8000",
    ])
);

export const isProduction = process.env.DEVELOPMENT_ENV !== "development";

export const publicDir = path.join(__dirname, "public");
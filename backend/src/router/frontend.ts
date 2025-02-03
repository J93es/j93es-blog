import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

import { publicDir } from "../config";
import { ForbiddenError, NotFoundError } from "../model/error";

const router = express.Router();
const frontendDir = path.join(publicDir, "frontend");

router.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: frontendDir });
});

router.get("/error-page/error.html", (req: Request, res: Response) => {
  const queryStatusKey = "j93es-status";
  const allowedErrorStatus = [400, 403, 404, 429, 500];
  const frontendErrorStatus = [1000, 1001, 1002];
  const status = Number(req.query[queryStatusKey]);

  if (allowedErrorStatus.includes(status)) {
    res.status(status);
  } else if (frontendErrorStatus.includes(status)) {
    res.status(424);
  } else {
    res.status(400);
  }
  res.sendFile("error-page/error.html", { root: frontendDir });
});

router.use(
  express.static(frontendDir, {
    etag: false,
    index: false,
    maxAge: "1d",
  })
);

// 프론트엔드 url에 해당하는 파일이 있는지 선제적으로 확인
// 없다면 에러 페이지로 리디렉션
router.use((req: Request, res: Response, next: NextFunction) => {
  const requestedPath = path.join(publicDir, req.path);
  const resolvedPath = path.resolve(requestedPath);

  if (!resolvedPath.startsWith(publicDir)) {
    return next(new ForbiddenError("잘못된 경로로 접근하셨습니다."));
  }

  try {
    fs.accessSync(resolvedPath, fs.constants.F_OK);
    next();
  } catch (err) {
    next(new NotFoundError("요청하신 파일을 찾을 수 없습니다."));
  }
});

router.get("*", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: frontendDir });
});

export default router;

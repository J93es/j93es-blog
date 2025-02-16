import fs from "fs";
import path from "path";
import { apiDir, showingCategoryList } from "../config";
import { PostingIndex } from "../model/postingIndex";
import { parseMarkdown } from "../utils/index";

/* 실제 파일 시스템에서 .md 파일을 읽고, 메타데이터를 생성해주는 class이다. */
// constructor에서 directoryPath는 apiDir로부터의 상대경로를 받는다.
// 즉, {apiDir}/{directoryPath}에 있는 .md 파일들을 읽어서 메타데이터를 생성해준다.
export class FilesMetadataController {
  private postingIndex: PostingIndex | null = null;
  private directoryPath: string;

  constructor(directoryPath: string) {
    this.directoryPath = directoryPath;
  }

  private makeRawPostingIndex = (): PostingIndex => {
    const rawPostingIndex: PostingIndex = {};

    showingCategoryList.forEach((category: string, index: number) => {
      rawPostingIndex[category] = { order: index, data: [] };
    });

    const readDirectory = (dirPath: string) => {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
          readDirectory(fullPath);
        } else if (path.extname(fullPath) === ".md") {
          const markdownContent = fs.readFileSync(fullPath, "utf-8");
          const { data } = parseMarkdown.get(markdownContent);

          if (!showingCategoryList.includes(data.category)) {
            return;
          }
          rawPostingIndex[data.category].data.push({
            title: data.title,
            date: data.date,
            tag: data.tag,
            category: data.category,
            path: path.join("/", fullPath.split(apiDir)[1]),
            description: data.description,
          });
        }
      });
    };

    readDirectory(path.join(apiDir, this.directoryPath));
    Object.keys(rawPostingIndex).forEach((key) => {
      if (rawPostingIndex[key].data.length === 0) {
        delete rawPostingIndex[key];
      }
    });

    return rawPostingIndex;
  };

  getMarkdownFilesMetadata = (): PostingIndex => {
    if (this.postingIndex === null) {
      const rawPostingIndex = this.makeRawPostingIndex();
      this.postingIndex = rawPostingIndex;
      return JSON.parse(JSON.stringify(rawPostingIndex));
    }

    return JSON.parse(JSON.stringify(this.postingIndex));
  };
}

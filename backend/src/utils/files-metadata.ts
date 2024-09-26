import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { publicDir } from "../config";
import { MarkdownMetadata, PhotoMetadata } from "../interface/metadata";

const directoryPath = path.join(publicDir, "posts");

export class FilesMetadata {
  private markdownFilesMetadata: MarkdownMetadata[] | null = null;
  private photoFilesMetadata: PhotoMetadata[] | null = null;

  private makeMarkdownFilesMetadata = (directoryPath: string) => {
    const markdownFilesMetadata: MarkdownMetadata[] = [];

    const readDirectory = (dirPath: string) => {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
          readDirectory(fullPath);
        } else if (path.extname(fullPath) === ".md") {
          const markdownContent = fs.readFileSync(fullPath, "utf-8");
          const { data } = matter(markdownContent);

          markdownFilesMetadata.push({
            title: data.title,
            date: data.date,
            tag: data.tag,
            path: fullPath.split(publicDir)[1],
          });
        }
      });
    };

    readDirectory(directoryPath);
    return markdownFilesMetadata;
  };

  getMarkdownFilesMetadata = () => {
    if (this.markdownFilesMetadata === null) {
      this.markdownFilesMetadata =
        this.makeMarkdownFilesMetadata(directoryPath);
    }

    return this.markdownFilesMetadata;
  };

  private makePhotoFilesMetadata = (directoryPath: string) => {
    const photoFilesMetadata: PhotoMetadata[] = [];

    const readDirectory = (dirPath: string) => {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
          readDirectory(fullPath);
        } else if (path.extname(fullPath) === ".jpg") {
          photoFilesMetadata.push({
            title: file.split(".")[0],
            path: fullPath.split(publicDir)[1],
          });
        }
      });
    };
    readDirectory(directoryPath);
    return photoFilesMetadata;
  };

  getPhotoFilesMetadata = () => {
    if (this.photoFilesMetadata === null) {
      this.photoFilesMetadata = this.makePhotoFilesMetadata(directoryPath);
    }

    return this.photoFilesMetadata;
  };
}
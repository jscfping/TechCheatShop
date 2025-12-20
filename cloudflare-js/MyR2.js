
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { S3Client, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { pipeline } from "stream/promises";



export class MyR2 {
    constructor({ endpoint, accessKeyId, secretAccessKey }) {
        this.client = new S3Client({
            region: "auto",
            endpoint: endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
    }

    _getBucketName(bucketPath) {
        return bucketPath.split("/")[0];
    }
    _getKey(bucketPath) {
        return bucketPath.split("/").slice(1).join("/");
    }

    /**
     * 取得檔案 metadata
     * @param {string} bucketPath - 格式: "bucket/path/to/file"
     * @returns {Promise<Object>} metadata 物件
     */
    async getMetaAsync(bucketPath) {
        const bucketName = this._getBucketName(bucketPath);
        const key = this._getKey(bucketPath);

        const response = await this.client.send(
            new HeadObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        return {
            contentType: response.ContentType,
            contentLength: response.ContentLength,
            eTag: response.ETag,
            lastModified: response.LastModified,
            metadata: response.Metadata,
        };
    }

    /**
     * 下載檔案
     * @param {string} bucketPath - 格式: "bucket/path/to/file"
     * @param {string} destFilePath - 本地目標路徑
     */
    async downloadAsync(bucketPath, destFilePath) {
        const bucketName = this._getBucketName(bucketPath);
        const key = this._getKey(bucketPath);
        const response = await this.client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        );

        // 確保目標目錄存在
        await fsPromises.mkdir(path.dirname(destFilePath), { recursive: true });

        // 使用 pipeline 串流下載
        await pipeline(response.Body, fs.createWriteStream(destFilePath));
    }

    /**
     * 上傳檔案
     * @param {string} srcFilePath - 本地檔案路徑
     * @param {string} bucketPath - 格式: "bucket/path/to/file"
     */
    async uploadFileAsync(srcFilePath, bucketPath) {
        const bucketName = this._getBucketName(bucketPath);
        const key = this._getKey(bucketPath);
        // 檢查檔案是否存在
        await fsPromises.access(srcFilePath, fs.constants.R_OK);

        const fileStream = fs.createReadStream(srcFilePath);
        const stats = await fsPromises.stat(srcFilePath);

        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: bucketName,
                Key: key,
                Body: fileStream,
                ContentLength: stats.size,
            },
        });

        // 可選：監聽上傳進度
        upload.on("httpUploadProgress", (progress) => {
            console.log(`${bucketPath} upload progress: ${progress.loaded}/${progress.total}`);
        });

        const result = await upload.done();
        return result;
    }
};





import fs from "fs/promises";
import pathLib from "path";
import crypto from "crypto";

export const MyFile = {

    async readFileAsync(path) {
        const resolved = pathLib.resolve(path);
        try {
            return await fs.readFile(resolved, "utf8");
        } catch (err) {
            throw new Error(`readFileAsync failed: ${err.message}`);
        }
    },

    async writeFileAsync(path, contnet) {
        const resolved = pathLib.resolve(path);
        try {
            await fs.mkdir(pathLib.dirname(resolved), { recursive: true });
            await fs.writeFile(resolved, contnet == null ? "" : contnet, "utf8");
            return true;
        } catch (err) {
            throw new Error(`writeFileAsync failed: ${err.message}`);
        }
    },

    async listFullFilePathsAsync(folderPath) {
        const resolved = pathLib.resolve(folderPath);
        const results = [];
        const entries = await fs.readdir(resolved, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = pathLib.join(resolved, entry.name);
            if (entry.isFile()) {
                results.push(fullPath);
            } else if (entry.isDirectory()) {
                const subFiles = await this.listFullFilePathsAsync(fullPath);
                results.push(...subFiles);
            }
        }
        return results;
    },

    async readMd5AndContentLengthAsync(filePath) {
        const resolved = pathLib.resolve(filePath);

        const hash = crypto.createHash("md5");
        const fileBuffer = await fs.readFile(resolved);
        hash.update(fileBuffer);
        const md5 = hash.digest("hex");

        const stats = await fs.stat(resolved);

        return { md5, contentLength: stats.size };
    }

};





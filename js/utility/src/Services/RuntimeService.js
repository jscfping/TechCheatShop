

const fs = require("fs").promises;
const path = require("path");




class RuntimeService {



    async listFilesAsync(dirPath) {
        const result = [];
        const files = await fs.readdir(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stats = await fs.stat(fullPath);

            if (stats.isDirectory()) {
                result.push(...await this.listFilesAsync(fullPath));
            } else {
                result.push(fullPath);
            }
        }
        return result;
    }

    readFileAsync(filepath, encoding = "utf8") {
        return fs.readFile(filepath, encoding);
    }

    writeFileAsync(filepath, data, encoding = "utf8") {
        return fs.writeFile(filepath, data, encoding);
    }

    parseFilePath(filePath) {
        const baseName = path.basename(filePath);
        const extName = path.extname(filePath);
        const fileName = baseName.replace(extName, "");

        return {
            fullFileName: baseName,
            fileName: fileName,
            extension: extName.replace(".", "")
        };
    }



}

module.exports = RuntimeService;


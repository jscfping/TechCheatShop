const express = require("express");
const http = require("http");

const app = express();


const envs = {
    port: process.env.PORT,
    envInImage: process.env.env_in_image,
    envInRun: process.env.env_in_run,
    proxyUrl: process.env.proxy_url
};

for (let k in envs) {
    if (!envs[k]) throw new Error(`no ${k}!`);
}




function getResAsync(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let responseData = "";

            response.on("data", (chunk) => {
                responseData += chunk;
            });

            response.on("end", () => {
                // 将目标 URL 的响应字符串发送给客户端
                resolve(responseData);
            });
        }).on("error", (error) => {
            reject(error);
        });
    });
}



app.get("/", (req, res) => {
    res.json({
        env_in_image: envs.envInImage,
        env_in_run: envs.envInRun
    });
});





app.get("/proxy", async (req, res) => {
    try {
        const data = await getResAsync(envs.proxyUrl);
        res.send(`data: ${data}`);
    } catch (e) {
        res.status(500).send(`error: ${e}`);
    }
});






const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${envs.port}`);
});
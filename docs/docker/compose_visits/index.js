require('dotenv').config();
const express = require("express");
const redis = require("redis");
const http = require("http");

const app = express();
app.use(express.static("public"))



const envs = {
    port: process.env.PORT,
    msg: process.env.msg,
    redisConnectionString: process.env.redisConnectionString,
    proxyUrl: process.env.proxyUrl
};

for (let k in envs) {
    if (!envs[k]) throw new Error(`no ${k}!`);
}

async function createRedisClientAsync() {
    const result = await redis
        .createClient({
            url: envs.redisConnectionString
        })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();

    return result;
}

class RedisRepo {
    constructor(client) {
        this._client = client;
    }

    async getVisitAsync() {
        const val = await this._client.get(RedisRepo._visitKeyName);
        return parseInt(val ?? 0);
    }


    updateVisitAsync(val) {
        return this._client.set(RedisRepo._visitKeyName, val);
    }

    closeAsync() {
        return this._client.disconnect();
    }

    static get _visitKeyName() {
        return "visits"
    }
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
    res.send(envs.msg);
});





app.get("/proxy", async (req, res) => {
    try {
        const data = await getResAsync(envs.proxyUrl);
        res.send(`data: ${data}`);
    } catch (e) {
        res.status(500).send(`error: ${e}`);
    }
});




function responseResult({ message, data, error }) {
    return { message, data, error };
}



app.get("/api/visits", async (req, res) => {
    try {
        const redisClient = await createRedisClientAsync();
        const aRedisRepo = new RedisRepo(redisClient);
        const val = await aRedisRepo.getVisitAsync();
        await aRedisRepo.closeAsync();
        res.json(responseResult({ data: val }));
    } catch (e) {
        res.status(500).json(responseResult({ message: "更新失敗", error: e }));
    }
});

app.post("/api/visits", async (req, res) => {
    try {
        const redisClient = await createRedisClientAsync();
        const aRedisRepo = new RedisRepo(redisClient);
        const val = await aRedisRepo.getVisitAsync();
        await aRedisRepo.updateVisitAsync(val + 1);
        await aRedisRepo.closeAsync();
        res.json(responseResult({ message: "更新成功" }));
    } catch (e) {
        res.status(500).json(responseResult({ message: "更新失敗", error: e }));
    }
});





const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${envs.port}`);
});
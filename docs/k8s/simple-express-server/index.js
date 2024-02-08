const express = require("express");
const http = require("http");

const app = express();


const envs = {
    PORT: process.env.PORT,
    HOSTNAME: process.env.HOSTNAME
};

emptyEnvs = Object.keys(envs).filter(k => !envs[k]);

if (emptyEnvs.length > 0) throw new Error(`no environment variables:${emptyEnvs.join()}!`);

const status = {
    isStartup: false,
    isReady: false,
    isLive: true //不然一startup後馬上判斷not live
};

// 健康檢查函式
function isStartupAsync() {
    return Promise.resolve(status.isStartup);
}

// 健康檢查函式
function isReadyAsync() {
    return Promise.resolve(status.isReady);
}

// 活動檢查函式
function isLiveAsync() {
    return Promise.resolve(status.isLive);
}


app.get("/", (req, res) => {
    res.json({
        port: envs.PORT,
        hostName: envs.HOSTNAME,
    });
});

// 添加健康檢查路由
app.get("/startup", async (req, res) => {
    try {
        const isStartup = await isStartupAsync();
        if (!isStartup) throw new Error();

        res.send("Startup");
    }
    catch (e) {
        res.status(500).send("Not Startup");
    }
});

// 添加健康檢查路由
app.get("/ready", async (req, res) => {
    try {
        const isReady = await isReadyAsync();
        if (!isReady) throw new Error();

        res.send("Ready");
    }
    catch (e) {
        res.status(500).send("Not Ready");
    }
});

// 添加活動檢查路由
app.get("/live", async (req, res) => {
    try {
        const isLive = await isLiveAsync();
        if (!isLive) throw new Error();

        res.send("Live");
    }
    catch (e) {
        res.status(500).send("Not Live");
    }
});

function isTrue(str) {
    return str === "1";
}

// curl 'http://localhost:3000/status?isStartup=1&isReady=1&isLive=1'
app.get("/status", async (req, res) => {
    const { isStartup, isReady, isLive } = req.query;

    if (isStartup != undefined) {
        status.isStartup = isTrue(isStartup);
    }

    if (isReady != undefined) {
        status.isReady = isTrue(isReady);
    }

    if (isLive != undefined) {
        status.isLive = isTrue(isLive);
    }

    res.json(status);
});

const server = http.createServer(app);

const gracefulShutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        console.log("Closed out remaining connections.");
        // 這裡可以添加清理邏輯，比如關閉資料庫連接
        process.exit();
    });

    // 如果在指定時間內服務還沒有關閉，則強制關閉
    setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 10000); // 10秒後強制退出
};

// 監聽終止信號
process.on("SIGINT", gracefulShutdown); //使用者結束
process.on("SIGTERM", gracefulShutdown); //使用工作管理員結束



app.listen(envs.PORT, () => {
    console.log(`Express server is running on http://localhost:${envs.PORT}`);
});



const express = require("express");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

const app = express();
const port = process.argv[2] || 3000;




// 確保 __reqs 資料夾存在
const logsDir = path.join(__dirname, "__reqs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}


// 先設置一個 middleware 捕獲原始請求資料
app.use((req, res, next) => {
    let rawData = "";

    // 這裡動態處理請求的各種資料類型，並儲存原始資料
    req.on("data", chunk => {
        rawData += chunk;  // 接收原始資料
    });

    req.on("end", () => {
        req.rawBody = rawData;  // 把原始資料附加到 req 物件上

        next();  // 繼續處理後續的 middleware 或 route handler
    });
});

// Route handler
app.all("*", (req, res) => {
    const timestamp = moment().format("YYYYMMDD_HHmmss_SSS"); // 取得時間戳記
    const logFileName = `${timestamp}.json`; // JSON 檔案名稱
    const logFilePath = path.join(logsDir, logFileName); // JSON 檔案路徑

    console.log(logFileName);

    // 記錄所有請求的詳細資訊
    const requestInfo = {
        clientIp: req.ip,
        clientPort: req.socket.remotePort,
        path: req.path,
        query: req.query,
        headers: req.headers,
        rawBody: req.rawBody,  // 記錄原始請求資料
    };

    fs.writeFileSync(logFilePath, JSON.stringify(requestInfo, null, 2), "utf-8");

    res.status(200).json(requestInfo);
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// node index.js 3000






/*
curl --request POST 'http://example.com' \
  --form 'name=alice' \
  --form 'age=25' \
  --form 'files=@yourfile.txt'


multipart/form-data

<form action="http://example.com" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" value="alice">
    <input type="text" name="age" value="25">
    <input type="file" name="files" />
    <button type="submit">Submit</button>
</form>


收到
--------------------------d2b5b3e5b5c04d48
Content-Disposition: form-data; name=\"name\"

alice
--------------------------d2b5b3e5b5c04d48
Content-Disposition: form-data; name=\"age\"

25
--------------------------d2b5b3e5b5c04d48--

////////////////////////////////////////////////////////////////////////////////////////

curl --request POST 'http://example.com' \
  --data-urlencode 'name=alice' \
  --data-urlencode 'age=25"' \
  --data-urlencode 'c=d'\''&'
  
application/x-www-form-urlencoded

收到
name=alice&age=25%22&c=d%27%26

////////////////////////////////////////////////////////////////////////////////////////

curl --request POST 'http://example.com' \
  --data-raw 'name=alice&age=25'

或
--data-raw '{
    "name": "alice",
    "age": 5
}'

text/plain或"application/x-www-form-urlencoded


*/




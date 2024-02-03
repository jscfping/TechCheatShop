const express = require("express");

const app = express();


const envs = {
    port: process.env.PORT,
    hostName: process.env.HOSTNAME
};

for (let k in envs) {
    if (!envs[k]) throw new Error(`no ${k}!`);
}



app.get("/", (req, res) => {
    res.send(`i am run in k8s -> ${envs.hostName}:${envs.port}`);
});





const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${envs.port}`);
});
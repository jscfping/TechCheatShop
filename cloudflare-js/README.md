


```bash
npm list --depth=0

npm install -d @aws-sdk/client-s3@3.925.0
npm install -d @aws-sdk/lib-storage@3.925.0
npm install -d dotenv@17.2.3

```

```js
import dotenv from "dotenv";
dotenv.config();

const {
    r2AccessKeyId,
    r2SecretAccessKey,
    accountId,
    d1Token
} = process.env;


const d1 = new MyD1({
    accountId,
    databaseId: "",
    apiToken: d1Token
});


const r2 = new MyR2({
    endpoint: "",
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey
});

```







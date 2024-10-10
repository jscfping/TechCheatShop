const { createApp } = Vue;

createApp({
    data() {
        return {
            srcJsonString: `{
    "results": [
        {
            "_class": "chapter",
            "title": "Intro",
            "object_index": 1
        },
        {
            "_class": "lecture",
            "title": "Overview1",
            "asset": {
                "time_estimation": 5
            },
            "object_index": 1
        },
        {
            "_class": "lecture",
            "title": "Overview2",
            "asset": {
                "time_estimation": 3
            },
            "object_index": 2
        },
        {
            "_class": "chapter",
            "title": "End",
            "object_index": 2
        },
        {
            "_class": "lecture",
            "title": "good bye",
            "asset": {
                "time_estimation": 1
            },
            "object_index": 3
        }
    ]
}`,
            distJsonString: ""
        };
    },
    methods: {
        extractTimeInfo() {
            this.distJsonString = this.getExtractData(this.srcJsonString);
        },
        getExtractData(jsonString) {
            return JSON.parse(jsonString).results.reduce((a, c) => {
                if (c._class === "chapter") return `${a}
${c.object_index}\t${c.title}\t`;

                if (c._class === "lecture") return `${a}
\t\t${c.object_index}\t${c.title}\t${c.asset?.time_estimation}`

                return a;
            }, "chapter\tchapterTitle\tlecture\tlectureTitle\tsecs");
        }
    }
}).mount("#app");
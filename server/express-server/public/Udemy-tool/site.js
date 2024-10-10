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
                "time_estimation": 1200
            },
            "object_index": 1
        },
        {
            "_class": "lecture",
            "title": "Overview2",
            "asset": {
                "time_estimation": 1800
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
                "time_estimation": 600
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
            const data = JSON.parse(jsonString).results;
            const totalSecs = data.reduce((a, c) => a + (c?.asset?.time_estimation ?? 0), 0);

            let subTotalSecs = 0;
            return data.reduce((a, c) => {
                if (c._class === "chapter") return `${a}
${c.object_index}\t${c.title}\t`;

                subTotalSecs += c.asset?.time_estimation ?? 0;

                const subTotalHrs = Math.round(subTotalSecs / 3600 * 100) / 100;
                const remainHrs = Math.round((totalSecs - subTotalSecs) / 3600 * 100) / 100;

                if (c._class === "lecture") return `${a}
\t\t${c.object_index}\t${c.title}\t${c.asset?.time_estimation}\t${subTotalHrs}\t${remainHrs}`

                return a;
            }, `total(hr)\t${Math.round(totalSecs / 3600 * 100) / 100}
chapter\tchapterTitle\tlecture\tlectureTitle\tsecs\tsubTotal(hr)\tremain(hr)`);
        }
    }
}).mount("#app");
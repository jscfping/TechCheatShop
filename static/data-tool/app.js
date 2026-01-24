


const vm = new Vue({
    el: "#app",
    data: {
        loadTime: new Date(),
        unixInput: new Date().getTime(),
        dataA: "",
        dataB: "",
        countsOR: "",
        countsAND: "",
        countsOnlyA: "",
        countsOnlyB: ""
    },
    methods: {
        format: function (date) {
            if (!(date instanceof Date)) return "";
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            const hours = String(date.getUTCHours()).padStart(2, "0");
            const minutes = String(date.getUTCMinutes()).padStart(2, "0");
            const seconds = String(date.getUTCSeconds()).padStart(2, "0");
            const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
        },
        getLoadTimeUnixSecs: function () {
            return Math.floor(this.loadTime.getTime() / 1000);
        },
        getLoadTimeUnixMs: function () {
            return this.loadTime.getTime();
        },
        getTimeIfUnixInputSecs: function () {
            if (!this.unixInput) return "";
            const date = new Date(Number(this.unixInput) * 1000);
            return this.format(date);
        },
        getTimeIfUnixInputMs: function () {
            if (!this.unixInput) return "";
            const date = new Date(Number(this.unixInput));
            return this.format(date);
        },
        runDiff: function () {
            const linesA = this.getLines(this.dataA);
            const linesB = this.getLines(this.dataB);

            const countsA = this.getLinesToCount(linesA);
            const countsB = this.getLinesToCount(linesB);
            this.countsOR = this.countOR(countsA, countsB);
            this.countsAND = this.countAND(countsA, countsB);
            this.countsOnlyA = this.countDiff(countsA, this.countsAND);
            this.countsOnlyB = this.countDiff(countsB, this.countsAND);
        },
        getLines: function (data) {
            const str = data ?? "";
            return str.replaceAll("\r\n", "\n").split("\n").filter(s => (s?.trim() ?? "") !== "");
        },
        /**
         * 
         * @param {string[]} linesData 
         * @returns {object}
         */
        getLinesToCount: function (linesData) {
            const result = linesData
                .reduce((a, c) => {
                    if (a[c] === undefined) a[c] = 0;
                    a[c]++;
                    return a;
                }, {});
            return result;
        },
        getCountsString: function (countsData) {
            return Object.keys(countsData).reduce((a, c) => {
                a = `${a}${c}:${countsData[c]}\n`;
                return a;
            }, "");
        },
        getKeyString: function (countsData) {
            return Object.keys(countsData).join("\n");
        },
        countAND: function (countsDataA, countsDataB) {
            const result = Object.keys(countsDataA).reduce((a, c) => {
                if (countsDataB[c] === undefined) return a;
                a[c] = countsDataA[c] + countsDataB[c];
                return a;
            }, {});
            return result;
        },
        countOR: function (countsDataA, countsDataB) {
            const result = Object.assign({}, countsDataA);
            Object.keys(countsDataB).reduce((a, c) => {
                a[c] = a[c] === undefined
                    ? countsDataB[c]
                    : a[c] + countsDataB[c];
                return a;
            }, result);
            return result;
        },
        countDiff: function (countsData, countsDataDiff) {
            result = Object.keys(countsData).reduce((a, c) => {
                if (countsDataDiff[c]) return a;
                a[c] = countsData[c];
                return a;
            }, {});
            return result;
        }
    }
});



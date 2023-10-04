export class MyArray extends Array {


    Chunk(size) {
        if (!Number.isInteger(size)) {
            throw new TypeError('Size parameter should be an integer.');
        }

        const chunks = [];
        for (let i = 0; i < this.length; i += size) {
            chunks.push(this.slice(i, i + size));
        }
        return chunks;
    }

    Min(selector) {
        if (typeof selector !== 'function') {
            throw new TypeError('Selector should be a function.');
        }
        if (this.length === 0) {
            throw new Error('Cannot get Min value from an empty array.');
        }
        const values = this.map(selector);
        for (const val of values) {
            if (typeof val !== 'number' || isNaN(val) || val === Infinity) {
                throw new TypeError('The result of the selector function should be a finite number for each element.');
            }
        }
        return Math.min(...values);
    }

    Max(selector) {
        if (typeof selector !== 'function') {
            throw new TypeError('Selector should be a function.');
        }
        if (this.length === 0) {
            throw new Error('Cannot get Max value from an empty array.');
        }
        const values = this.map(selector);
        for (const val of values) {
            if (typeof val !== 'number' || isNaN(val) || val === Infinity) {
                throw new TypeError('The result of the selector function should be a finite number for each element.');
            }
        }
        return Math.max(...values);
    }

    Sum(selector) {
        if (typeof selector !== 'function') {
            throw new TypeError('Selector should be a function.');
        }
        if (this.length === 0) return 0;

        const sumValue = this.reduce((acc, el) => acc + selector(el), 0);
        if (typeof sumValue !== 'number' || isNaN(sumValue) || sumValue === Infinity) {
            throw new TypeError('The result of the selector function should be a finite number.');
        }
        return sumValue;
    }

    GroupBy(keySelector) {
        if (typeof keySelector !== 'function') {
            throw new TypeError('Key selector should be a function.');
        }
        const result = {};
        for (let i = 0; i < this.length; i++) {
            const key = keySelector(this[i], i);
            if (typeof key !== 'string') {
                throw new TypeError('The key must be a string.');
            }
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(this[i]);
        }
        return result;
    }


    static createFromArray(arr) {
        return new MyArray(...arr);
    }
}
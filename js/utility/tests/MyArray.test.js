import { expect } from 'chai';
import { MyArray } from '../src/MyArray.js';

describe('MyArray', () => {

    describe('Chunk', () => {
        it('should chunk array into smaller arrays of specified size', () => {
            const myArr = new MyArray(1, 2, 3, 4, 5, 6, 7, 8);
            const chunks = myArr.Chunk(3);
            expect(chunks).to.deep.equal([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8]
            ]);
        });

        it('should throw error if size is not an integer', () => {
            const myArr = new MyArray(1, 2, 3, 4, 5, 6, 7, 8);
            expect(() => myArr.Chunk(2.5)).to.throw();
            expect(() => myArr.Chunk('2')).to.throw();
        });
    });



    describe('Min', () => {
        it('should return the minimum number', () => {
            const myArr = new MyArray(5, 3, 8);
            const min = myArr.Min(el => el);
            expect(min).to.equal(3);
        });

        it('should throw error if result is not a finite number', () => {
            const myArr = new MyArray('5', '3', '8');
            expect(() => myArr.Min(el => el)).to.throw(TypeError, 'The result of the selector function should be a finite number for each element.');
        });

        it('should throw error if selector is not a function', () => {
            const myArr = new MyArray(5, 3, 8);
            expect(() => myArr.Min('not a function')).to.throw(TypeError, 'Selector should be a function.');
        });
    });

    describe('Max', () => {
        it('should return the maximum number', () => {
            const myArr = new MyArray(5, 3, 8);
            const max = myArr.Max(el => el);
            expect(max).to.equal(8);
        });

        it('should throw error if result is not a finite number', () => {
            const myArr = new MyArray('5', '3', '8');
            expect(() => myArr.Max(el => el)).to.throw(TypeError, 'The result of the selector function should be a finite number for each element.');
        });

        it('should throw error if selector is not a function', () => {
            const myArr = new MyArray(5, 3, 8);
            expect(() => myArr.Max('not a function')).to.throw(TypeError, 'Selector should be a function.');
        });
    });

    describe('Sum', () => {
        it('should return the sum of all elements', () => {
            const myArr = new MyArray(5, 3, 8);
            const sum = myArr.Sum(el => el);
            expect(sum).to.equal(16);
        });

        it('should throw error if result is not a finite number', () => {
            const myArr = new MyArray('5', '3', '8');
            expect(() => myArr.Sum(el => el)).to.throw(TypeError, 'The result of the selector function should be a finite number.');
        });

        it('should throw error if selector is not a function', () => {
            const myArr = new MyArray(5, 3, 8);
            expect(() => myArr.Sum('not a function')).to.throw(TypeError, 'Selector should be a function.');
        });

        it('should return 0 for an empty array', () => {
            const myArr = new MyArray();
            const sum = myArr.Sum(el => el);
            expect(sum).to.equal(0);
        });
    });

    describe('GroupBy', () => {
        it('should group elements by a given function', () => {
            const myArr = new MyArray(
                { age: 25, name: "alice" },
                { age: 30, name: "bob" },
                { age: 25, name: "charlie" }
            );

            const grouped = myArr.GroupBy(el => `${el.age}`);

            expect(grouped).to.deep.equal({
                "25": [{ age: 25, name: "alice" }, { age: 25, name: "charlie" }],
                "30": [{ age: 30, name: "bob" }]
            });
        });

        it('should throw error if key is not a string', () => {
            const myArr = new MyArray({ age: 25 }, { age: 30 }, { age: 25 });
            expect(() => myArr.GroupBy(el => el.age)).to.throw(TypeError, 'The key must be a string.');
        });

        it('should throw error if key selector is not a function', () => {
            const myArr = new MyArray({ age: 25 }, { age: 30 }, { age: 25 });
            expect(() => myArr.GroupBy('not a function')).to.throw(TypeError, 'Key selector should be a function.');
        });

        it('should return an empty object for an empty array', () => {
            const myArr = new MyArray();
            const grouped = myArr.GroupBy(el => el.someKey);
            expect(grouped).to.deep.equal({});
        });
    });

    describe('map', () => {
        it('should correctly map over the elements', () => {
            const myArr = new MyArray(1, 2, 3, 4);
            const mappedArray = myArr.map(el => el * 2);
            expect(mappedArray).to.deep.equal([2, 4, 6, 8]);
        });

        it('should throw error if provided argument is not a function', () => {
            const myArr = new MyArray(1, 2, 3, 4);
            expect(() => myArr.map('not a function')).to.throw(TypeError);
        });
    });

    describe('filter', () => {
        it('should correctly filter the elements based on the provided function', () => {
            const myArr = new MyArray(1, 2, 3, 4);
            const filteredArray = myArr.filter(el => el > 2);
            expect(filteredArray).to.deep.equal([3, 4]);
        });

        it('should throw error if provided argument is not a function', () => {
            const myArr = new MyArray(1, 2, 3, 4);
            expect(() => myArr.filter('not a function')).to.throw(TypeError);
        });
    });

    describe('createFromExcel', () => {
        it('should correctly parse tab-separated values', () => {
            const input = 'name\tage\nJohn Doe\t25\nJane Doe\t30';
            const result = MyArray.createFromExcel(input);
            const expected = [
                { name: 'John Doe', age: 25 },
                { name: 'Jane Doe', age: 30 }
            ];
            expect(result).to.deep.equal(expected);
        });

        it('should handle empty strings and trim spaces', () => {
            const input = ' \nname\tage\n John Doe \t 25 \n Jane Doe \t 30 ';
            const result = MyArray.createFromExcel(input);
            const expected = [
                { name: 'John Doe', age: 25 },
                { name: 'Jane Doe', age: 30 }
            ];
            expect(result).to.deep.equal(expected);
        });

        it('should handle strings that are not numbers', () => {
            const input = 'name\tcountry\nJohn\tUSA\nJane\tUK';
            const result = MyArray.createFromExcel(input);
            const expected = [
                { name: 'John', country: 'USA' },
                { name: 'Jane', country: 'UK' }
            ];
            expect(result).to.deep.equal(expected);
        });

        it('should skip empty or whitespace-only lines', function () {
            const input = `
    Header1\tHeader2
    value1\tvalue2
    
    \t\t
    value3\tvalue4
            `;

            const result = MyArray.createFromExcel(input);

            const expected = MyArray.createFromArray([
                { Header1: "value1", Header2: "value2" },
                { Header1: "value3", Header2: "value4" }
            ]);
            expect(result).to.deep.equal(expected);
        });
    });

});
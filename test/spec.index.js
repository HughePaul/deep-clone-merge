'use strict';

require('chai').should();

const deepCloneMerge = require('../');

describe('deepCloneMerge', () => {

    let obj1, obj2;

    beforeEach(() => {
        obj1 = {
            number: 1,
            string: 'abc',
            object: { foo: 'bar' },
            array: [1, 2, 3, 4, 5, 6]
        };

        obj2 = {
            number: 2,
            string: 'def',
            object: { boo: 'baz' },
            array: [7, 8, 9]
        };
    });

    it('should return an empty object by default', () => {
        let result = deepCloneMerge();
        result.should.eql({});
    });

    it('should merge objects together', () => {
        let result = deepCloneMerge(obj1, obj2);

        result.should.eql({
            number: 2,
            string: 'def',
            object: {
                foo: 'bar',
                boo: 'baz'
            },
            array: [7, 8, 9]
        });
    });

    it('clones all values', () => {
        let result = deepCloneMerge(obj1, obj2);

        result.should.not.equal(obj1);
        result.should.not.equal(obj2);
        result.object.should.not.equal(obj1.object);
        result.object.should.not.equal(obj2.object);
        result.array.should.not.equal(obj1.array);
        result.array.should.not.equal(obj2.array);
    });

    it('should return an array if the inout object is an array', () => {
        let result = deepCloneMerge([1, 2, 3]);
        result.should.eql([1, 2, 3]);
    });

});


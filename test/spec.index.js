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

    it('should merge objects together, ignoring null objects', () => {
        let result = deepCloneMerge(obj1, null, obj2, null);

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

    it('should clone a circular object', () => {
        obj1.obj2 = obj2;
        obj2.obj1 = obj1;
        let result = deepCloneMerge(obj1);
        result.obj2.obj1.should.equal(result);
        result.obj2.obj1.obj2.should.equal(result.obj2);
    });

    it('should clone circular objects to the same referenced object', () => {
        obj1.obj2 = obj2;
        obj2.obj1 = obj1;
        let result = deepCloneMerge(obj1);
        result.obj2.obj1.should.equal(result);
        result.obj2.obj1.obj2.should.equal(result.obj2);
    });

    it('should clone repeated objects to the same referenced object', () => {
        obj1.obj2a = obj2;
        obj1.obj2b = obj2;
        let result = deepCloneMerge(obj1);
        result.obj2a.should.equal(result.obj2b);
    });

    it('should clone repeated objects to different objects when using the circular variant', () => {
        obj1.obj2a = obj2;
        obj1.obj2b = obj2;
        let result = deepCloneMerge.circular(obj1);
        result.obj2a.should.not.equal(result.obj2b);
    });
});


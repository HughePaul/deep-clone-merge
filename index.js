'use strict';

let isObject = obj => obj && typeof obj === 'object';

function mergeValue(dest, src) {
    if (Array.isArray(src)) {
        return src.map(val => mergeValue(undefined, val));
    }
    if (isObject(src)) {
        dest = isObject(dest) ? dest : {};
        Object.keys(src).forEach(key => dest[key] = mergeValue(dest[key], src[key]));
        return dest;
    }
    return src;
}

function deepCloneMerge() {
    return [].reduce.call(arguments, mergeValue, {});
}

module.exports = deepCloneMerge;

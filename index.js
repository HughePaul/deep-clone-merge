'use strict';

const RESERVED_OBJECT_KEYS = Object.getOwnPropertyNames(Object.prototype);
let isObject = obj => obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
let isSetOrMap = obj => obj instanceof Set || obj instanceof Map;
let isCollection = obj => isObject(obj) || Array.isArray(obj) || isSetOrMap(obj);

function mergeValue(dest, src, map) {
    if (map && map.has(src)) return map.get(src);

    if (Array.isArray(src)) {
        dest = [];
        if (map) map.set(src, dest);
        src.forEach((val, i) => dest[i] = mergeValue(undefined, val, map));
        return dest;
    }

    if (isObject(src)) {
        dest = isObject(dest) ? dest : {};
        if (map) map.set(src, dest);
        Object.keys(src).forEach(key => {
            if (RESERVED_OBJECT_KEYS.includes(key)) return;
            dest[key] = mergeValue(dest[key], src[key], map);
        });
        return dest;
    }

    if (src instanceof Set) {
        dest = new Set();
        if (map) map.set(src, dest);
        src.forEach(val => dest.add( mergeValue(undefined, val, map) ));
        return dest;
    }

    if (src instanceof Map) {
        dest = (dest instanceof Map) ? dest : new Map();
        if (map) map.set(src, dest);
        src.forEach((value, key) => dest.set(key, mergeValue(dest.get(key), value, map)));
        return dest;
    }

    return src;
}

function deepCloneMergeCircular() {
    let sources = [].filter.call(arguments, isCollection);
    return sources.reduce((dest, src) => mergeValue(dest, src), {});
}

function deepCloneMerge() {
    let map = new WeakMap();
    let sources = [].filter.call(arguments, isCollection);
    return sources.reduce((dest, src) => mergeValue(dest, src, map), {});
}

function deepCloneExtend(dest) {
    let map = new WeakMap();
    let sources = [].slice.call(arguments, 1);
    sources = sources.filter(isCollection);
    return sources.reduce((dest, src) => mergeValue(dest, src, map), dest);
}

deepCloneMerge.circular = deepCloneMergeCircular;
deepCloneMerge.extend = deepCloneExtend;
module.exports = deepCloneMerge;

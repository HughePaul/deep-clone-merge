'use strict';

let isObject = obj => obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
let isObjectOrArray = obj => isObject(obj) || Array.isArray(obj);

function mergeValue(dest, src, map) {
    if (!isObject(src) && !Array.isArray(src)) return src;

    if (map) {
        let index = map.src.indexOf(src);
        if (index >= 0) return map.dest[index];
    }

    if (Array.isArray(src)) {
        dest = [];
        if (map) {
            map.src.push(src);
            map.dest.push(dest);
        }
        src.forEach((val, i) => dest[i] = mergeValue(undefined, val, map));
    } else {
        dest = isObject(dest) ? dest : {};
        if (map) {
            map.src.push(src);
            map.dest.push(dest);
        }
        Object.keys(src).forEach(key => dest[key] = mergeValue(dest[key], src[key], map));
    }

    return dest;
}

function deepCloneMergeCircular() {
    return [].filter.call(arguments, isObjectOrArray).reduce((dest, src) => mergeValue(dest, src), {});
}

function deepCloneMerge() {
    let map = { src: [], dest: [] };
    return [].filter.call(arguments, isObjectOrArray).reduce((dest, src) => mergeValue(dest, src, map), {});
}

deepCloneMerge.circular = deepCloneMergeCircular;
module.exports = deepCloneMerge;

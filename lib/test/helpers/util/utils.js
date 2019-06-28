'use strict';

function isInteger(x) {
    return (typeof x === 'number') && (x % 1 === 0);
}

module.exports.isInteger = isInteger;

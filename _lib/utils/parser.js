"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValue = void 0;
var parseValue = function (value, property) {
    if (property === void 0) { property = 'name'; }
    if (!value) {
        return 'Unknown';
    }
    var match = value.match(/(.*) \((.*)\)/);
    if (!match) {
        return value;
    }
    if (property === 'name') {
        return match[1];
    }
    return match[2];
};
exports.parseValue = parseValue;

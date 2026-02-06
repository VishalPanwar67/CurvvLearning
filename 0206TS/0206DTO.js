"use strict";
// 1. Define Enums for fixed values
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogResponseDto = exports.CreateLogDTO = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var CreateLogDTO = /** @class */ (function () {
    function CreateLogDTO(message, level, traceId, metadata) {
        this.message = message;
        this.level = level;
        this.traceId = traceId;
        this.metadata = metadata;
    }
    return CreateLogDTO;
}());
exports.CreateLogDTO = CreateLogDTO;
var LogResponseDto = /** @class */ (function () {
    function LogResponseDto(success, data, count) {
        this.success = success;
        this.data = data;
        this.count = count;
    }
    return LogResponseDto;
}());
exports.LogResponseDto = LogResponseDto;

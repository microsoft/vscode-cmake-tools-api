/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCMakeToolsApi = exports.ConfigurationType = exports.UIElement = exports.Version = void 0;
const vscode = require("vscode");
/**
 * API version information.
 */
var Version;
(function (Version) {
    Version[Version["v1"] = 1] = "v1";
    Version[Version["v2"] = 2] = "v2";
    Version[Version["v3"] = 3] = "v3";
    Version[Version["latest"] = 3] = "latest";
})(Version = exports.Version || (exports.Version = {}));
var UIElement;
(function (UIElement) {
    UIElement[UIElement["StatusBarLaunchButton"] = 0] = "StatusBarLaunchButton";
    UIElement[UIElement["StatusBarDebugButton"] = 1] = "StatusBarDebugButton";
})(UIElement = exports.UIElement || (exports.UIElement = {}));
var ConfigurationType;
(function (ConfigurationType) {
    ConfigurationType[ConfigurationType["Kit"] = 0] = "Kit";
    ConfigurationType[ConfigurationType["ConfigurePreset"] = 1] = "ConfigurePreset";
    ConfigurationType[ConfigurationType["BuildPreset"] = 2] = "BuildPreset";
})(ConfigurationType = exports.ConfigurationType || (exports.ConfigurationType = {}));
/**
 * Helper function to get the CMakeToolsApi from the CMake Tools extension.
 * @param desiredVersion The desired API version.
 * @param exactMatch If true, the version must match exactly. Otherwise, the
 * function will attempt to return the requested version, but it may not match
 * exactly.
 * @returns The API object, or undefined if the API is not available.
 */
function getCMakeToolsApi(desiredVersion, exactMatch = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const extension = vscode.extensions.getExtension('ms-vscode.cmake-tools');
        if (!extension) {
            console.warn('[vscode-cmake-tools-api] CMake Tools extension is not installed.');
            return undefined;
        }
        let exports;
        if (!extension.isActive) {
            try {
                // activate() may throw if VS Code is shutting down.
                exports = yield extension.activate();
            }
            catch (_a) { }
        }
        else {
            exports = extension.exports;
        }
        if (!exports || !exports.getApi) {
            console.warn('[vscode-cmake-tools-api] CMake Tools extension does not provide an API.');
            return undefined;
        }
        const api = exports.getApi(desiredVersion);
        if (desiredVersion !== api.version) {
            if (exactMatch) {
                console.warn(`[vscode-cmake-tools-api] CMake Tools API version ${desiredVersion} is not available.`);
                return undefined;
            }
            else {
                console.warn(`[vscode-cmake-tools-api] CMake Tools API version ${desiredVersion} is not available. Using ${api.version}.`);
            }
        }
        return api;
    });
}
exports.getCMakeToolsApi = getCMakeToolsApi;

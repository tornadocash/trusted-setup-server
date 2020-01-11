/* tslint:disable */
/* eslint-disable */
/**
*/
export function test1(): void;
/**
* @param {Uint8Array} params 
*/
export function test2(params: Uint8Array): void;
/**
* @param {Uint8Array} params 
* @returns {Uint8Array} 
*/
export function contribute(params: Uint8Array): Uint8Array;

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path?: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        
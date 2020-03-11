/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} params 
* @param {Uint8Array} entropy 
* @returns {Uint8Array} 
*/
export function contribute(params: Uint8Array, entropy: Uint8Array): Uint8Array;

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path?: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        
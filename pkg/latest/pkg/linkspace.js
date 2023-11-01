import * as wasm from "./linkspace_bg.wasm";
import { __wbg_set_wasm } from "./linkspace_bg.js";
__wbg_set_wasm(wasm);
export * from "./linkspace_bg.js";

wasm.__wbindgen_start();

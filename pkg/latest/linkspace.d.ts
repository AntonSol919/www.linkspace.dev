/* tslint:disable */
/* eslint-disable */
/**
*/
export function main(): void;
/**
* @param {any} data
* @returns {Pkt}
*/
export function lk_datapoint(data: any): Pkt;
/**
* @returns {SigningKey}
*/
export function lk_keygen(): SigningKey;
/**
* @param {SigningKey} key
* @param {Uint8Array} password
* @returns {string}
*/
export function lk_key_encrypt(key: SigningKey, password: Uint8Array): string;
/**
* @param {string} id
* @returns {Uint8Array}
*/
export function lk_key_pubkey(id: string): Uint8Array;
/**
* @param {string} id
* @param {Uint8Array} password
* @returns {SigningKey}
*/
export function lk_key_decrypt(id: string, password: Uint8Array): SigningKey;
/**
* @param {any} data
* @param {any} fields
* @returns {Pkt}
*/
export function lk_linkpoint(data: any, fields: any): Pkt;
/**
* @param {SigningKey} key
* @param {any} data
* @param {any} fields
* @returns {Pkt}
*/
export function lk_keypoint(key: SigningKey, data: any, fields: any): Pkt;
/**
* @param {Pkt} pkt
* @param {boolean | undefined} allow_private
* @returns {Uint8Array}
*/
export function lk_write(pkt: Pkt, allow_private?: boolean): Uint8Array;
/**
* @param {string} expr
* @param {Pkt | undefined} pkt
* @param {Iterator<any> | undefined} argv
* @param {boolean | undefined} loose
* @returns {Uint8Array}
*/
export function lk_eval(expr: string, pkt?: Pkt, argv?: Iterator<any>, loose?: boolean): Uint8Array;
/**
* @param {string} expr
* @param {Pkt | undefined} pkt
* @param {Iterator<any> | undefined} argv
* @param {boolean | undefined} loose
* @returns {string}
*/
export function lk_eval2str(expr: string, pkt?: Pkt, argv?: Iterator<any>, loose?: boolean): string;
/**
* @param {Uint8Array} bytes
* @param {boolean | undefined} mini
* @returns {string}
*/
export function b64(bytes: Uint8Array, mini?: boolean): string;
/**
* @param {Uint8Array} bytes
* @param {string | undefined} options
* @returns {string}
*/
export function lk_encode(bytes: Uint8Array, options?: string): string;
/**
* @param {Uint8Array} bytes
* @returns {Uint8Array}
*/
export function blake3_hash(bytes: Uint8Array): Uint8Array;
/**
* @returns {Uint8Array}
*/
export function now(): Uint8Array;
/**
* @returns {string}
*/
export function build_info(): string;

/**
* @param {Uint8Array} bytes
* @param {boolean | undefined} validate
* @returns {[Pkt,Uint8Array]}
*/
export function lk_read(bytes: Uint8Array, validate?: boolean): [Pkt,Uint8Array];



/**
* @param {Uint8Array} bytes
* @param {boolean | undefined} validate
* @returns {[Pkt,Uint8Array]}
*/
export function lk_read_unchecked(bytes: Uint8Array, validate?: boolean): [Pkt,Uint8Array];


/**
*/
export class CONSTS {
  free(): void;
/**
*/
  static readonly PRIVATE: Uint8Array;
/**
*/
  static readonly PUBLIC: Uint8Array;
}
/**
*/
export class JsErr {
  free(): void;
/**
* @returns {any}
*/
  toJSON(): any;
/**
* @returns {string}
*/
  toString(): string;
}
/**
* Link for a linkpoint
*/
export class Link {
  free(): void;
/**
* @param {any} tag
* @param {any} ptr
*/
  constructor(tag: any, ptr: any);
/**
* @returns {any}
*/
  toJSON(): any;
/**
* @returns {any}
*/
  toAbeJSON(): any;
/**
* @returns {string}
*/
  toString(): string;
/**
* @returns {string}
*/
  toHTML(): string;
/**
*/
  readonly ptr: Uint8Array;
/**
*/
  readonly tag: Uint8Array;
}
/**
*/
export class LinkRes {
  free(): void;
/**
*/
  done: boolean;
/**
*/
  value?: Link;
}
/**
*/
export class Links {
  free(): void;
/**
* @returns {Links}
*/
  as_iter(): Links;
/**
* @returns {Links}
*/
  static empty(): Links;
/**
* @returns {LinkRes}
*/
  next(): LinkRes;
}
/**
*/
export class Pkt {
  free(): void;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {boolean | undefined} include_lossy_escaped_data
* @returns {string}
*/
  toHTML(include_lossy_escaped_data?: boolean): string;
/**
* @returns {string}
*/
  get_data_str(): string;
/**
* @returns {Array<any> | undefined}
*/
  comp_list(): Array<any> | undefined;
/**
* @returns {Array<any>}
*/
  links_array(): Array<any>;
/**
* @returns {Uint8Array | undefined}
*/
  links_bytes(): Uint8Array | undefined;
/**
*/
  readonly comp0: Uint8Array;
/**
*/
  readonly comp1: Uint8Array;
/**
*/
  readonly comp2: Uint8Array;
/**
*/
  readonly comp3: Uint8Array;
/**
*/
  readonly comp4: Uint8Array;
/**
*/
  readonly comp5: Uint8Array;
/**
*/
  readonly comp6: Uint8Array;
/**
*/
  readonly comp7: Uint8Array;
/**
*/
  readonly create: Uint8Array | undefined;
/**
* data
*/
  readonly data: Uint8Array;
/**
*/
  readonly depth: number | undefined;
/**
*/
  readonly domain: Uint8Array | undefined;
/**
*/
  readonly group: Uint8Array | undefined;
/**
*/
  readonly hash: Uint8Array;
/**
*/
  readonly links: Links;
/**
*/
  readonly pkt_type: number;
/**
*/
  readonly pubkey: Uint8Array | undefined;
/**
*/
  readonly recv: Uint8Array | undefined;
/**
*/
  readonly rooted_spacename: Uint8Array | undefined;
/**
*/
  readonly signature: Uint8Array | undefined;
/**
*/
  readonly size: number;
/**
*/
  readonly spacename: Uint8Array | undefined;
}
/**
*/
export class SigningKey {
  free(): void;
/**
*/
  readonly pubkey: Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_consts_free: (a: number) => void;
  readonly consts_PUBLIC: (a: number) => void;
  readonly consts_PRIVATE: (a: number) => void;
  readonly __wbg_pkt_free: (a: number) => void;
  readonly pkt_toString: (a: number, b: number) => void;
  readonly pkt_toHTML: (a: number, b: number, c: number) => void;
  readonly pkt_pkt_type: (a: number) => number;
  readonly pkt_hash: (a: number, b: number) => void;
  readonly pkt_get_data_str: (a: number, b: number) => void;
  readonly pkt_data: (a: number, b: number) => void;
  readonly pkt_domain: (a: number, b: number) => void;
  readonly pkt_create: (a: number, b: number) => void;
  readonly pkt_group: (a: number, b: number) => void;
  readonly pkt_spacename: (a: number, b: number) => void;
  readonly pkt_rooted_spacename: (a: number, b: number) => void;
  readonly pkt_recv: (a: number, b: number) => void;
  readonly pkt_comp0: (a: number, b: number) => void;
  readonly pkt_comp1: (a: number, b: number) => void;
  readonly pkt_comp2: (a: number, b: number) => void;
  readonly pkt_comp3: (a: number, b: number) => void;
  readonly pkt_comp4: (a: number, b: number) => void;
  readonly pkt_comp5: (a: number, b: number) => void;
  readonly pkt_comp6: (a: number, b: number) => void;
  readonly pkt_comp7: (a: number, b: number) => void;
  readonly pkt_comp_list: (a: number) => number;
  readonly pkt_pubkey: (a: number, b: number) => void;
  readonly pkt_signature: (a: number, b: number) => void;
  readonly pkt_depth: (a: number) => number;
  readonly pkt_size: (a: number) => number;
  readonly pkt_links: (a: number) => number;
  readonly pkt_links_array: (a: number) => number;
  readonly pkt_links_bytes: (a: number) => number;
  readonly __wbg_links_free: (a: number) => void;
  readonly __wbg_linkres_free: (a: number) => void;
  readonly __wbg_get_linkres_done: (a: number) => number;
  readonly __wbg_set_linkres_done: (a: number, b: number) => void;
  readonly __wbg_get_linkres_value: (a: number) => number;
  readonly __wbg_set_linkres_value: (a: number, b: number) => void;
  readonly links_as_iter: (a: number) => number;
  readonly links_empty: () => number;
  readonly links_next: (a: number) => number;
  readonly __wbg_link_free: (a: number) => void;
  readonly link_new: (a: number, b: number, c: number) => void;
  readonly link_toJSON: (a: number, b: number) => void;
  readonly link_toAbeJSON: (a: number, b: number) => void;
  readonly link_toHTML: (a: number, b: number) => void;
  readonly link_ptr: (a: number, b: number) => void;
  readonly link_tag: (a: number, b: number) => void;
  readonly __wbg_jserr_free: (a: number) => void;
  readonly jserr_toJSON: (a: number) => number;
  readonly jserr_toString: (a: number, b: number) => void;
  readonly main: () => void;
  readonly lk_datapoint: (a: number, b: number) => void;
  readonly __wbg_signingkey_free: (a: number) => void;
  readonly signingkey_pubkey: (a: number, b: number) => void;
  readonly lk_keygen: () => number;
  readonly lk_key_encrypt: (a: number, b: number, c: number, d: number) => void;
  readonly lk_key_pubkey: (a: number, b: number, c: number) => void;
  readonly lk_key_decrypt: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly lk_linkpoint: (a: number, b: number, c: number) => void;
  readonly lk_keypoint: (a: number, b: number, c: number, d: number) => void;
  readonly lk_write: (a: number, b: number, c: number) => void;
  readonly lk_read: (a: number, b: number, c: number) => void;
  readonly lk_read_unchecked: (a: number, b: number, c: number) => void;
  readonly lk_eval: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly lk_eval2str: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly b64: (a: number, b: number, c: number, d: number) => void;
  readonly lk_encode: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly blake3_hash: (a: number, b: number, c: number) => void;
  readonly now: (a: number) => void;
  readonly build_info: (a: number) => void;
  readonly link_toString: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

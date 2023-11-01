/* tslint:disable */
/* eslint-disable */
/**
* @returns {LkConsts}
*/
export function get_consts(): LkConsts;
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
* @param {Uint8Array} bytes
* @param {boolean | undefined} mini
* @returns {string}
*/
export function b64(bytes: Uint8Array, mini?: boolean): string;
/**
* @param {Uint8Array} bytes
* @param {string} _ignored
* @returns {string}
*/
export function lk_encode(bytes: Uint8Array, _ignored: string): string;
/**
* @param {Uint8Array} bytes
* @returns {Uint8Array}
*/
export function blake3_hash(bytes: Uint8Array): Uint8Array;
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
export function lk_read(bytes: Uint8Array, validate?: boolean): [Pkt,Uint8Array];


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
  static empty(): Links;
/**
* @returns {LinkRes}
*/
  next(): LinkRes;
}
/**
*/
export class LkConsts {
  free(): void;
/**
*/
  readonly PUBLIC: Uint8Array;
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
  readonly obj: object;
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

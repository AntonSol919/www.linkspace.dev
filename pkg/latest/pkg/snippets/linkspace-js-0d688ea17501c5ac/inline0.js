
export function identity(a) { return a }
export function set_iter(obj) {
     obj[Symbol.iterator] = function () { return this };
};
export function pkt_obj(pkt){
if (pkt.data == undefined) { console.error("BUG: - the packet was deallocated?");}
return { group: pkt.group, domain:pkt.domain, spacename:pkt.spacename, links:pkt.links_bytes(), create:pkt.create}
};

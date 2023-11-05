import init, {
    lk_keygen,
    lk_key_encrypt,
    lk_key_decrypt,

    lk_datapoint,
    lk_linkpoint,
    lk_keypoint,
    
    lk_write,
    lk_read,
    
    lk_eval2str,
    build_info,
    b64,
    Link,
    CONSTS
}  from '/pkg/latest/linkspace.js';

let binfo;
function getBrowserInfo(){
    let timeInfo = Intl.DateTimeFormat().resolvedOptions();
    return {
        "build_info": build_info(),
        "userAgent": window.navigator.userAgent,
        "href": window.location.href,
        "locale": timeInfo.locale,
        "timeZone": timeInfo.timeZone,
    };
}

async function go(){
    let wasm = await init();
    let enckey = localStorage.getItem('lk_key');
    let key = enckey ? lk_key_decrypt(enckey,localStorage.getItem('lk_password') || "") : lk_keygen();
    if (enckey == null) { localStorage.setItem('lk_key', lk_key_encrypt(key,''));}
    let group = lk_datapoint(window.location.origin).hash;
    let loc = window.location;
    let space = [loc.hostname].concat(loc.pathname.split("/").filter(e => e));
    let domain = "web-tracking";
    let links = [];

        function newPkt(event,rest = {},extra_links=[]) {
        let msg = {"event": event, ...rest };
        return lk_keypoint(
            key,
            JSON.stringify(msg),
            { group, space, domain, links: links.concat(extra_links)}
        );
    }
    function logPkt(pkt){
        fetch("https://ws.alinkspace.org/log", { method: "POST", body: lk_write(pkt)}); 
    }

    let sentinal = await fetch("https://ws.alinkspace.org/local-pkts/sentinal");
    let bytes = new Uint8Array(await sentinal.arrayBuffer());
    let [sentinalPkt,_rest] = lk_read(bytes);
    console.log(sentinalPkt.toString());
    links.push(new Link("serverSentinal",sentinalPkt.hash));



    if(!localStorage.getItem("KeyInitHash")){
        let browserInfo = getBrowserInfo();
        let pkt = newPkt("KeyInit",browserInfo);
        logPkt(pkt);
        localStorage.setItem("KeyInitHash",b64(pkt.hash));
    }
    links.push(new Link("KeyInit", localStorage.getItem("KeyInitHash")));

    if (!sessionStorage.getItem("SessionInitHash")){
        let browserInfo = getBrowserInfo();
        let pkt = newPkt("SessionInit", browserInfo);
        logPkt(pkt);
        sessionStorage.setItem("SessionInitHash", b64(pkt.hash));
    }
    links.push(new Link("SessionInit", sessionStorage.getItem("SessionInitHash")));

    function lkq(event,rest = {},extra_links=[]){
        let pkt = newPkt(event, rest,extra_links);
        logPkt(pkt);
        return pkt.hash;
    }
    
    let thisPage = await fetch(window.location);
    let body = new Uint8Array(await thisPage.arrayBuffer());
    let partialPageBody = lk_datapoint(body.slice(0, 64000));
    let pageRunHash = lkq(
        "PageRun",
        {"location":window.location.href},
        [new Link("partialPageBody",partialPageBody.hash)]
    );
    links.push(new Link("PageRun",pageRunHash));
    
    window.document.addEventListener("scroll", () => lkq("PageScroll"), { 'once': true });
    function pageReadEvent(seconds) {
        setTimeout(() => lkq("PageRead", { seconds }), seconds * 1000);
    }
    setTimeout(() => lkq("PageView"), 2000);
    pageReadEvent(10);
    pageReadEvent(30);
    pageReadEvent(60);
    pageReadEvent(120);
    pageReadEvent(300);
    pageReadEvent(600);

}

go();

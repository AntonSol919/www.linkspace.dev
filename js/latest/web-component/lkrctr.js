import init, {
    b64,
    lkr_save_all,
    lkr_get,
    lk_deserialize_unchecked,
    lk_serialize_view_array,
    lk_serialize_view,
    lk_deserialize,
    lkq_new,
    lkr_open_inmem,
    lkr_split,
    lkr_await_write,
    lkr_process,
    lkr_watch,
} from '../linkspace.js/linkspace.js';

class RuntimeCtr extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).innerHTML += `
<fieldset>
<legend>Database (<span id="elk-total-points">0</span>) </legend>
<span class="status"></span>
          <button id="elk-clear-idb">Clear Browser DB</button>
          <button id="elk-log-download">Download Browser</button>
          <label for="elk-log-stream">Stream</label>
          <input id="elk-log-stream" name="elk-log-stream" type="file" />
          <label for="elk-log-inputs">Load Files</label>
          <input
            id="elk-log-inputs"
            name="elk-log-inputs"
            type="file"
            multiple
          />
      </fieldset>
`;
    }

    init(lkr, indexeddb = true) {
        lkr = lkr || window.lkr || lkr_open_inmem();
        this.lkr = lkr;
        if (!window.lkr) window.lkr = lkr;
        
        let ev = new CustomEvent("lkr_open", {
            detail: lkr
        });
        this.dispatchEvent(ev);
        if(indexeddb) this.setupIndexedDB();
        return lkr;
    }
    async setupIndexedDB(){

        let $$ = this.shadowRoot.querySelector.bind(this.shadowRoot);


        let db = await indexeddb();
        db.onerror = (event) =>
            console.error(`Uncaught db error: ${event.target.error}`);
        readIndexedDB(db, lkr);
        let counter = $$("#elk-total-points");
        writeIndexedDB(db, lkr, (c) => counter.innerText = c);

        $$("#elk-clear-idb").addEventListener("click", () => {
            confirm("Destroy the local db?") && clearIndexedDB();
            counter.innerText = 0;
        });

        $$("#elk-log-inputs").addEventListener("input", async (e) => {
            for (let file of e.target.files) {
                const body = await file.arrayBuffer();
                const name = file.name;
                let buf = new Uint8Array(body);
                try {
                    let points = [];
                    while (buf.length != 0) {
                        let [point, nr] = lk_deserialize(buf);
                        buf = nr;
                        points.push(point);
                    }
                    let c = lkr_save_all(lkr, points);
                    console.log("Read ", c, " new packets from ", name);
                } catch (e) {
                    console.error("Can't read ", name, e.stack());
                }
            }
        });

        $$("#elk-log-download").addEventListener("click", (e) => download(lkr));
        return this.lkr;
    }
}



customElements.define('elk-lkrctr', RuntimeCtr);


function clearIndexedDB() {
    return new Promise((acc, rej) => {
        const request = window.indexedDB.deleteDatabase("lkv_plog");
        request.onerror = rej;
        request.onsuccess = (e) => acc(e.target.result);
    });
}

function indexeddb() {
    return new Promise(async (acc, rej) => {
        // if (confirm("Delete?")) await clearIndexedDB();
        const request = window.indexedDB.open("lkv_plog", 1);
        request.onerror = rej;
        request.onupgradeneeded = (event) => {
            event.target.result.createObjectStore("points");
        };
        request.onsuccess = (e) => acc(e.target.result);
    });
}

function writeIndexedDB(db, lk_origin, forEach = () => {}) {
    let count = 0;
    let lk = lkr_split(lk_origin);
    let q = lkq_new(":watch indexeddb");
    lkr_watch(lk, q, (point) => {
        // TODO add ubits4 check for new packet or not
        db.transaction("points", "readwrite")
            .objectStore("points")
            .put(lk_serialize_view(point, false), b64(point.hash));
        count += 1;
        forEach(count, point);
    });
    (async () => {
        while (true) {
            await lkr_await_write(lk);
            lkr_process(lk);
        }
    })();
}

function readIndexedDB(db, lk_origin) {
    let lk = lkr_split(lk_origin);
    return new Promise((accept, rej) => {
        const trans = db.transaction("points", "readonly");
        const objStore = trans.objectStore("points");
        const cursor = objStore.openCursor(undefined, "nextunique");
        let lst = [];
        cursor.onsuccess = (event) => {
            const cursor = event.target.result;
            if (!cursor || lst.length >= 32) {
                lkr_save_all(lk, lst);
                lst = [];
            }
            if (cursor) {
                let [point, _] = lk_deserialize_unchecked(
                    cursor.value,
                    true,
                    true,
                );
                lst.push(point);
                return cursor.continue();
            }
            return accept();
        };
        cursor.onerror = rej;
    });
}

function download(lkr) {
    const a = document.createElement("a");
    let blobs = [];
    lkr_process(lkr);
    lkr_get(lkr, lkq_new(":get log-asc"), (point) =>
        lk_serialize_view_array(point, false)
        .forEach((p) => blobs.push(p)),
    );
    if (blobs.length == 1) {
        return alert("empty");
    }
    const blob = new Blob(blobs, {
        type: "application/lks"
    });
    const url = URL.createObjectURL(blob);
    a.setAttribute("href", url);
    a.setAttribute("download", `log-${new Date()}.lks`);
    a.click();
}

async function fileStream(
    lkr,
    name = "linkspace.lks",
    read = false,
    live = false,
    keep = true,
) {
    let file = await window.showSaveFilePicker({
        id: "linkspace",
        startIn: "documents",
        suggestedName: name,
    });
    const readhandle = await file.getFile();
    const size = readhandle.size;

    if (read) {
        const logBytes = await readhandle.arrayBuffer();
        const buf = new Uint8Array(logBytes);
        let points = [];
        while (buf.length != 0) {
            let [point, nr] = lk_deserialize(buf);
            buf = nr;
            points.push(point);
        }
        let c = lkr_save_all(lkr, points);
        console.log("Read", c, "from log");
    }

    let writeable = await file.createWritable({
        keepExistingData: keep,
    });
    if (keep) {
        writeable.seek();
    }
    let stream_lk = lkr_split(lkr);
    lkr_get(stream_lk, lkq_new(":get log-asc"), (point) =>
        file.write(lk_serialize_view(point, false)),
    );
    if (live) {
        let q = lkq_new(":watch save2file");
        try {
            let buf = [];
            lkr_watch(lkr, q, (point) => {
                buf.push(point);
            });
            while (true) {
                for (let point of buf) {
                    await file.write(lk_serialize_view(point, false));
                }
                buf = [];
                if (file.flush) await file.flush();
                await lkr_await_write(stream_lk);
                lkr_process(stream_lk);
            }
        } catch (e) {
            console.error("Can't save to disk", e);
        }
    }
}

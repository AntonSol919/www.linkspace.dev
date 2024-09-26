
import { lka_eval ,lkr_split} from '../linkspace.js/linkspace.js';
import AnyhostClient from "../anyhost.exchange/anyhost.client.js";
class Exchange extends HTMLElement {
    setRuntime(lkr) {
        this.lkr = lkr;
        this.enable();
    }
    setKey(key) {
        this.key = key;
        this.enable();
    }
    enable() {
        if (!this.key || !this.lkr) return;
        this.$$("button").disabled = false;
    }
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).innerHTML += `
            <fieldset style="display:grid;grid-template-columns: 8rem max-content;">
<legend>Exchange</legend>
<span class="status"></span><div></div>
<label for="group-expr">Group</label>
<span>[<input name="group-expr" />]</span>
<label for="host">Host</label>
<input name="host"/>
<label for="pass">Pass</label>
<input name="pass" placeholder="Optional shared password"/>
<button type="submit" disabled>Connect</button>
<span id="ws-state"></span>
</fieldset>
`;
        const sp = new URLSearchParams(window.location.search);
        this.$$ = this.shadowRoot.querySelector.bind(this.shadowRoot);

        this.$$("[name='host']").value = sp.get("host") || window.location.hostname;
        this.$$("[name='pass']").value = sp.get("pass");
        this.$$("[name='group-expr']").value = sp.get("group") || "#:test";
        this.$$("button").addEventListener("click",()=>this.try_setup_exchange());
    }
    async try_setup_exchange() {
        this.$$("button").disabled = true;
        try {
            return await this.setup_exchange();
        } catch (e) {
            this.$$("button").disabled = false;
            this.dispatchEvent(new CustomEvent("elk-error", { composed: true, bubbles: true, detail: "could not connect: " + (e.message || e) }));
            throw e;
        }
    }
    async setup_exchange() {
        let host = this.$$("[name='host']").value;
        let groupExpr = this.$$("[name='group-expr']").value;
        let group = lka_eval("[" + groupExpr + "]");
        let pass = this.$$("[name='pass']").value;
        if (/:\d+$/.test(host) == false) host += ":5020";
        if (/^\w:\/\/.+/.test(host) == false) {
            let isHttps = window.location.protocol == "https:" ? "s" : "";
            host = `ws${isHttps}://` + host;
        }
        this.connection = new AnyhostClient(this.lkr,this.key);
        this.connection.addEventListener("state", (e) => {
            this.$$("#ws-state").innerText = e.detail;
        });
        await this.connection.connect(host);
        this.connection.exchange(group);
        this.dispatchEvent(new CustomEvent("exchange", { composed: true, bubbles: true, detail: {group,host,key:this.key,lkr:lkr_split(this.lkr)}}));
    }
}

customElements.define('elk-exchange', Exchange);

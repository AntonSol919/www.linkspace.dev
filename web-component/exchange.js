import { b64, lka_eval, lkr_split } from "../linkspace.js/linkspace.js";
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
    this.btn.disabled = false;
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    }).innerHTML += /* HTML */ `
      <fieldset style="display:grid;grid-template-columns: 8rem max-content;">
        <legend>Exchange</legend>
        <span class="status"></span>
        <div></div>
        <label for="group-expr">Group</label>
        <span>[<input name="group-expr" />]</span>
        <label for="host">Host</label>
        <input name="host" />
        <label for="pass">Pass</label>
        <input name="pass" placeholder="Optional shared password" />
        <button type="submit" disabled>Connect</button>
        <span id="ws-state"></span>
      </fieldset>
    `;
    const sp = new URLSearchParams(window.location.search);
    this.$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
      this.btn = this.$("button");

      this.inpEl("host").value = sp.get("host") || window.location.hostname;
      this.inpEl("pass").value = sp.get("pass");
      this.inpEl("group-expr").value = sp.get("group") || "#:test";
      this.btn.onclick = () =>this.try_setup_exchange();
  }
    inpEl(name){
        return this.$(`[name='${name}']`);
    }

  async try_setup_exchange() {
    this.btn.disabled = true;
    try {
      return await this.setup_exchange();
    } catch (e) {
      this.dispatchEvent(cev("error", "could not connect " + (e.message || e)));
    }finally{
        this.btn.disabled = false;
    }
  }
  async setup_exchange() {
      let host = this.inpEl('host').value;
      let groupExpr = this.inpEl('group-expr').value;
      let pass = this.inpEl('pass').value;
    let group = lka_eval("[" + groupExpr + "]");
    if (/:\d+$/.test(host) == false) host += ":5017";
    if (/^\w:\/\/.+/.test(host) == false) {
      let isHttps = window.location.protocol == "https:" ? "s" : "";
      host = `ws${isHttps}://` + host;
    }
    this.conn = { group, host, key: this.key, lkr: lkr_split(this.lkr), groupExpr };
    this.connection = new AnyhostClient(this.lkr, this.key);
    this.connection.addEventListener("next-stage", (ev) => {
      this.$("#ws-state").innerText = ev.detail[0];
    });
    await this.connection.connect(host);
    this.connection.exchange(group);
    this.dispatchEvent(
        cev("exchange", { group, host, key: this.key, lkr: lkr_split(this.lkr) , groupExpr}),
    );
    this.dispatchEvent(cev("next-stage", ["exchange", groupExpr + " @ " + host ]));

    this.btn.innerText ="disconnect";
    this.btn.onclick = ()=> this.disconnect();
  }
  async disconnect(){
      this.dispatchEvent(cev("next-stage", ["disconnected", this.conn.groupExpr + " @ " + this.conn.host ]));
      this.btn.innerText = "Connect";
      delete this.conn;
      try{
          this.connection.ws.close();
      }catch(e){}
      delete this.connection;
      this.$("#ws-state").innerText = "";
 }
}

customElements.define("lkwc-exchange", Exchange);
function cev(name, detail) {
  return new CustomEvent(name, { composed: true, bubbles: true, detail });
}


import init,{
    CONSTS,
    lkr_save
} from "../linkspace.js/linkspace.js";
await init();

import "./identity.js";
import "./lkrctr.js";
import "./exchange.js";
import "./point-builder.js";
import "./runtime-inspect.js";

class WebInit extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).innerHTML = `<div>
<dialog id="elk-web-init" style="z-index:99">
      <p id="elk-status-el"></p>

      <button id="elk-logon">Log On</button
      ><input type="password" id="key-pass" placeholder="Secret" />

      <details open>
        <summary>options</summary>


<fieldset>
<legend>identity</legend>
        <elk-identity></elk-identity>
</fieldset>

        <elk-exchange></elk-exchange>

        <details >
          <summary>advanced</summary>
          <elk-lkrctr></elk-lkrctr>
<fieldset>
<legend>Point Builder</legend>
          <elk-point-builder></elk-point-builder>
</fieldset>
          <elk-runtime-inspect></elk-runtime-inspect>
        </details>

        <span id="elk-build-info">Loading</span>
      </details>

      <style>
        #elk-web-init {
          color: rgba(0, 0, 0, 0.8);
          font-size: 0.8rem;
          display: flex;
          flex-flow: column;
          align-items: center;
          line-height: 2;

          & #elk-auto-logon {
            margin: 2rem;
          }
          & div {
            display: flex;
            flex-flow: column;
          }
        }
        .code {
          font-family:
            SFMono-Regular,
            Consolas,
            Liberation Mono,
            Menlo,
            monospace;
        }
      </style>
    </dialog>
${CONSTS.MARK_SVG}

</div>`;

        let $$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
        let logo = $$("svg");
        let dialog = $$("dialog");
        logo.style.width = "32px";
        logo.style.height = "32px";
        logo.style.left = "4px";
        logo.style.bottom = "4px";
        logo.style.position = "fixed";

        logo.onclick = () => dialog.showModal();

        let lkrEl = $$("elk-lkrctr");
        let idEl = $$("elk-identity");
        let exEl = $$("elk-exchange");
        let builderEl = $$("elk-point-builder");
        let inspectEl = $$("elk-runtime-inspect");

        idEl.mirrorSecretInput($$("#key-pass"));
        lkrEl.addEventListener("lkr_open", (e) => console.log("lkr_open", e));
        builderEl.addEventListener("point", (e) => {
            lkr_save(lkrEl.lkr, e.detail);
        });
        idEl.addEventListener("unlock", (e) => {
            exEl.setKey(e.detail);
            builderEl.setKey(e.detail);
        });

        $$("#elk-build-info").innerText = CONSTS.BUILD_INFO;
        let lkr = lkrEl.init();
        exEl.setRuntime(lkr);
        inspectEl.setRuntime(lkr);
        $$("#elk-web-init").addEventListener("elk-error", e => {
            $$("#elk-status-el").innerText = e.detail;
        });

        $$("#elk-logon").addEventListener("click", async (el) => {
            el.target.disabled = true;
            $$("#elk-status-el").innerText = "";
            idEl.unlock()
                .then(() => exEl.try_setup_exchange())
                .then(() => dialog.close())
                .catch(() => el.target.disabled = false);
        });
        const sp = new URLSearchParams(window.location.search);
        if (sp.get("unlock")){
            idEl.unlock();
        }
    }
}

customElements.define('elk-web-init', WebInit);

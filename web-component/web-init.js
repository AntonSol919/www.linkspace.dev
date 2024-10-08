import init, { CONSTS, lkr_save } from "../linkspace.js/linkspace.js";
await init();

import "./identity.js";
import "./lkrctr.js";
import "./exchange.js";
import "./point-builder.js";
import "./runtime-inspect.js";

class WebInit extends HTMLElement {
  setStatusMsg(msg, more) {
    this.statusEl.firstElementChild.innerText = msg;
    this.statusEl.insertAdjacentHTML("beforeend", "<li></li>");
    this.statusEl.lastElementChild.innerText = msg;
    if (more) {
      this.statusEl.lastElementChild.innerText += ": " + more;
    }
  }

  constructor() {
    super();

    this.attachShadow({
      mode: "open",
    }).innerHTML = /* HTML */ `
      <style>
        :host{
width:0px;
height:0px;
z-index:99;
        }

        #modal-btn {
          width: 32px;
          height: 32px;
          left: 4px;
          bottom: 4px;
          position: absolute;
        }
        :host.fullscreen #modal-btn {
          width: 32px;
          height: 32px;
          left: 4px;
          bottom: 4px;
          position: absolute;
        }



        #lkwc-web-init {
          color: rgba(0, 0, 0, 0.8);
          font-size: 0.8rem;
          display: flex;
          flex-flow: column;
          align-items: center;
          line-height: 2;

          & #lkwc-auto-logon {
            margin: 2rem;
          }
          & div {
            display: flex;
            flex-flow: column;
          }
          & #lkwc-status-el {
            border: 2px solid black;
            border-radius: 9px;
            padding-inline: 1ch;
            & > summary {
              list-style: none;
            }
            & > summary::-webkit-details-marker {
              display: none;
            }
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
      <dialog>
        <div id="lkwc-web-init">
          <button id="lkwc-logon">Log On</button
          ><input type="password" id="key-pass" placeholder="Secret" />

          <details>
            <summary>options</summary>

            <fieldset>
              <legend>identity</legend>
              <lkwc-identity></lkwc-identity>
            </fieldset>

            <lkwc-exchange></lkwc-exchange>

            <details>
              <summary>advanced</summary>
              <lkwc-lkrctr></lkwc-lkrctr>
              <fieldset>
                <legend>Point Builder</legend>
                <lkwc-point-builder></lkwc-point-builder>
              </fieldset>
              <lkwc-runtime-inspect></lkwc-runtime-inspect>
            </details>

            <span id="lkwc-build-info">Loading</span>
          </details>
          <details id="lkwc-status-el">
            <summary></summary>
          </details>
        </div>
      </dialog>
      <img id="modal-btn" src="../linkspace.js/mark.svg" />
    `;

    let $ = this.shadowRoot.querySelector.bind(this.shadowRoot);
    this.statusEl = $("#lkwc-status-el");
    this.addEventListener("error", (e) => this.setStatusMsg(e.detail));
    this.addEventListener("next-stage", (e) =>
      this.setStatusMsg(e.detail[0], e.detail[1]),
    );

    let dialog = $("dialog");
    this.dialog = dialog;
    dialog.showModal();
      this.addEventListener("click",function (ev){
          var rect = dialog.getBoundingClientRect();
          let inside = (ev.clientX > rect.left && ev.clientX < rect.right)
              && (ev.clientY > rect.top && ev.clientY < rect.bottom) ;
          if (!inside) {
              dialog.open ? dialog.close() : dialog.showModal();
          }
      });      

    let lkrEl = $("lkwc-lkrctr");
    let idEl = $("lkwc-identity");
    this.idEl = idEl;
    let exchangeEl = $("lkwc-exchange");
    this.exchangeEl = exchangeEl;
    let builderEl = $("lkwc-point-builder");
    let inspectEl = $("lkwc-runtime-inspect");

    idEl.mirrorSecretInput($("#key-pass"));
    lkrEl.addEventListener("lkr_open", (e) => console.log("lkr_open", e));
    builderEl.addEventListener("point", (e) => {
      lkr_save(lkrEl.lkr, e.detail);
    });
    idEl.addEventListener("unlock", (e) => {
      exchangeEl.setKey(e.detail);
      builderEl.setKey(e.detail);
    });

    $("#lkwc-build-info").innerText = CONSTS.BUILD_INFO;
    let lkr = lkrEl.init();
    exchangeEl.setRuntime(lkr);
    inspectEl.setRuntime(lkr);

    this.logonBtn = $("#lkwc-logon");
    this.logonBtn.addEventListener("click", () => this.logon("auto"));
    const sp = new URLSearchParams(window.location.search);
    let checkParam = (param) =>
      this.getAttribute(param) !== null || sp.get(param) !== null;

      let initStopAtStage = "start";
      for (let stage of ["unlock", "exchange", "auto"]) {
          if (checkParam(stage)) initStopAtStage = stage;
    }
    this.logon(initStopAtStage);
  }
  async logon(stopAtStage = "start") {

    if (stopAtStage === "start") return;
    this.logonBtn.disabled = true;

    try {
      await this.idEl.unlock();
      if (stopAtStage === "unlock") return;
      await this.exchangeEl.try_setup_exchange();
      if (stopAtStage === "exchange") return;
      this.dialog.close();
    } catch {
      this.logonBtn.disabled = false;
    }
  }
}

customElements.define("lkwc-web-init", WebInit);

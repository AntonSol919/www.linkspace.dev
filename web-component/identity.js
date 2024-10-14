import {
  initShared,
  lki_generate,
  lki_decrypt,
  lki_encrypt,
  lki_pubkey,
  b64,
} from "../linkspace.js/linkspace.js";

class Identity extends HTMLElement {
  mirrorSecretInput(el) {
    el.value = this.ePass.value;
    this.ePass.addEventListener("input", (e) => (el.value = e.target.value));
    this.ePass.addEventListener("change", (e) => (el.value = e.target.value));
    el.addEventListener("input", (e) => (this.ePass.value = e.target.value));
  }
  constructor() {
    super();

    this.attachShadow({
      mode: "open",
    }).innerHTML += /* HTML */ `
      <style>
        span {
          margin-block-end: 1em;
          display: inline-block;
        }
        label {
          position: absolute;
          color: lch(50% 0 0 / 0.5);
          font-size: 0.75em;
          transform: translate(0, -66%);
          &::after {
            position: absolute;
            content: "Copied!";
            font-size: 14px;
            visibility: hidden;
            opacity: 0;
            transition:
              opacity 0.1s ease,
              visibility 0.1s ease;
          }
          &.show::after {
            visibility: visible;
            opacity: 1;
          }
        }
        <!-- firefox eats disabled input clicks -->
        input[disabled] {
          pointer-events: none;
        }
input.passlike
{
          text-security: disc;
          -webkit-text-security: disc;
          &:hover {
            text-security: unset;
            -webkit-text-security: unset;
          }
        }
      </style>
      <form id="identity" method="dialog">
        <span>
          <label for="enckey" class="copyable">Encrypted Key </label>
          <input
            id="enckey"
            name="enckey"
            autocomplete="username"
            placeholder="leave empty to generate new"
          />
        </span>

        <span>
          <label class="copyable" for="pubkey">Public Key</label>
          <input
            id="pubkey"
            name="pubkey"
            disabled
            placeholder="Read from enckey"
          />
        </span>

        <span>
          <label for="pass">Secret</label>
          <input class="passlike" id="enckey-pass" name="enckey-pass" />
        </span>

        <span>
          <label for="save-pass">Save</label>
          <input id="save-pass" type="checkbox" name="save-pass" />
        </span>

        <div class="status"></div>
        <button id="unlock">ID</button>
        <button id="encrypt" style="display:none;">New Secret</button>
      </form>
    `;

    let $ = this.shadowRoot.querySelector.bind(this.shadowRoot);
    this.$ = $;
    this.eKey = $("#enckey");
    this.ePass = $("#enckey-pass");
    this.eSavePass = $("#save-pass");
    this.ePubkey = $("#pubkey");

    this.eKey.addEventListener("input", (e) => {
      this.eKey.setCustomValidity("");
      this.ePubkey.value = "";
      if (this.eKey.value == "") {
        return;
      }
      try {
        this.ePubkey.value = b64(this.pubkey() || "");
      } catch (e) {
        this.eKey.setCustomValidity("invalid encrypted key");
        this.ePubkey.value = "invalid encrypted key";
      }
      this.eKey.reportValidity();
    });
    this.eKey.value = localStorage.getItem("lkv_enckey");
    this.ePass.value = localStorage.getItem("lkv_password") || "";
    this.eSavePass.checked = this.ePass.value != "";

    $("#unlock").addEventListener("click", (e) => this.unlock());
    $("#encrypt").addEventListener("click", (e) => {
      let newPass = prompt("New password");
      if (newPass !== prompt("Repeat password"))
        return alert("different passwords - try again");
      this.ePass.value = newPass;
      // Between the hassle of dealing with lost keys or potential breaches of localStorage
      // the policy is that the overlap between "really needs security" and "uses this web interface" should be empty.
      let hist = localStorage.getItem("lkv_enckey_history") || "";
      localStorage.setItem("lkv_enckey_history", this.eKey.value + "\n" + hist);

      this.eKey.value = lki_encrypt(this.key, this.ePass.value);

      localStorage.setItem("lkv_enckey", this.eKey.value);
      localStorage.removeItem("lkv_password");
      if (this.eSavePass.checked)
        localStorage.setItem("lkv_password", this.ePass.value);
    });

    function copy() {
      let input = this.querySelector("input");
      if (!input.disabled) return;
      navigator.clipboard.writeText(input.value);
      let cm = this.closest("span").querySelector(".copyable");
      cm.classList.add("show");
      setTimeout(() => cm.classList.remove("show"), 1000);
    }
    for (let cMsg of this.shadowRoot.querySelectorAll(".copyable")) {
      cMsg.parentElement.addEventListener("click", copy);
    }
  }
  async connectedCallback() {
    await initShared();
    this.eKey.dispatchEvent(new Event("input"));
  }
  status(msg) {
    this.$(".status").innerText = msg;
  }
  // unlocking a strongly encrypted key is expensive. if speculative set to true avoids attempts with an empty password
  async unlock(speculative = false) {
    this.$("#unlock").disabled = true;
    if (this.key) return this.key;
    let pass = this.ePass.value;
    let enckey = this.eKey.value;
    let save_pass = this.eSavePass.checked;

    if (speculative && pass == "" && enckey.indexOf("$m=8,t=1") == -1) {
      return undefined;
    }
    this.dispatchEvent(cev("start-unlock", this.key));
    this.dispatchEvent(cev("next-stage", ["unlocking", this.ePubkey.value]));

    await new Promise((r) => setTimeout(r, 50));
    if (enckey != "") {
      this.status("Decrypting Key");
      try {
        this.key = lki_decrypt(enckey, pass);
      } catch (e) {
        this.status("wrong password");
        this.dispatchEvent(cev("error", "wrong password"));
        this.$("#unlock").disabled = false;
        throw e;
      }
    } else {
      this.status("Generating Key");
      this.key = lki_generate();
      this.ePubkey.value = b64(this.key.pubkey);
      this.status("Encrypting Key");
      enckey = lki_encrypt(this.key, pass);
      this.eKey.value = enckey;
    }
    localStorage.setItem("lkv_enckey", enckey);
    localStorage.removeItem("lkv_password");
    if (save_pass) localStorage.setItem("lkv_password", pass);
    this.status("Ok");
    for (let e of this.shadowRoot.querySelectorAll("input")) {
      e.disabled = true;
    }
    this.dispatchEvent(cev("unlock", this.key));
    this.dispatchEvent(cev("next-stage", ["unlocked", this.ePubkey.value]));
    this.$("#encrypt").style.display = "block";
    return this.key;
  }
  pubkey() {
    if (this.key) return this.key.pubkey;
    if (!this.eKey.value) return undefined;
    return lki_pubkey(this.eKey.value);
  }
}

customElements.define("lkwc-identity", Identity);
function cev(name, detail) {
  return new CustomEvent(name, { composed: true, bubbles: true, detail });
}



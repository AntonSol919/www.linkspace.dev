import init,{
    lki_generate,
    lki_decrypt,
    lki_encrypt,
    lki_pubkey,
    b64
} from '../linkspace.js/linkspace.js';

class Identity extends HTMLElement {

    mirrorSecretInput(el) {
        el.value = this.ePass.value;
        this.ePass.addEventListener("input", (e) =>
            el.value = e.target.value
        );
        el.addEventListener("input", e => this.ePass.value = e.target.value);

    }
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).innerHTML += `
<style>
span{ margin-block-end:1em; display: inline-block;}
label{
position: absolute;
  color: lch(50% 0 0 / 0.5);
  font-size: 0.75em;
  transform: translate(0, -56%);
}
</style>
<form id="identity" method="dialog">

<span>
<label for="enckey">Encrypted Key</label>
<input id="enckey" name="enckey" autocomplete="username" placeholder="leave empty to generate new" />
</span>

<span>
<label for="pubkey">Public Key</label>
<input id="pubkey" name="pubkey" disabled placeholder="Read from enckey"/>
</span>

<span>
<label for="pass">Secret</label>
<input type="password" id="enckey-pass" name="enckey-pass" />
</span>

<span>
<label for="save-pass">Save</label>
<input id="save-pass" type="checkbox" name="save-pass" />
</span>

<div class="status"></div>
<button id="unlock">ID</button>
</form>
`

        let $$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
        this.$$ = $$;
        this.eKey = $$("#enckey");
        this.ePass = $$("#enckey-pass");
        this.eSavePass = $$("#save-pass");


        this.eKey.addEventListener("input", e => {
            this.eKey.setCustomValidity("");
            $$("#pubkey").value = ""
            if (this.eKey.value == "") {
                return
            }
            try {
                $$("#pubkey").value = b64(this.pubkey() || "");
            } catch (e) {
                this.eKey.setCustomValidity("invalid encrypted key");
                $$("#pubkey").value = "invalid encrypted key";
            }
            this.eKey.reportValidity();
        });
        this.eKey.value = localStorage.getItem("lkv_enckey");
        this.ePass.value = localStorage.getItem("lkv_password") || "";
        this.eSavePass.checked = this.ePass.value != "";

        $$("#unlock").addEventListener("click", (e) => this.unlock());

    }
    async connectedCallback() {
        await init();
        this.eKey.dispatchEvent(new Event("input"));
    }
    status(msg) {
        this.$$(".status").innerText = msg;
    };
    async unlock() {
        this.$$("#unlock").disabled = true;
        if (this.key) return this.key;
        let pass = this.ePass.value;
        let enckey = this.eKey.value;
        let save_pass = this.eSavePass.checked;
        this.dispatchEvent(new CustomEvent("start-unlock", {
            composed: true,
            bubbles: true,
            detail: this.key
        }));
        await new Promise(r => setTimeout(r, 50)); 
        if (enckey != "") {
            this.status("Decrypting Key");
            try {
                this.key = lki_decrypt(enckey, pass);
            } catch (e) {
                this.status("wrong password");
                this.dispatchEvent(new CustomEvent("error", {
                    composed: true,
                    bubbles: true,
                    detail: "wrong password"
                }));
                this.$$("#unlock").disabled = false;
                throw e;
            }
        } else {
            this.status("Generating Key");
            this.key = lki_generate();
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
        this.dispatchEvent(new CustomEvent("unlock", {
            composed: true,
            bubbles: true,
            detail: this.key
        }));
        return this.key;
    }
    pubkey() {
        if (this.key) return this.key.pubkey;
        if (!this.eKey.value) return undefined;
        return lki_pubkey(this.eKey.value);
    }
}

customElements.define('elk-identity', Identity);

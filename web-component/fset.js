import init, {
  lka_encode,
  lkp_fset,
  lkp_fset_test,
  lkp_fset_test_values,
  lka_eval2str,
  lk_serialize,
  lk_deserialize,
} from "../linkspace.js/linkspace.js";
class FSet extends HTMLElement {
  fset = undefined;
  fset_str = "";

  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    }).innerHTML += /* HTML */ `
      <style>
        * {
          box-sizing: border-box;
        }
        textarea:invalid {
          background-color: lch(83% 112 58 / 19%);
        }
      </style>
      <div>
        <div id="matching-line"></div>
        <textarea disabled style="display:block;margin:0 auto"></textarea>
        <div id="status"></div>
      </div>
    `;
    this.$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
    this.patternEl = this.$("textarea");
    this.matchingLineEl = this.$("#matching-line");
  }

  catch_status(fnc) {
    this.$("#status").innerText = "";
    try {
      this.patternEl.setCustomValidity("");
      this.patternEl.reportValidity();
      return fnc();
    } catch (e) {
      this.$("#status").innerText = e.toString();
      this.patternEl.setCustomValidity(e.toString());
      this.patternEl.reportValidity();
    }
    return undefined;
  }

  test(value) {
    if (!value.group || !value.domain) throw new Error("Expected point ");
    this.matchingLineEl.innerText = "No match";
    this.value = value;
    let testMethod = this.value.hash ? lkp_fset_test : lkp_fset_test_values;
    this.matchIdx = this.catch_status(() => testMethod(this.fset, value));
    this.isMatch = this.matchIdx !== undefined;

    this.matchingLineEl.innerText = this.matchingPattern || "no matching entry";

      if (this.isMatch){
          this.patternEl.setCustomValidity("");
          this.patternEl.reportValidity();
      }

    this.dispatchEvent(
      new CustomEvent("test-result", {
        composed: true,
        bubbles: true,
        detail: {
          isMatch: this.isMatch,
          pattern: this.matchingPattern,
        },
      }),
    );

    return this.isMatch;
  }

  get matchingPattern() {
    return this.isMatch ? this.fset_str.split("\n")[this.matchIdx] : undefined;
  }

  addAlike(value = this.value) {
    let argv = [value.domain, value.group];
    let line = lka_eval2str("[0/?a0]:[/~?:[1]/#/@/b]:*", {
      argv,
    });
    let newStr = line + (this.fset_str != "" ? "\n" : "") + this.fset_str;
    this.patternEl.value = newStr;
    this.updatePattern(newStr);
  }
  updatePattern(fset_str) {
    this.fset = this.catch_status(() =>
      lkp_fset(fset_str, {
        lkr: this.lkr,
      }),
    );
    if (this.fset === undefined) return undefined;
    this.fset_str = fset_str;
    localStorage.setItem("lke-fset", this.fset_str);
    if (!this.value) return false;
    return this.test(this.value);
  }
  connectedCallback() {
    this.patternEl.disabled = false;
    this.patternEl.value = localStorage.getItem("lke-fset") || "";
    this.patternEl.addEventListener("input", (e) =>
      this.updatePattern(e.target.value),
    );
    init().then(() => this.updatePattern(this.patternEl.value));
  }
}

customElements.define("lkwc-fset", FSet);

import init, { lka_encode, lkc_fset, lkc_fset_test,lkc_fset_test_values,lka_eval2str} from '../linkspace.js/linkspace.js';
class FSet extends HTMLElement {
    values = {};
    point = undefined

    isMatch = false;
    matchIdx = undefined;

    inp = undefined;

    fset = undefined;
    fset_str = "";

    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).innerHTML += `
<style>
* {
  box-sizing: border-box;
}
</style>
<div>
<textarea disabled style='display:block;margin:0 auto'></textarea>
<div id="status"></div>
</div>
`;
        this.inp = this.shadowRoot.querySelector("textarea");
    }
    
    catch_status(fnc){
        this.shadowRoot.querySelector("#status").innerText = "";
        try {
            this.inp.style.borderColor = "black";
            this.inp.style.background = "white";
            return fnc();
        } catch (e) {
            this.inp.style.borderColor = "red";
            this.shadowRoot.querySelector("#status").innerText = e.toString();
        }
        return undefined;
    }

    test_point(point){
        this.point = point;
        this.matching = point;
        this.matchIdx = this.catch_status(() => lkc_fset_test(this.fset, this.point));

        this.emitTestResult();
        return this.isMatch;
    }
    test_values({group, domain, pubkey}){
        this.values = {group,domain,pubkey};
        this.matching = this.values;
        this.matchIdx = this.catch_status(() => lkc_fset_test_values(this.fset, this.values));

        this.emitTestResult();
        return this.isMatch;
    }
    emitTestResult(){
        this.isMatch = this.matchIdx !== undefined;
        this.inp.style.background = this.isMatch ? "lch(67% 57 141)" : "lch(50% 57 45)";
        this.dispatchEvent(new CustomEvent("test-result", {
            composed: true, bubbles: true, detail: {
                isMatch: this.isMatch,
                line: this.isMatch ? this.fset_str.split("\n")[this.matchIdx] : undefined
            }
        }));
    }
    addAlike(matching) {
        if (!matching) matching = this.matching;
        let domain = lka_encode(matching.domain,"a");
        let argv = [matching.domain, matching.group];
        let line = lka_eval2str(
            "[0/?a0]:[/~?:[1]/#/@/b]:*",
            {argv}
        );
        let newStr = line + (this.fset_str != "" ? "\n" : "") +this.fset_str;
        this.inp.value = newStr;
        this.update(newStr);
    }
    update(fset_str) {
        this.fset = this.catch_status(() => lkc_fset(fset_str, { lkr: this.lkr }));
        if (this.fset === undefined) return undefined;
        this.fset_str = fset_str;
        localStorage.setItem("lke-fset", this.fset_str);
        if (!this.matching) return undefined;
        return this.matching.hash ?  this.test_point(this.matching) : this.test_values(this.matching);
    }
    connectedCallback() {

    }
    init() {
        this.inp.disabled = false;
        this.inp.value = localStorage.getItem("lke-fset") || "";
        this.update(this.inp.value);
        this.inp.addEventListener(("input"), (e) => this.update(e.target.value));
    }
}

customElements.define('elk-fset', FSet);

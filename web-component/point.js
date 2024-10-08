const DEFAULT = "text";
const FORMATS = {
    'html': (point,data) => point.toHTML(data),
    'text': (point,data) => `<pre>${point.toString(data)}</pre>`,
    'json': (point,data) => `<pre>${JSON.stringify(JSON.parse(point.toJSON(data)),null, 2)}</pre>`
};

const OPTIONS_EL = document.createRange().createContextualFragment(Object.keys(FORMATS).map((key) => `<label>
    <input type="radio" name="fmt" value="${key}" ${key == DEFAULT ? "checked" : ""} > ${key}
</label>`).join(""));


let DOC_STYLE = false;
class Point extends HTMLElement {
    static observedAttributes = ["fmt", "data"];

    _point = null;

    refresh(){
        if (!this.inner) return;
        this.inner.innerHTML = "";
        if (!this._point?.hash) return;
        this.inner.insertAdjacentHTML("beforeend", FORMATS[this.fmt](this._point,this.data ? 99999 : 0));
    }
    set data(v) { this.setAttribute("data", v && true);}
    get data() { return this.getAttribute("data") != undefined;}
    set fmt(v) { this.setAttribute("fmt", v || DEFAULT); }
    get fmt() { return this.getAttribute("fmt") || DEFAULT; }

    attributeChangedCallback(name, _oldValue, _newValue) {
        this.refresh();
    }


    get point() {
        return this._point;
    }
    set point(point) {
        this._point = point;
        this.refresh();
    }

    constructor(point = null) {
        super();
        this._point = point;
        if (!DOC_STYLE){
            document.head.insertAdjacentHTML("beforeend",/* HTML */ `<style id='lkwc-point'>
             lkwc-point{
                & > #point-fmt { display : block;}
                & > *{ display: none;}
             }
             lkwc-point.options{
                & > * { display : block;}
             }
</style>
            `);
            DOC_STYLE = document.head.querySelector("#lkwc-point");
        }
        this.addEventListener("contextmenu", function toggleMinimal(e) {
            this.classList.toggle("options");
            e.preventDefault();
        });
    }

    connectedCallback(){
        this.innerHTML =  /* HTML */ `<span class="point-fmt-options"></span>
<div id="point-fmt">${this.getAttribute("placeholder") || ""}</div>
<label>Show data</label><input class="lkwc-incl-data" type="checkbox">`;


        this.inner = this.querySelector("#point-fmt");

        
        let inputs = this.querySelector(".point-fmt-options");
        inputs.appendChild(OPTIONS_EL.cloneNode(true));
        inputs.addEventListener("input",function setFmt(ev){
            this.parentElement.fmt = ev.target.value;
        });
        this.querySelector(".lkwc-incl-data").addEventListener("input",function(e){
            this.parentElement.data = e.target.checked;
        });
        this.refresh();
    }
}

customElements.define('lkwc-point', Point);

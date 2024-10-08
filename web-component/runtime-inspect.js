import { lkq_new , lkq_space, lkq_stringify, lkr_await_write,lkr_process,lkr_scan,lkr_tap} from '../linkspace.js/linkspace.js';

class RuntimeInspect extends HTMLElement {
    async setRuntime(lkr){
        this.lkr = lkr;
        while (this.lkr == lkr) {
            await lkr_await_write(lkr);
            lkr_process(lkr);
        }
    }
    constructor() {
        super();
        this.points = [];
        this.format = "text";

        this.attachShadow({
            mode: 'open'
        }).innerHTML += /* HTML */ `
<fieldset>
<legend>Inspect</legend>
<input id="spacexpr"/><br>
<pre id="query-str" contenteditable spellcheck="false"></pre>
<span></span>
<ol>
</ol>
</fieldset>
`;
        let $ = this.shadowRoot.querySelector.bind(this.shadowRoot);
        this.queryEl = $("#query-str");
        this.spaceEl = $("#spacexpr");
        this.ol = $("ol");
        this.status = $("span");
        this.spaceEl.addEventListener("keyup",(e) => {
            try {
                this.updateQuery(lkq_stringify(lkq_space(e.target.value),true));
            }catch(e){
                this.status.innerText = e.message;
            }
        });
        this.queryEl.addEventListener("keyup",(e) => {
            this.updateQuery();
        });
    }

    updateQuery(qstr){
        if(qstr) this.queryEl.innerText = qstr;
        this.status.innerText = "";
        try{
            this.query = lkq_new(this.queryEl.innerText);
        }catch(e){
            this.status.innerText = e.message;
            return;
        }
        this.ol.replaceChildren();
        lkr_scan(this.lkr,this.query,(p) => this.push(p));
    }
    push(point){
        this.ol.insertAdjacentHTML("beforeend",`<li><pre>${point.toString()}</pre></li>`);
        this.ol.lastElementChild.point = point;
    }
}

customElements.define('lkwc-runtime-inspect',RuntimeInspect);

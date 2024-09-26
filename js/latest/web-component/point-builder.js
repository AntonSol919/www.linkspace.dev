
import { lk_datapoint, lk_linkpoint, lk_keypoint, lka_space_expr,lka_split_parts,lka_eval_parts,Link} from '../linkspace.js/linkspace.js';

class PointBuilder extends HTMLElement {
    static observedAttributes = ["space","links","data","keypoint","linkpoint","datapoint"];

    set space(v) { this.setAttribute("space", v || "");  }
    get space(){return this.getAttribute("space");}
    set links(v) { return this.setAttribute("links", v || ""); }
    get links() { return this.getAttribute("links"); }
    set data(v) { this.setAttribute("data", v || ""); }
    get data() { return this.getAttribute("data"); }

    attributeChangedCallback(name, oldValue, newValue) {
        const map = {
            "space":() => {this.$$("[name='space']").value=newValue; this.emitPreviewSpace();},
            "links": () => {
                let tEl = this.$$("[name='links']");
                tEl.value = "";
                lka_split_parts(newValue, (ctr,v) => {
                    tEl.value += ctr === "/" ? "\n" : ctr;
                    tEl.value += v;
                });
            },
            "data": () => this.$$("[name='data']").value = newValue,
            "keypoint": () => this.$$("button[value='keypoint']").style.display = newValue,
            "linkpoint": () => this.$$("button[value='linkpoint']").style.display = newValue,
            "datapoint": () => this.$$("button[value='datapoint']").style.display = newValue,
        };
        map[name]();
    }

    setKey(key){
        this.key = key;
        this.shadowRoot.querySelector('button[value="keypoint"]').disabled = false;
        this.emitPreviewSpace();
    }
    emitPreviewSpace(){
        try{
            let [domain, group, path] = lka_space_expr(this.formdata().get("space"));
            this.dispatchEvent(new CustomEvent("preview-space", {
                composed: true,
                bubbles: true,
                detail: {domain,group,path,pubkey: this.key && this.key.pubkey}
            }));
        }catch(e){
            console.warn(e);
        }
    }
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).innerHTML += `
<style>
#inputs{
display:inline-grid; 
grid-template-columns: max-content 1fr;
}
</style>
<form class="point-builder" method="dialog">
<span id="inputs">
 <label for="space">Space</label>
 <input type="text" name="space" />

<label for="data">Data</label>
<input type="text" name="data" />

<label for="links">links</label>
<textarea name="links">
</textarea>
</span>

<div>
<button type="submit" name='build' value="datapoint" >Datapoint</button>
<button type="submit" name='build' value="linkpoint" >Linkpoint</button>
<button type="submit" name='build' value="keypoint" disabled >Keypoint</button>
</div>
<span id="status"></status>
</form>
`;
        let $$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
        this.$$=$$;
        $$(".point-builder").addEventListener("submit",(e)=>{
            e.preventDefault();
            $$("#status").innerText = "";
            this.emitBuild(e.submitter.value);
        });
        this.$$("[name='space']").addEventListener("change",()=>this.emitPreviewSpace());
    }
    emitBuild(kind = "linkpoint"){
        this.point = undefined;
        try {
            this.point = this["build_" + kind]();
        } catch (e) {
            this.$$("#status").innerText = e.message;
            return this.point;
        }
        this.dispatchEvent(new CustomEvent("point", {
            composed: true,
            bubbles: true,
            detail: this.point
        })); 
        return this.point;
    }

    formdata(){
        return new FormData(this.$$(".point-builder"));
    }
    build_datapoint(){
        let formdata = this.formdata();
        return lk_datapoint(formdata.get("data"));
    }
    build_linkpoint(){
        let formdata = this.formdata();

        let [domain, group,path] = lka_space_expr(formdata.get("space"));
        let links = getLinks(formdata);
        return lk_linkpoint(formdata.get("data"), {domain,group,path,links});
    }
    build_keypoint(){
        let formdata = this.formdata();
        let [domain, group,path] = lka_space_expr(formdata.get("space"));
        let links = getLinks(formdata);
        return lk_keypoint(this.key , formdata.get("data"), {domain,group,path,links});
    }

}

function getLinks(conf){
    let txt = conf.get("links");
    let links = [];
    if (txt == "") return links;
    for (let line of txt.split("\n")){
        let args = [];
        lka_eval_parts(":"+line,(c,e) => {
            if (c != ":") throw new Error("Unexpected ctr char :"+c);
            args.push(e);
        });
        if (args.length != 2) throw Error("expected tag:ptr");
        links.push(args);
    }
    return links;
}

customElements.define('elk-point-builder', PointBuilder);

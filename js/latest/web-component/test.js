
class EVTest extends HTMLElement {
    
    constructor() {
        super();
        console.log("create",this);
    }
    connectedCallback(){
        console.log("connect",this);
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `<div><button>click</button></div>`;
        setTimeout(()=>this.triggerEv("timeout",this), 1234);
        this.shadowRoot.querySelector("button")
            .addEventListener("click",(e)=>this.triggerEv("click",e.target));
    }
    disconnectedCallback(e){
        console.log("disconnect",this,e);
    }
    triggerEv(st,from){
        console.log("dispatch"+st,this);
        from.dispatchEvent(new CustomEvent("test", {
            composed:true,
            bubbles:true,
            detail: st+"+test"
        }));
    }
}

customElements.define('ev-test', EVTest);


const format = {
    'html':(point) => point.toHTML(),
    'text':(point) =>`<pre>${point.toString()}</pre>`,
    'json':(point) =>`<pre>${JSON.stringify(JSON.parse(point.toJSON()))}</pre>`
};

class PointLog extends HTMLElement {
    push(point){
        this.ol.insertAdjacentHTML("beforeend",`<li>${format[this.format](point)} </li>`);
        this.ol.lastElementChild.point = point;
    }
    reformat(){
        for (let el of this.ol.children){
        }
    }
    take(){
        let lst = [...this.ol.children].map(e => e.point);
        this.ol.replaceChildren();
        return lst;
    }
    constructor() {
        super();
        this.points = [];
        this.format = "text";

        this.attachShadow({
            mode: 'open'
        }).innerHTML += `<div>
<ol>
</ol>
</div>
`;
        this.ol = this.shadowRoot.querySelector("ol");
    }
}

customElements.define('elk-point-log', PointLog);

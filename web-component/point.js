const DEFAULT = "text";
const FORMATS = {
  html: (point, data) => point.toHTML(data),
  text: (point, data) => `<pre>${point.toString(data)}</pre>`,
  json: (point, data) =>
    `<pre>${JSON.stringify(JSON.parse(point.toJSON(data)), null, 2)}</pre>`,
};

let DOC_STYLE = false;
class Point extends HTMLElement {
  static observedAttributes = ["fmt", "data"];
  static optionsHTMLFragment(selected = DEFAULT) {
    let inputs = Object.keys(FORMATS)
      .map(
        (key) =>
          /* HTML */ `<label>
            <input
              type="radio"
              name="fmt"
              value="${key}"
              ${key == selected ? "checked" : ""}
            />
            ${key}
          </label>`,
      )
      .join("");
    return `<form><div class="point-fmt-options"> ${inputs}</div>
<label>Show data<input name="data" class="lkwc-incl-data" type="checkbox"></label></form>`;
  }

  _point = null;

  refresh() {
    if (!this.inner) return;
    this.inner.innerHTML = "";
    if (!this._point?.hash) return;
    this.inner.insertAdjacentHTML(
      "beforeend",
      FORMATS[this.fmt](this._point, this.data ? 99999 : 0),
    );
  }
  set data(v) {
    v ? this.setAttribute("data", v) : this.removeAttribute("data");
  }
  get data() {
    return this.getAttribute("data") !== null;
  }
  set fmt(v) {
    this.setAttribute("fmt", v || DEFAULT);
    let s = this.querySelector(`input[value='${v}']`);
    if (!s) return;
    s.select();
  }
  get fmt() {
    return this.getAttribute("fmt") || DEFAULT;
  }

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
    if (!DOC_STYLE) {
      document.head.insertAdjacentHTML(
        "beforeend",
        /* HTML */ `<style id="lkwc-point">
          lkwc-point {
            & > .point-fmt {
              display: block;
            }
            & > * {
              display: none;
            }
          }
          lkwc-point.options {
            & > * {
              display: block;
            }
          }
        </style> `,
      );
      DOC_STYLE = document.head.querySelector("#lkwc-point");
    }
    this.addEventListener("contextmenu", toggleMinimal);
  }

  connectedCallback() {
    // We're not using a shadowRoot as it was noticeably laggy when many points are rendered.
    let html =
      Point.optionsHTMLFragment(this.fmt) +
      `<div class="point-fmt">${this.getAttribute("placeholder") || ""}</div>`;
    this.innerHTML = html;
    this.inner = this.querySelector(".point-fmt");

      this.addEventListener("input", setAttr);
    let inputs = this.querySelector(".point-fmt-options");
    let incdata = this.querySelector(".lkwc-incl-data");
    incdata.checked = this.getAttribute("data");
    incdata.addEventListener("input", setAttr);
    this.refresh();
  }
}
function setAttr(ev) {
    this[ev.target.getAttribute("name")] = ev.target.getAttribute("value") || ev.target.checked;
}

function toggleMinimal(e) {
  this.classList.toggle("options");
  e.preventDefault();
}
customElements.define("lkwc-point", Point);
export default Point;

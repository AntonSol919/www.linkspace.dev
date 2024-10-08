const ACCEPTED_OPTIONS = new Set([
  "required",
  "readonly",
  "disabled",
  "pattern",
  "min",
  "max",
  "minlength",
  "maxlength",
  "step",
  "class",
  "placeholder",
  "value",
  "autocomplete",
  "autofocus",
  "spellcheck",
  "inputmode",
  "checked",
  "size",

  // special options
  "optional", // don't add required
  "label",
]);

class ParamsPrompt extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: "open",
    }).innerHTML +=
      /* HTML */
      `<style>
          label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
          }
          input {
            padding: 5px;
            margin-bottom: 10px;
            width: 100%;
            box-sizing: border-box;
          }
input.passlike{
   text-security:disc;
    -webkit-text-security:disc;
 &:hover{
   text-security: unset;
   -webkit-text-security:unset;
  }

}

          input:user-invalid {
            background-color: lch(83% 112 58 / 19%);
          }
        </style>
        <form id="prompts" action="#"></form> `;
    this.$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
    this.replaceMap = {};
    const sp = new URLSearchParams(window.location.search);
    this.setup = {};
    sp.forEach((promptOptions, keyName) => {
      if (!keyName.startsWith("input")) {
        return;
      }
      const [_prompt, key = "input"] = keyName.split(/:(.*)/s);
      const [type = "text", ...options] = promptOptions.split("_");
      if (this.setup[key] !== undefined) console.error(key + " key used twice");

      let optionsList = options
        .map((opt) => opt.split(":"))
        .filter(([k, _]) =>
          ACCEPTED_OPTIONS.has(k) ? true : console.warn(`${k} is not accepted`),
        );

      this.setup[key] = { key, type, options: Object.fromEntries(optionsList) };
    });
  }
  connectedCallback() {
    const formContainer = this.$("#prompts");
    // Loop through parameters looking for "prompt" keys
    for (let [key, { type, options }] of Object.entries(this.setup)) {
      let label = options["label"] || key;
      const labelElement = document.createElement("label");
      labelElement.textContent = label;
      labelElement.setAttribute("for", key);
      const inputElement = document.createElement("input");
      for (let [key, val] of Object.entries(options)) {
        inputElement.setAttribute(key, val);
      }
      if (!("optional" in options)) {
        inputElement.setAttribute("required", "true");
      }
      if (type == "password") {
        inputElement.type = "text";
          inputElement.classList.add("passlike");
        inputElement.setAttribute("autocomplete", "off");
      } else {
        inputElement.type = type;
      }
      inputElement.placeholder = label;
      inputElement.name = key;
      inputElement.id = key;

      labelElement.appendChild(inputElement);
      formContainer.appendChild(labelElement);
      this.replaceMap[key] = inputElement;
      inputElement.addEventListener("input", () => this.emitValidity());
    }
    this.emitValidity();
  }
  emitValidity() {
    this.dispatchEvent(
      new CustomEvent("validity", {
        composed: true,
        bubbles: true,
        detail: this.valid,
      }),
    );
  }
  get valid() {
    return Object.values(this.replaceMap).every((el) => el.validity.valid);
  }
  get keyValues() {
    return Object.fromEntries(
      Object.entries(this.replaceMap)
        .filter(([k, el]) => el.value || el.getAttribute("required") != null)
        .map(([k, el]) => [k, el.value]),
    );
  }
  get length() {
    return Object.keys(this.replaceMap).length;
  }

  template(templateStr) {
    return template(templateStr, this.keyValues);
  }
}
customElements.define("params-prompt", ParamsPrompt);

function template(template, values) {
  const regex = /\$\{(.*?)\}/g;
  let result = "";
  let lastIndex = 0;
  const unusedKey = new Set(Object.keys(values));
  let match;
  while ((match = regex.exec(template)) !== null) {
    const [placeholder, key] = match;
    const startIndex = match.index;
    // Add string segment before the placeholder
    result += template.slice(lastIndex, startIndex);

    // Check if key exists in values, else throw an error
    if (values.hasOwnProperty(key)) {
      result += values[key]; // Replace placeholder with value
      unusedKey.delete(key);
    } else {
      throw new Error(`Key '${key}' not found in values.`);
    }

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last placeholder
  result += template.slice(lastIndex);
  if (unusedKey.size != 0) throw new Error(`Unused keys '${[...unusedKey]}'`);

  return result;
}

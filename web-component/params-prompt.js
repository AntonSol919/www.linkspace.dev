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
  constructor(params) {
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
          input.passlike {
            text-security: disc;
            -webkit-text-security: disc;
            &:hover {
              text-security: unset;
              -webkit-text-security: unset;
            }
          }

          input:user-invalid {
            background-color: lch(83% 112 58 / 19%);
          }
        </style>
        <form id="prompts" action="#">
<input disabled id='config' style='display:none;'/>

</form> `;
    this.$ = this.shadowRoot.querySelector.bind(this.shadowRoot);
      this.config = this.$("#config");
    if (params == undefined) {
      params = this.getAttribute("params") || window.location.search;
    }

    this.setFromSearchParams(params);
  }
  setFromSearchParams(string) {
      this.config.value = string;
    let list = [...new URLSearchParams(string).entries()].filter(([key, val]) =>
        key.startsWith("input:"),
    ).map(([key, val]) => [key.split(/:(.*)/s)[1],val]);
    this.trySetPrompt(list);
  }
  trySetPrompt(obj) {
    try {
        this.setPromptEntries(obj);
    } catch (e) {
        this.config.display = "block";
        this.config.setCustomValidity("Can't build form - bad options:"+ e.toString());
        this.config.reportValidity();
    }
  }
  setPromptEntries(list) {
      this.setupList =[];
      this.setup = {};
      this.inputElements = {};
      const formContainer = this.$("#prompts");
      formContainer.replaceChildren(this.config);

      if (list.length == 0)return;
      if (typeof list ==='string') list = list.split(/[\n&]/).map((line)=>line.split(/=(.*)/s));

      list.forEach(([key, promptOptions= ""]) => {
        this.setupList.push([key,promptOptions]);
        key= key|| "input";
      const [type = "text", ...options] = promptOptions.split("_");
      if (this.setup[key] !== undefined)
        throw new Error(key + " key used twice ");

      let optionsList = options.map((opt) => opt.split(":"));
      for (let [k, _] of optionsList) {
        if (!ACCEPTED_OPTIONS.has(k)) throw new Error(`${k} is not accepted`);
      }

      this.setup[key] = { key, type, options: Object.fromEntries(optionsList) };
    });

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
      this.inputElements[key] = inputElement;
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
    return Object.values(this.inputElements).every((el) => el.validity.valid) && this.config.validity.valid;
  }
  get keyValues() {
    return Object.fromEntries(
      Object.entries(this.inputElements)
        .filter(([k, el]) => el.value || el.getAttribute("required") != null)
        .map(([k, el]) => [k, el.value]),
    );
  }
  get length() {
    return Object.keys(this.inputElements).length;
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

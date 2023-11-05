import init,* as linkspace from '/pkg/latest/linkspace.js';
const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
// Setup clickable tabs
document.addEventListener('DOMContentLoaded', () =>
    document.querySelectorAll(".ctabs").forEach((outer, i) => [...outer.children].forEach((el, j) => {

        let forName = `tabs${i}`;
        let checkedEl = window.localStorage.getItem(forName) || 0;
        let checkbox = `
<input
name="${forName}"
tabindex="${i}"
type="radio"
id="tab${i}x${j}"
${j == checkedEl ? "checked" : ""}
/>
<label for="tab${i}x${j}" class="checkbox-${el.classList[0]}" >${el.className}</label>`;

        el.insertAdjacentHTML(
            "beforebegin", checkbox
        );
        outer.querySelector(`#tab${i}x${j}`).addEventListener("change", () => {
            window.localStorage.setItem(forName, j);
        })
        el.setAttribute("tabindex", i);
    }))
);

let elements = {};
document.addEventListener('DOMContentLoaded', (_) => {
    document.querySelectorAll('pre.src').forEach((el) => {
        let lang = el.classList[1].slice(4);
        el.classList.add("language-" + lang);
        hljs && hljs.highlightElement(el);
        let list = elements[lang] || [];
        list.push(el);
        elements[lang] = list;
    });
    setupLiveJavascript(elements['js'])
});


const range = document.createRange();
let activeLogEl
let log = function(...args) {
    console.log.apply(console, args);
    for (let i of args) {
        let el = range.createContextualFragment("<pre class='logcall' ></pre>").firstElementChild;
        el.innerHTML = i;
        activeLogEl.appendChild(el);
    }
}
function callUserFunc(codeEl, logEl) {
        console.log(build_info());
        logEl.innerHTML = '';
        activeLogEl = logEl;
        try {
            let func = Function(codeEl.innerText);
            let result = func();
            if (result !== undefined) {
                log("<output>");
                log(result);
            }
            codeEl.innerHTML = codeEl.innerText;
            codeEl.attributes.removeNamedItem("data-highlighted");
            hljs.highlightElement(codeEl);
        } catch (e) {
            logEl.innerHTML += "Error:" + e;
        }
    }

    function jsInteract(codeEl) {
        const execBtn = range.createContextualFragment("<button class='run'>run</button>").firstElementChild;
        const logEl = range.createContextualFragment("<pre class='example'>Loading...</pre>").firstElementChild;
        codeEl.parentElement.appendChild(execBtn);
        codeEl.parentElement.appendChild(logEl);
        execBtn.onclick = function() {
            callUserFunc(codeEl, logEl);
        };
        execBtn.onclick();
        codeEl.contentEditable = true;
    }
async function setupLiveJavascript(jsCodeElements) {
    await init();
    Object.assign(window, linkspace);
    window.log = log;
    for( var codeEl of jsCodeElements){
        jsInteract(codeEl)
    }
}
